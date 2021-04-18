const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AssCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'hentaiass',
      memberName: 'hentaiass',
      aliases: ['asshentai', 'hentai-ass', 'ass-hentai', 'hentaibutt', 'hentai-butt', 'butt-hentai'],
      group: 'nsfw',
      description: 'NSFW content with ass of hentai category.',
      details: 'hentaiass',

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
    rp.get('https://nekobot.xyz/api/image?type=hass').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Hentai Ass Image", res.message);
    });
  }
}