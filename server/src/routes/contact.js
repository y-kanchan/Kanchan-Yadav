import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact message
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic Validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  // Email format validation
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  try {
    const newMessage = new Message({
      name,
      email,
      subject: subject || 'No Subject',
      message
    });

    await newMessage.save();

    console.log(`[Contact Form] New message from ${name} (${email}): "${subject}"`);
    
    // Optional: Add email notifications here if SMTP config is provided in .env
    // (We log this action so the developer can expand it easily)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`[Contact Form] SMTP credentials found. Simulating email notification to ${process.env.CONTACT_EMAIL}...`);
      // Here, you would configure nodemailer to send the mail
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received and saved.'
    });
  } catch (error) {
    console.error(`Error saving message: ${error.message}`);
    res.status(500).json({ message: 'Server error. Failed to save message.' });
  }
});

// @route   GET /api/contact/messages
// @desc    Get all messages (for admin purposes)
// @access  Private (Simulated as Public for this showcase backend, should be secured in production)
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
