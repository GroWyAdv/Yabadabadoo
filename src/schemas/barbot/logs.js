const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true
};

const Logs = new mongoose.Schema({
  memberId: requiredString,
  channelId: requiredString,
  guildId: requiredString,
  text: requiredString
}, {
  timestamps: true
});

module.exports = mongoose.model('barbot-logs', Logs);