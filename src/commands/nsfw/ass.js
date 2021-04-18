const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AssCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'ass',
      memberName: 'ass',
      aliases: ['butt'],
      group: 'nsfw',
      description: 'NSFW content with ass category.',
      details: 'ass',

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
    rp.get('https://nekobot.xyz/api/image?type=ass').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Ass Image", res.message);
    });
  }
}