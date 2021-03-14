const mongoose = require('mongoose');

const requiredString = {
  type: String,
  required: true,
};

const logSchema = mongoose.Schema({
  targetId: requiredString,
  memberId: requiredString,
  guildId: requiredString,
  reason: requiredString
}, {
  timestamps: true
});

module.exports = mongoose.model('ban-logs', logSchema);