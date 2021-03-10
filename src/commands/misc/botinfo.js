const { MessageEmbed }                                          = require('discord.js');
const { Command }                                               = require('discord.js-commando');
const { discord }                                               = require('@utils/colors.json');
const { GetClientUpTime }                                       = require('@utils/functions');
const { ownerTag, ownerName, invGuildLink, invClientLink }      = require('@root/config.json');
const { version }                                               = require('@root/package.json');

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      memberName: 'botinfo',
      aliases: ['botinformations', 'infobot', 'bot-info', 'info-bot'],
      group: 'misc',
      description: 'Displays informations about the bot',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message) {
    const { channel, author } = message;

    const embed = new MessageEmbed()
      .setColor(discord)
      .setTitle(`» Informations about me`)
      .setThumbnail(this.client.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL({ size: 32, dynamic: true }))
      .setDescription(`Loool, someone's asking for me 🥰\n\u200B`)
      .addFields(
        { name: '× Developer', value: `${ownerName}#${ownerTag}`, inline: true },
        { name: '× Bot Version', value: version, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Total Guilds', value: this.client.guilds.cache.size, inline: true },
        { name: '× Total Users', value: this.client.users.cache.size, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Bot Uptime', value: GetClientUpTime(this.client), inline: true },
        { name: '× Memory Usage', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× My Favorite Guild', value: `[Press here](${invGuildLink})` },
        { name: '× Invite Me', value: `[Press here](${invClientLink})` });
        
    channel.send(embed);
  }
}