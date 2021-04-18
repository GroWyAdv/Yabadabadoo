const mongoose = require('mongoose');

const Players = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    default: 3000
  },

  // Lotto
  lottoWinTimes: {
    type: Number,
    default: 0
  },
  lottoWinDelay: {
    type: Date,
    default: 0
  },

  // Shop
  shields: {
    type: Number,
    default: 0
  },
  shieldsDelay: {
    type: Date,
    default: 0
  },
  lottoTickets: {
    type: Number,
    default: 0
  },

  // Daily
  dailyLast: {
    type: Date,
    default: 0
  },
  dailyTimes: {
    type: Number,
    default: 0
  },

  // Weekly
  weeklyLast: {
    type: Date,
    default: 0
  },
  weeklyTimes: {
    type: Number,
    default: 0
  },

  // Rob
  robLast: {
    type: Date,
    default: 0
  },
  robTimes: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('barbot-players', Players);