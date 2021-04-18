const { Schema, model } = require('mongoose')

const bugsModel = new Schema({
  reportBy: {
    type: String,
    required: true
  },
  reportOnChannel: {
    type: String,
    required: true
  },
  reportOnGuild: {
    type: String,
    required: true
  },
  bugText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

module.exports = model('reported-bugs', bugsModel)