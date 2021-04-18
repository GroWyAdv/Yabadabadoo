const { Command }                       = require('discord.js-commando');
const { discord }                       = require('@utils/colors.json');
const { MessageEmbed }                  = require('discord.js');
const { SendErrorMsg, SendUsageMsg }    = require('@utils/functions');
const samp                              = require('samp-query');

module.exports = class SampCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'samp',
      memberName: 'samp',
      description: 'displays informations about a sa-mp server. Sometimes will not find some servers 😢',
      details: 'samp <server ip>',

      group: 'misc',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args) {
    if(!args) {
      return SendUsageMsg(message, this.details);
    }

    const { author, channel } = message;

    samp({ host: args }, function(error, response) {
      if(response) {
        const {
          address,
          hostname,
          gamemode,
          online,
          maxplayers,
          passworded,
          mapname,
          rules: {
            weburl,
            version,
            worldtime
          }
        } = response;

        const embed = new MessageEmbed()
          .setColor(discord)
          .setTitle('» San Andreas Multiplayer')
          .setDescription(`There are informations about **${address}**\n\u200B`)
          .setFooter(`Requested by ${author.username}`, author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }))
          .setThumbnail('https://www.sa-mp.com/samp_logo.png')
          .addFields(
            { name: '• Hostname',   value: hostname,                          inline: true },
            { name: '• Gamemode',   value: gamemode,                          inline: true },
            { name: '\u200B',       value: '\u200B',                          inline: true },

            { name: '• Players',    value: `${online}/${maxplayers}`,         inline: true },
            { name: '• Password',   value: passworded,                        inline: true },
            { name: '\u200B',       value: '\u200B',                          inline: true },

            { name: '• Language',   value: mapname,                           inline: true },
            { name: '• Version',    value: version,                           inline: true },
            { name: '\u200B',       value: '\u200B',                          inline: true },

            { name: '• WebURL',     value: `[${weburl}](https://${weburl})`,  inline: true },
            { name: '• Time',       value: worldtime,                         inline: true },
            { name: '\u200B',       value: '\u200B',                          inline: true }
          );

        channel.send(embed);
      }
      else {
        SendErrorMsg(message, 'this host is unavailable.');
      }
    });
  }
}