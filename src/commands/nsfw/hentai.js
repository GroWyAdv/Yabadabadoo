const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class AssCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'hentai',
      memberName: 'hentai',
      group: 'nsfw',
      description: 'NSFW content with hentai category.',

      guildOnly: true,
      nsfw: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message) {
    rp.get('https://nekobot.xyz/api/image?type=hentai').then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Hentai Image", res.message);
    });
  }
}