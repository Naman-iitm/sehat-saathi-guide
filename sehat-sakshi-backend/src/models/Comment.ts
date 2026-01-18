import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    content: string;
    author: mongoose.Types.ObjectId;
    post: mongoose.Types.ObjectId;
    parentComment?: mongoose.Types.ObjectId; // For nested replies
    upvotes: mongoose.Types.ObjectId[];
    downvotes: mongoose.Types.ObjectId[];
    score: number;
    isFlagged: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        content: {
            type: String,
            required: [true, 'Content is required'],
            minlength: [1, 'Comment cannot be empty'],
            maxlength: [1000, 'Comment cannot exceed 1000 characters'],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: null,
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
        isFlagged: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
