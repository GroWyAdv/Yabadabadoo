const settingsSchema      = require('@schemas/settings');

module.exports = async (client) => {
  client.guilds.cache.forEach(async (guild) => {
    const result = await settingsSchema.findOne({
      _id: guild.id
    });

    if(result == null) {
      await new settingsSchema({
        _id: guild.id,
        welcomeMessages: 'none',
        leaveMessages: 'none',
        modMessages: 'none'
      }).save();
      
      console.log(`Initiating settings for: ${guild.name}.`);
    }
  });
}