const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { SendUsageMsg, SendErrorMsg } = require('@utils/functions');
const { spellgrey } = require('@utils/colors.json');
const math = require('mathjs');

module.exports = class MathCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'math',
      memberName: 'math',
      aliases: ['calculator', 'calc'],
      group: 'misc',
      description: 'use to calculate math operations or to make conversions.',
      details: 'math <math operation or math conversion>',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, this.details);
    
    try {
      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle('» Calculator')
        .setDescription(`${message.author.username}, there is your result.`)
        .addField('× Question', args, true)
        .addField('× Result', math.evaluate(args), true);
      
      message.channel.send(embed);
    } catch(err) {
      SendErrorMsg(message, 'invalid operation.');
    }
  }
}