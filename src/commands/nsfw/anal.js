const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AnalCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'anal',
      memberName: 'anal',
      group: 'nsfw',
      description: 'NSFW content with anal category.',

      guildOnly: true,
      nsfw: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message) {
    rp.get('https://nekobot.xyz/api/image?type=anal').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Anal Image", res.message);
    });
  }
}