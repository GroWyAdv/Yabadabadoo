const { Command }                           = require('discord.js-commando');
const { MessageEmbed }                      = require('discord.js');
const { CapitalizeText, GetGuildRegion }    = require('@utils/functions');
const { discord }                           = require('@utils/colors.json');
const moment                                = require('moment-timezone');

module.exports = class ServerInfoCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'serverinfo',
      memberName: 'serverinfo',
      aliases: ['svinfo', 'infoserver', 'infosv', 'guildinfo', 'infoguild'],
      group: 'misc',
      description: 'Get informations about this guild',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message) {
    const { channel, guild } = message;
    const { id, name, region, verificationLevel, createdAt, memberCount, owner, afkTimeout, afkChannelID } = guild;

    const guildTotalMembers = `${memberCount} (${guild.members.cache.filter(member => member.user.presence.status != 'offline').size} online)`;
    const guildCreatedAt = moment(createdAt).tz('Europe/Bucharest').format('HH:mm - DD.MM.YYYY');

    const afkChannel = afkChannelID == null ? 'no voice channel detected' : guild.channels.cache.get(afkChannelID).name;
    const afkTime = `${afkTimeout}${afkChannelID == null ? " doesn't matter" : ""}`;

    const embed = new MessageEmbed()
      .setColor(discord)
      .setThumbnail(message.guild.iconURL({ size: 1024, dynamic: true }))
      .setTitle(`» Guild Informations`)
      .setDescription(`There's some informations about this guild.\n\u200B`)
      .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true }))
      .addFields(
        { name: '× Guild ID', value: id, inline: true },
        { name: '× Guild Name', value: name, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Guild Owner', value: owner.user.tag, inline: true },
        { name: '× Guild Region', value: GetGuildRegion(region), inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Verification Level', value: CapitalizeText(verificationLevel.toLowerCase()), inline: true },
        { name: '× Created At', value: guildCreatedAt, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Total Channels', value: guild.channels.cache.size, inline: true },
        { name: '× Total Members', value: guildTotalMembers, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× AFK Channel', value: afkChannel, inline: true },
        { name: '× AFK Timeout', value: afkTime, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },
      );

    channel.send(embed);
  }
}