const { Command }                   = require('discord.js-commando');
const { MessageEmbed }              = require('discord.js');
const { discord }                   = require('@utils/colors.json');
const { GetUserFromMention }        = require('@utils/functions');

module.exports = class IqCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'iq',
      memberName: 'iq',
      group: 'misc',
      description: 'Displays members iq',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message, args) {
    const { member, author, channel } = message;
    const mentioned = GetUserFromMention(this.client, args[0]) || author;
    
    let iq;
    if(args[1]) {
      if(member.hasPermission('ADMINISTRATOR') || this.client.isOwner(author)) {
        iq = this.client.isOwner(mentioned) ? 200 : parseInt(args[1]);
      } else {
        iq = this.client.isOwner(mentioned) ? 200 : Math.floor(Math.random() * 200) + 1;
      }
    } else {
      iq = this.client.isOwner(mentioned) ? 200 : Math.floor(Math.random() * 200) + 1;
    }

    let result = '';
    if(iq >= 200) result = 'god';
    else if(iq >= 180 && iq < 200) result = 'maybe Einstein';
    else if(iq >= 120 && iq < 180) result = 'brilliant';
    else if(iq >= 70 && iq < 120) result = 'formidable';
    else if(iq == 69) result = 'fuck everything he catch';
    else if(iq >= 20 && iq < 69) result = 'probably cunt';

    const embed = new MessageEmbed()
      .setColor(discord)
      .setTitle('» IQ Calculator')
      .setDescription(`**${mentioned.username}**'s iq is: **${iq}**.\n• Result: ${result}.`)
      .setThumbnail(mentioned.displayAvatarURL({ size: 1024, dynamic: true }))
      .setFooter(`Requested by ${mentioned.tag}`, mentioned.displayAvatarURL({ size: 32, dynamic: true }));
    
    return channel.send(embed);
  }
}