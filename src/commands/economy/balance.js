const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { banutz, euro_bag } = require('@utils/emojis.json');
const { SendErrorMsg, GetUserFromMention } = require('@utils/functions');
const barbot = require('@features/barbot');

module.exports = class BalanceCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'balance',
      memberName: 'balance',
      aliases: ['bal'],
      description: 'displays you your or a member\'s balance of coins, shields and lotto-tickets.',
      details: 'balance',

      group: 'economy',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message, args) {
    const member = GetUserFromMention(this.client, args) || message.author;
    const balance = await barbot.getBalance(member.id);
    
    if(balance == undefined) {
      return SendErrorMsg(message, member.id == message.author.id ? `you need to use ${message.anyUsage('init')}.` : `this member has not initiated his account.`);
    }

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`${euro_bag} ${member.username}'s balance`)
      .setDescription(`**Current member balance:** ${balance.userCoins.toLocaleString()}${banutz}`)
      .addField(':shield: Shields', balance.userShields.toLocaleString(), true)
      .addField(':tickets: Lotto Tickets', balance.userLottoTickets.toLocaleString(), true);

    message.channel.send(embed);
  }
}