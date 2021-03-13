const mongoose = require('mongoose');

const reqString = {
  type: String,
  required: true
}

const logSchema = mongoose.Schema({
  targetId: { type: String, required: true },
  memberId: { type: String, required: true },
  guildId: { type: String, required: true },
  reason: { type: String, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('kick-logs', logSchema);