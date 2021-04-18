const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { euro_bag, banutz } = require('@utils/emojis.json');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention } = require('@utils/functions');
const barbot = require('@features/barbot');

module.exports = class TransferCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'transfer',
      memberName: 'transfer',
      description: 'use to transfer coins to a member who initiated his account.',
      details: 'transfer <mentioned member> <amount of coins>',

      argsType: 'multiple',
      group: 'economy',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message, args) {
    const amount = parseInt(args[1]);
    const member = await GetUserFromMention(this.client, args[0]);

    if(!member || !amount || amount <= 0) {
      return SendUsageMsg(message, this.details);
    }

    const { author, channel, guild } = message;

    if(member.id == author.id) {
      return SendErrorMsg(message, 'you cannot use this command on you.');
    }

    let result = await barbot.findUser(author.id);

    if(result == null) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
    }

    if(result.coins < amount) {
      return SendErrorMsg(message, `you don't have that amount of coins.`);
    }

    result = await barbot.findUser(member.id);

    if(result == null) {
      return SendErrorMsg(message, `${member.username} has not initiated his account.`);
    }

    await barbot.addCoins(author.id, -amount).then(async () => {
      await barbot.addLogs(author.id, channel.id, guild.id, `$${amount.toLocaleString()} transferred to ${member.username}.`);
    });

    await barbot.addCoins(member.id, amount).then(async () => {
      await barbot.addLogs(member.id, channel.id, guild.id, `$${amount.toLocaleString()} transferred from ${author.username}.`);
    });

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`${euro_bag} Transferring`)
      .setDescription(`**${author.username}** transferred **${amount.toLocaleString()}**${banutz} to **${member.username}**.`);
    
    channel.send(embed);
  }
}