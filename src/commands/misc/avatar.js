const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { GetUserFromMention } = require('@utils/functions');

module.exports = class AvatarCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      memberName: 'avatar',
      aliases: ['icon'],
      group: 'misc',
      description: 'displays you your or a member\'s avatar.',
      details: 'avatar <mentioned member (default is you)>',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args) {
    const { author, channel } = message;
    const member = GetUserFromMention(this.client, args) || author;

    const avatar = member.displayAvatarURL({
      format: 'png',
      dynamic: true,
      size: 1024
    });

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`${member.username} avatar`)
      .setDescription(`• Use ${message.anyUsage('avatar')} to get your avatar.\n\n[Click here to open the image](${avatar})`)
      .setImage(avatar)
      .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));

    channel.send(embed);
  }
}