const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  encryptedPayload: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  hmac: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
messageSchema.index({ senderID: 1, receiverID: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
