const { Command }                           = require('discord.js-commando');
const { MessageEmbed }                      = require('discord.js');
const { SendUsageMsg, SendErrorMsg }        = require('@utils/functions');
const { discord }                           = require('@utils/colors.json');
const math                                  = require('mathjs');

module.exports = class MathCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'math',
      memberName: 'math',
      aliases: ['calculator', 'calc'],
      group: 'misc',
      description: 'Calculate math operations',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'EMBED_LINKS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, 'math [math operation]');
    
    try {
      const embed = new MessageEmbed()
        .setColor(discord)
        .setTitle('» Calculator')
        .setDescription(`${message.author.username}, there is your result.`)
        .addFields(
          { name: '× Question', value: args, inline: true },
          { name: '× Result', value: math.evaluate(args), inline: true }
        );
      
      return message.channel.send(embed);
    } catch(err) {
      SendErrorMsg(message, 'invalid operation.');
    }
  }
}