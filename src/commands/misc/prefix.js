const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { SendErrorMsg } = require('@utils/functions');

module.exports = class PrefixCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      memberName: 'prefix',
      group: 'misc',
      description: 'use to show you the bot prefix for this guild, administrators can change it.',
      details: 'prefix <prefix (only if you\'re administrator of guild)',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args) {
    const { guild, channel, member, author } = message;

    if(!args) {
      const prefix = guild.commandPrefix;
      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setDescription(`• To run commands, please use ${message.anyUsage('command')}.\n${prefix ? `• The command prefix is \`${prefix}\`.` : `• There is no command prefix.`}`)
        .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));

      return channel.send(embed);
    }

    if(member.hasPermission('ADMINISTRATOR') && !this.client.isOwner(author))
      return SendErrorMsg(message, 'only the server administrator or the bot owner can change the prefix.');
    
    const lowercase = args.toLowerCase();
    const prefix = lowercase === 'none' ? '' : args;

    guild.commandPrefix = prefix;

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setDescription(`• The command prefix for this guild is updated to: \`${prefix}\``)
      .setFooter(`Updated by ${author.username}`, author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
    
    return channel.send(embed);
  }
}