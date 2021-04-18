const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { invGuildLink, invClientLink } = require('@root/config.json');
const { version } = require('@root/package.json');
const humanizeDuration = require('humanize-duration');

const humanizeSettings = {
	largest: 2,
	round: true,
	conjunction: ' and ',
	serialComma: false
};

module.exports = class BotInfoCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      memberName: 'botinfo',
      aliases: ['botinformations', 'infobot', 'bot-info', 'info-bot'],
      description: 'displays informations about me 😍',
      details: 'botinfo',
      group: 'misc',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message) {
    const { channel, author } = message;

    const owner = this.client.owners[0];
    const ownerName = `${owner.username}#${owner.discriminator}`;

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`» Informations about me`)
      .setThumbnail(this.client.user.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }))
      .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }))
      .setDescription(`Loool, someone's asking for me 🥰\n\u200B`)
      .addFields(
        { name: '× Developer', value: ownerName, inline: true },
        { name: '× Bot Version', value: version, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Total Guilds', value: this.client.guilds.cache.size, inline: true },
        { name: '× Total Users', value: this.client.users.cache.size, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× Bot Uptime', value: humanizeDuration(this.client.uptime, humanizeSettings), inline: true },
        { name: '× Memory Usage', value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`, inline: true },
        { name: '\u200B', value: '\u200B', inline: true },

        { name: '× My Favorite Guild', value: `[Press here](${invGuildLink})` },
        { name: '× Invite Me', value: `[Press here](${invClientLink})` });
        
    channel.send(embed);
  }
}