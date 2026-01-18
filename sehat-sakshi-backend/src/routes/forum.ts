import { Router, Response } from 'express';
import { Post } from '../models/Post';
import { Comment } from '../models/Comment';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { moderateContent } from '../middleware/moderation';
import { AppError } from '../utils/errors';

const router = Router();

// --- POSTS ---

/**
 * @route   GET /api/forum/posts
 * @desc    Get all posts with pagination and sorting
 */
router.get('/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sort = (req.query.sort as string) || '-createdAt';
        const tag = req.query.tag as string;
        const search = req.query.search as string;

        const query: any = {};
        if (tag) query.tags = tag;
        if (search) {
            query.$text = { $search: search };
        }

        const posts = await Post.find(query)
            .populate('author', 'name profilePic reputationPoints')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Post.countDocuments(query);

        res.json({
            posts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   GET /api/forum/posts/:id
 * @desc    Get a single post by ID including comments
 */
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'name profilePic reputationPoints');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/forum/posts
 * @desc    Create a new post
 */
router.post('/posts', protect, moderateContent, async (req: AuthRequest, res: Response) => {
    try {
        const { title, content, tags } = req.body;

        const post = await Post.create({
            title,
            content,
            tags,
            author: (req.user as any)._id,
        });

        const populatedPost = await Post.findById(post._id).populate('author', 'name profilePic');

        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/forum/posts/:id/vote
 * @desc    Upvote or Downvote a post
 */
router.put('/posts/:id/vote', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { type } = req.body; // 'upvote' or 'downvote'
        const userId = (req.user as any)._id;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove existing vote if any
        post.upvotes = post.upvotes.filter((id) => id.toString() !== userId.toString());
        post.downvotes = post.downvotes.filter((id) => id.toString() !== userId.toString());

        if (type === 'upvote') {
            post.upvotes.push(userId);
        } else if (type === 'downvote') {
            post.downvotes.push(userId);
        }

        post.score = post.upvotes.length - post.downvotes.length;
        await post.save();

        // Update author reputation logic could go here
        // e.g. await User.findByIdAndUpdate(post.author, { $inc: { reputationPoints: type === 'upvote' ? 5 : -2 } });

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --- COMMENTS ---

/**
 * @route   GET /api/forum/posts/:id/comments
 * @desc    Get comments for a post (threaded)
 */
router.get('/posts/:id/comments', async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', 'name profilePic reputationPoints')
            .sort('createdAt'); // Get all flat, frontend can build tree or build tree here

        // Building a tree structure for nested comments is often easier on Frontend,
        // otherwise we use a recursive function here.
        // For simplicity, returning flat list.
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   POST /api/forum/posts/:id/comments
 * @desc    Add a comment to a post
 */
router.post('/posts/:id/comments', protect, moderateContent, async (req: AuthRequest, res: Response) => {
    try {
        const { content, parentComment } = req.body;
        const postId = req.params.id;

        const comment = await Comment.create({
            content,
            post: postId,
            author: (req.user as any)._id,
            parentComment: parentComment || null,
        });

        const populatedComment = await Comment.findById(comment._id).populate('author', 'name profilePic');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @route   PUT /api/forum/comments/:id/vote
 * @desc    Vote on a comment
 */
router.put('/comments/:id/vote', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { type } = req.body;
        const userId = (req.user as any)._id;
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        comment.upvotes = comment.upvotes.filter((id) => id.toString() !== userId.toString());
        comment.downvotes = comment.downvotes.filter((id) => id.toString() !== userId.toString());

        if (type === 'upvote') comment.upvotes.push(userId);
        else if (type === 'downvote') comment.downvotes.push(userId);

        comment.score = comment.upvotes.length - comment.downvotes.length;
        await comment.save();

        res.json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
