const { Command }           = require('discord.js-commando');
const { MessageEmbed }      = require('discord.js');
const { discord }           = require('@utils/colors.json');

module.exports = class HelpCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      memberName: 'help',
      group: 'misc',
      description: 'Displays informations about commands or categories',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args) {
    const { channel, guild } = message;
    
    if(args) {
      const commands = this.client.registry.findCommands(args, false, message);

      if(commands.length) {
        const cmd = commands[0];

        let description = '';
        description += `**Description:**\n${cmd.description}\n\n`;
        description += `**Usage:**\n\`${guild.commandPrefix}${cmd.name}\`\n\n`;

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
          .setColor(discord)
          .setDescription(description)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true }));

        return message.channel.send(embed);
      }

      const groups = this.client.registry.findGroups(args, false);

      if(groups.length) {
        const group = groups[0];

        let text = `**• Available commands:**`;
        group.commands.each(cmd => text += `\n\`${cmd.nsfw ? '🔞' : ''}${cmd.name}\`: ${cmd.description}`);

        const embed = new MessageEmbed()
          .setColor(discord)
          .setTitle(group.name)
          .setDescription(`${text}\n\nUse ${message.anyUsage('help')} and any command to see more informations.`)
          .setFooter(`Total: ${group.commands.size} commands.`, this.client.user.displayAvatarURL({ size: 32, dynamic: true }));
        
        return message.channel.send(embed);
      }
    }
    
    const embed = new MessageEmbed()
      .setColor(discord)
      .setTitle(`${this.client.user.username} commands`)
      .setDescription(`• Choose from below the category\n\u200B`)
      .addFields(
        { name: ':tools: Misc',             value: `\`${guild.commandPrefix}help misc\`` },
        { name: ':unlock: Moderation',      value: `\`${guild.commandPrefix}help moderation\`` },
        { name: ':underage: NSFW',          value: `\`${guild.commandPrefix}help nsfw\`` }
      )
      .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true }));
    
    channel.send(embed);
  }
} 