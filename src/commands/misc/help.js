const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { euro_bag } = require('@utils/emojis.json');

module.exports = class HelpCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      memberName: 'help',
      group: 'misc',
      description: 'for sure you need help with commands, so this displays informations about commands or categories.',
      details: 'help <command name or category name>',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message, args) {
    const { channel, guild } = message;
    
    if(args) {
      const groups = this.client.registry.findGroups(args, false);

      if(groups.length) {
        const group = groups[0];

        let text = `**• Available commands:**`;
        group.commands.each(cmd => text += `\n\`${cmd.nsfw ? '🔞' : ''}${cmd.name}\`: ${cmd.description}`);

        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle(group.name)
          .setDescription(`${text}\n\nUse ${message.anyUsage('help')} and any command to see more informations.`)
          .setFooter(`Total: ${group.commands.size} commands.`, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
        
        return message.channel.send(embed);
      }

      const commands = this.client.registry.findCommands(args, false, message);

      if(commands.length) {
        const cmd = commands[0];

        let description = '';
        description += `**Description:**\n${cmd.description}\n\n`;
        description += `**Usage:**\n\`${guild.commandPrefix}${cmd.details}\`\n\n`;

        if(cmd.aliases.length) {
          description += `**Aliases:**\n${cmd.aliases.join(', ')}\n\n`;
        }

        if(cmd.nsfw) {
          description += `**NSFW:**\n\`yes\`\n\n`;
        }

        if(cmd.userPermissions != null) {
          description += `**Permissions:**\n\`${cmd.userPermissions.join('`, `')}\`\n\n`;
        }

        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setDescription(description)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));

        return message.channel.send(embed);
      }
    }
    
    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`${this.client.user.username} commands`)
      .setDescription(`• Choose from below the category\n\u200B`)
      .addFields(
        { name: ':tools: Misc',             value: `\`${guild.commandPrefix}help misc\`` },
        { name: ':unlock: Moderation',      value: `\`${guild.commandPrefix}help moderation\`` },
        { name: ':underage: NSFW',          value: `\`${guild.commandPrefix}help nsfw\`` },
        { name: `${euro_bag} Economy`,      value: `\`${guild.commandPrefix}help economy\`` },
        { name: ':game_die: Games',         value: `\`${guild.commandPrefix}help games\`` }
      )
      .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
    
    channel.send(embed);
  }
} 