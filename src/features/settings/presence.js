const Presence = require('@schemas/presence')

module.exports = async (client) => {
  let result = await Presence.findOne({ unique: 69 })

  if(result == null) {
    result = await Presence({
      status: 'online',
      activityName: 'no activity name',
      activityType: 'WATCHING',
      activityURL: 'none',
      unique: 69
    }).save()
  }

  await client.user.setPresence({
    activity: {
      name: result.activityName,
      type: result.activityType
    },
    status: result.status
  }).catch(err => console.error(err.message))
}