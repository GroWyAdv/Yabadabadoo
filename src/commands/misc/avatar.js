const { MessageEmbed }        = require('discord.js');
const { Command }             = require('discord.js-commando');
const { discord }             = require('@utils/colors.json');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      memberName: 'avatar',
      aliases: ['icon'],
      group: 'misc',
      description: 'Displays members avatar',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message) {
    const { mentions, author, channel, guild } = message;
    const member = mentions.users.first() || author;

    const avatar = member.displayAvatarURL({
      dynamic: true,
      size: 1024
    })

    const embed = new MessageEmbed()
      .setColor(discord)
      .setTitle(`${member.username} avatar`)
      .setDescription(`• Use ${guild.commandPrefix}avatar to get your avatar.\n[Click here to open the image](${avatar})`)
      .setImage(avatar)
      .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL({ size: 32, dynamic: true }));

    channel.send(embed);
  }
}