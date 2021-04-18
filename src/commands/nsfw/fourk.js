const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AssCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'fourk',
      memberName: 'fourk',
      aliases: ['4k'],
      group: 'nsfw',
      description: 'NSFW content with 4k resolution.',
      details: 'fourk',

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
    rp.get('https://nekobot.xyz/api/image?type=4k').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "4k Image", res.message);
    });
  }
}