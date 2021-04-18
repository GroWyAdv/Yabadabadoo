const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { GetUserFromMention } = require('@utils/functions');

module.exports = class IqCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'iq',
      memberName: 'iq',
      group: 'misc',
      description: 'displays you your or a member\'s iq, this is also 100% real trust me.',
      details: 'iq <mentioned member (default is you)>',
      argsType: 'multiple',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
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
      .setColor(spellgrey)
      .setTitle('» IQ Calculator')
      .setDescription(`**${mentioned.username}**'s iq is: **${iq}**.\n• Result: ${result}.`)
      .setThumbnail(mentioned.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }))
      .setFooter(`Requested by ${author.tag}`, author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
    
    return channel.send(embed);
  }
}