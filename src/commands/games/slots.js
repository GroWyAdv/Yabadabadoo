const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { spinningslots, banutz } = require('@utils/emojis.json');
const { stripIndents } = require('common-tags');
const { SendUsageMsg, SendErrorMsg } = require('@utils/functions');
const barbot = require('@features/barbot');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const emojis = [
  'first_place',
  'grey_question',
  'gem',
  '100',
  'dollar',
  'moneybag'
];

const decideWinnings = async (first, second, third) => {
  if(first == 0 && second == 0 && third == 1) {
    return 0.5;
  }

  if((first == 2 && second == 2 && third == 1) || (first == 3 && second == 3 && third == 1)) {
    return 2.0;
  }

  if(first == 0 && second == 0 && third == 0) {
    return 2.5;
  }

  if(first == 2 && second == 2 && third == 2) {
    return 3.0;
  }

  if(first == 4 && second == 4 && third == 1) {
    return 3.5;
  }

  if(first == 3 && second == 3 && third == 3) {
    return 4.0;
  }

  if(first == 5 && second == 5 && third == 1) {
    return 7.0;
  }

  if(first == 4 && second == 4 && third == 4) {
    return 7.0;
  }

  if(first == 5 && second == 5 && third == 5) {
    return 15.0;
  }

  return 0.0;
}

module.exports = class TestCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'slot',
      memberName: 'slot',
      aliases: ['slots', 'pacanele'],
      details: 'slot <amount of coins or \'-h\'>',
      description: 'try your luck at slot machine, aka romanian pacanele.',
      
      group: 'games',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 10
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message, args) {
    const balance = await barbot.getBalance(message.author.id);

    if(balance == undefined) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
    }

    if(!args) {
      return SendUsageMsg(message, this.details);
    }

    if(args == '-h' || args == '-help' || args == 'help') {
      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle('🎲 Slot Help')
        .setDescription(stripIndents`
          There are the winnings for slot machine.

          **Winnings**
          :first_place: :first_place: :grey_question: - **0.5x**
          :gem: :gem: :grey_question: - **2x**
          :100: :100: :grey_question: - **2x**
          :first_place: :first_place: :first_place: - **2.5x**
          :gem: :gem: :gem: - **3x**
          :dollar: :dollar: :grey_question: - **3.5x**
          :100: :100: :100: - **4x**
          :moneybag: :moneybag: :grey_question: - **7x**
          :dollar: :dollar: :dollar: - **7x**
          :moneybag: :moneybag: :moneybag: - **15x**`);

      return message.channel.send(embed);
    }

    if(isNaN(args)) {
      return SendUsageMsg(message, this.details);
    }

    const amount = parseInt(args);

    if(amount <= 0) {
      return SendErrorMsg(message, 'please use a positive value.');
    }

    if(balance.userCoins < amount) {
      return SendErrorMsg(message, 'you don\'t have that amount of coins.');
    }

    await barbot.addCoins(message.author.id, -amount);
    await barbot.addLogs(message.author.id, message.channel.id, message.channel.id, `paid $${amount.toLocaleString()} to slot machine.`);

    let embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`🎲 Slot Machine`)
      .setDescription(stripIndents`
        **${message.author.username}** started playing with Slot Machine.
        Coins inserted: ${amount.toLocaleString()}${banutz}

        **Spinning...**
        ${spinningslots} | ${spinningslots} | ${spinningslots}
        
        Use \`-h\` to get help about slot winnings.`);

    const msg = await message.channel.send(embed);

    await sleep(2000);

    const first = await Math.floor(Math.random() * emojis.length);

    embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`🎲 Slot Machine`)
      .setDescription(stripIndents`
        **${message.author.username}** started playing with Slot Machine.
        Coins inserted: ${amount.toLocaleString()}${banutz}

        **Spinning...**
        :${emojis[first]}: | ${spinningslots} | ${spinningslots}
        
        Use \`-h\` to get help about slot winnings.`);
    
    await msg.edit(embed);

    await sleep(1500);
    
    const second = await Math.floor(Math.random() * emojis.length);

    embed = new MessageEmbed()
    .setColor(spellgrey)
    .setTitle(`🎲 Slot Machine`)
    .setDescription(stripIndents`
      **${message.author.username}** started playing with Slot Machine.
      Coins inserted: ${amount.toLocaleString()}${banutz}

      **Spinning...**
      :${emojis[first]}: | :${emojis[second]}: | ${spinningslots}
      
      Use \`-h\` to get help about slot winnings.`);

    await msg.edit(embed);

    await sleep(1500);
    
    const third = await Math.floor(Math.random() * emojis.length);
    const decide = await decideWinnings(first, second, third);
    const result = await Math.floor(decide * amount);

    embed = new MessageEmbed()
    .setColor(spellgrey)
    .setTitle(`🎲 Slot Machine`)
    .setDescription(stripIndents`
      **${message.author.username}** started playing with Slot Machine.
      Coins inserted: ${amount.toLocaleString()}${banutz}

      **Result:**
      :${emojis[first]}: | :${emojis[second]}: | :${emojis[third]}:${decide ? ` **(x${decide})**` : ''}

      **Status**:
      » he got ${result.toLocaleString()}${banutz} back from the machine.`);

    await barbot.addCoins(message.author.id, result);
    await barbot.addLogs(message.author.id, message.channel.id, message.guild.id, `won $${result.toLocaleString()} from slot machine.`);
    await msg.edit(embed);
  }
}