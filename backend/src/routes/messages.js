const express = require('express');
const Message = require('../models/Message');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * 💬 GET /api/messages/:userId
 * Get message history between current user and specified user
 */
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const messages = await Message.find({
      $or: [
        { senderID: currentUserId, receiverID: userId },
        { senderID: userId, receiverID: currentUserId }
      ]
    })
    .sort({ timestamp: 1 })
    .limit(100); // Limit to last 100 messages

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

/**
 * 💬 POST /api/messages
 * Save encrypted message (backup to database)
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverID, encryptedPayload, iv, hmac } = req.body;
    
    if (!receiverID || !encryptedPayload || !iv || !hmac) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = new Message({
      senderID: req.userId,
      receiverID,
      encryptedPayload,
      iv,
      hmac,
      timestamp: new Date()
    });

    await message.save();

    res.status(201).json({ 
      message: 'Message saved successfully',
      messageId: message._id
    });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

/**
 * 💬 PUT /api/messages/:messageId/delivered
 * Mark message as delivered
 */
router.put('/:messageId/delivered', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.messageId, {
      isDelivered: true
    });

    res.json({ message: 'Message marked as delivered' });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

/**
 * 💬 PUT /api/messages/:messageId/read
 * Mark message as read
 */
router.put('/:messageId/read', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.messageId, {
      isRead: true
    });

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Update message error:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

module.exports = router;
