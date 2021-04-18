const { Command }         = require('discord.js-commando');
const { ShowNSFWEmbed }   = require('@utils/functions');
const rp                  = require('request-promise-native');

module.exports = class BoobsCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'boobs',
      memberName: 'boobs',
      aliases: ['tities', 'tits'],
      group: 'nsfw',
      description: 'NSFW content with boobs category.',
      details: 'boobs',

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
    rp.get('http://api.oboobs.ru/boobs/' + [Math.floor(Math.random() * 10930)]).then(JSON.parse).then(function(res) {
      ShowNSFWEmbed(message, "Boobs Image", 'http://media.oboobs.ru/' + res[0].preview);
    });
  }
}