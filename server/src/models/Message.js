import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    subject: {
      type: String,
      trim: true,
      default: 'No Subject'
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    isRead: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
