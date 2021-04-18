const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AssCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'solo',
      memberName: 'solo',
      group: 'nsfw',
      description: 'NSFW content with solo anime category.',
      details: 'solo',

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
    rp.get('https://nekos.life/api/v2/img/solo').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Solo Anime Image", res.url);
    });
  }
}