const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AssCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'gif',
      memberName: 'gif',
      aliases: ['porn-gif', 'p-gif', 'porngif', 'pgif'],
      group: 'nsfw',
      description: 'NSFW content with gif image.',
      details: 'gif',

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
    rp.get('https://nekobot.xyz/api/image?type=pgif').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Gif Image", res.message);
    });
  }
}