const { Schema, model } = require('mongoose');

const presenceModel = new Schema({
  status: {
    type: String,
    required: true,
    default: 'online'
  },
  activityName: {
    type: String,
    required: true,
    default: 'cum trece tramvaiul'
  },
  activityType: {
    type: String,
    required: true,
    default: 'WATCHING'
  },
  activityURL: {
    type: String,
    required: true,
    default: 'none'
  },
  unique: {
    type: Number,
    default: 69
  }
});

module.exports = model('bot-settings', presenceModel);