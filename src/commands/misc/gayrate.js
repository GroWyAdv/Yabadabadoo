const { Command }                   = require('discord.js-commando');
const { MessageEmbed }              = require('discord.js');
const { discord }                   = require('@utils/colors.json');
const { GetUserFromMention }        = require('@utils/functions');

module.exports = class GayRateCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'gayrate',
      memberName: 'gayrate',
      group: 'misc',
      description: 'Displays members gay rate',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args) {
    const { member, author, channel } = message;
    const mentioned = GetUserFromMention(this.client, args[0]) || author;
    
    let rate;
    if(args[1]) {
      if(member.hasPermission('ADMINISTRATOR') || this.client.isOwner(author)) {
        rate = this.client.isOwner(mentioned) ? 0 : parseInt(args[1]);
      } else {
        rate = this.client.isOwner(mentioned) ? 0 : Math.floor(Math.random() * 100) + 1;
      }
    } else {
      rate = this.client.isOwner(mentioned) ? 0 : Math.floor(Math.random() * 100) + 1;
    }

    const embed = new MessageEmbed()
      .setColor(discord)
      .setTitle('» Gay Rate')
      .setDescription(`**${mentioned.username}** is ${rate}% gay.`)
      .setThumbnail('https://imgur.com/s6W7vSp.png');

    return channel.send(embed);
  }
}