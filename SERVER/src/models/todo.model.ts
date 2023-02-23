import mongoose, { model, Schema } from 'mongoose';

const todoScheme = new Schema(
  {
    title: {
      required: true,
      type: String,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['pending', 'done', 'archived'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Todo = mongoose.model('Todo', todoScheme);
export default Todo;
