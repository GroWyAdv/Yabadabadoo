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
      details: 'anal',

      guildOnly: true,
      nsfw: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message) {
    rp.get('https://nekobot.xyz/api/image?type=anal').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Anal Image", res.message);
    });
  }
}