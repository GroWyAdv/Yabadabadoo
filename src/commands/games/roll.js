const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageCollector } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { banutz } = require('@utils/emojis.json');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention} = require('@utils/functions');
const barbot = require('@features/barbot');

const noEmojis = {
  1: ':one:',
  2: ':two:',
  3: ':three:',
  4: ':four:',
  5: ':five:',
  6: ':six:'
}

const collectorSettings = {
  max: 1,
  time: 1000 * 30
};

const duelsCache = new Map();

module.exports = class RollCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      memberName: 'roll',
      aliases: ['dice', 'duel'],
      description: 'invite a member who initiated his account and dice with him for any amount of coins.',
      details: 'roll <mentioned member> <amount of coins>',
      argsType: 'multiple',

      group: 'games',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
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

    if(result.coins < amount) {
      return SendErrorMsg(message, `${member.username} doesn't have that amount of coins.`);
    }
    
    if(duelsCache.has(author.id)) {
      if(duelsCache.get(author.id).includes(member.id)) {
        return SendErrorMsg(message, `you already invited **${member.username}**, wait for a response.`);
      }
    }

    if(duelsCache.has(member.id)) {
      if(duelsCache.get(member.id).includes(author.id)) {
        return SendErrorMsg(message, `you have already been invited by **${member.username}**, type \`yes\` in chat to accept.`);
      }
    }

    const collectorFilter = (msg) => {
      return (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') && msg.author.id == member.id;
    }

    channel.send(`🎲 <@${member.id}>, you are invited by **${author.username}** to dice with him for **${amount.toLocaleString()}**${banutz}\nType in chat \`yes\` to accept or \`no\` to decline.`);
    const collector = new MessageCollector(channel, collectorFilter, collectorSettings);

    if(duelsCache.has(author.id)) {
      duelsCache.set(author.id, [member.id, ...duelsCache.get(author.id)]);
    }
    else {
      duelsCache.set(author.id, [member.id]);
    }

    collector.on('end', async (collected) => {
      let list = duelsCache.get(author.id);
      const newList = list.filter((i) => i != member.id);

      if(!newList.length) {
        duelsCache.delete(author.id);
      }
      else {
        duelsCache.set(author.id, newList);
      }

      const collectedMessage = collected.first();
      
      if(!collectedMessage) {
        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle('🎲 Dice')
          .setDescription(`Invitation by **${author.username}** for **${member.username}** has expired.`)

        return channel.send(embed);
      }

      if(collectedMessage.content.toLowerCase() == 'yes') {
        const authorNo = Math.floor(Math.random() * 6) + 1;
        const memberNo = Math.floor(Math.random() * 6) + 1;

        let description = `**${author.username}** invited **${member.username}** to dice for ${amount.toLocaleString()}${banutz}\n\n• ${author.username} rolled the dice and dropped ${noEmojis[authorNo]}\n• ${member.username} rolled the dice and dropped ${noEmojis[memberNo]}\n\n`;
      
        if(authorNo > memberNo) {
          description += `**${author.username}** won!`;

          await barbot.addCoins(author.id, amount).then(async (balance) => {
            await barbot.addLogs(author.id, channel.id, guild.id, `won $${amount.toLocaleString()} from ${member.username} at roll.`);
          });

          await barbot.addCoins(member.id, -amount).then(async (balance) => {
            await barbot.addLogs(member.id, channel.id, guild.id, `lost $${amount.toLocaleString()} in favor of ${author.username} at roll.`);
          });
        }
        else if(memberNo > authorNo) {
          description += `**${member.username}** won!`;

          await barbot.addCoins(member.id, amount).then(async (balance) => {
            await barbot.addLogs(member.id, channel.id, guild.id, `won $${amount.toLocaleString()} from ${member.username} at roll.`);
          });

          await barbot.addCoins(author.id, -amount).then(async (balance) => {
            await barbot.addLogs(author.id, channel.id, guild.id, `lost $${amount.toLocaleString()} in favor of ${author.username} at roll.`);
          });
        }
        else {
          description += 'Tie!';
        }

        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle('🎲 Dice')
          .setDescription(description);
        
        channel.send(embed);
      }
      else {
        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle('🎲 Dice')
          .setDescription(`Invitation by **${author.username}** for **${member.username}** was declined.`);
        
        channel.send(embed);
      }
    });
  }
}