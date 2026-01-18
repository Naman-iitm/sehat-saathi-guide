import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    tags: string[];
    upvotes: mongoose.Types.ObjectId[];
    downvotes: mongoose.Types.ObjectId[];
    score: number; // Calculated field (upvotes - downvotes)
    views: number;
    isFlagged: boolean; // For moderation
    createdAt: Date;
    updatedAt: Date;
}

const postSchema = new Schema<IPost>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [5, 'Title must be at least 5 characters'],
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            minlength: [20, 'Content must be at least 20 characters'],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: {
            type: [String],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 5; // Max 5 tags
                },
                message: 'You can add up to 5 tags only',
            },
        },
        upvotes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        downvotes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        views: {
            type: Number,
            default: 0,
        },
        isFlagged: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        prettify: true,
    }
);

// Index for search
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

export const Post = mongoose.model<IPost>('Post', postSchema);
