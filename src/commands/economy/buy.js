const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { euro_bag, banutz } = require('@utils/emojis.json');
const { SendErrorMsg, SendUsageMsg, } = require('@utils/functions');
const Players = require('@schemas/barbot/players');
const barbot = require('@features/barbot');
const humanizeDuration = require('humanize-duration');

const products = barbot.products;
const discount = barbot.discount;
const discountReason = barbot.discountReason;

const humanizeSettings = {
	largest: 2,
	round: true,
	conjunction: ' and ',
	serialComma: false
};

const CalcDiscount = (money) => {
  return (money * (100 - discount)) / 100;
}

module.exports = class BuyCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'buy',
      memberName: 'buy',
      description: 'use your coins to buy new items from shop, items which can help you to earn more coins.',
      details: 'buy <item from shop> <amount of that item (default is 1)>',

      argsType: 'multiple',
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
    const { author, channel, guild } = message;
    const result = await barbot.findUser(author.id);

    if(result == null) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
    }

    let [ item, amount ] = args;
    amount = isNaN(amount) ? 1 : parseInt(amount);
    
    if(amount <= 0) {
      return SendErrorMsg(message, 'try again but give me a normal amount value.');
    }

    if(!item) {
      let text = '';
      
      if(discount) {
        text += `\nDiscount applied: ${discount}% (${discountReason})`;
      }

      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle(`${euro_bag} Shop`)
        .setDescription(`Here are listed the items you can buy.${text}\n\u200B`);

      for(const product in products) {
        embed.addField(products[product].name, `${CalcDiscount(products[product].price).toLocaleString()}${banutz}`, true);
      }

      return channel.send(embed);
    }

    switch(item.toLowerCase()) {
      case 'shield': case 'shields': {
        const then = new Date(result.shieldsDelay).getTime();
        const now = new Date().getTime();

        const diffTime = 1800000 - Math.abs(then - now);

        if(diffTime > 0) {
          return SendErrorMsg(message, `you can buy a shield again in ${humanizeDuration(diffTime, humanizeSettings)}.`);
        }

        amount = 1;
        
        const price = products.shield.price * amount;

        if(result.coins < price) {
          return SendErrorMsg(message, `you don't have ${price.toLocaleString()}${banutz}`);
        }

        barbot.addCoins(author.id, -price).then(async (coins) => {
          barbot.addShields(author.id, amount).then(async (shields) => {
            await barbot.addLogs(author.id, channel.id, guild.id, `paid $${price.toLocaleString()} for ${amount}x shield(s).`);

            await Players.updateOne({
              _id: author.id
            }, {
              shieldsDelay: now
            });

            const embed = new MessageEmbed()
              .setColor(spellgrey)
              .setTitle(`${euro_bag} Shop`)
              .setDescription(`${amount}x :shield: \`${amount != 1 ? 'Shields' : 'Shield'}\` delivered to **${author.username}** for ${price.toLocaleString()}${banutz}`)

            channel.send(embed);
          });
        });
        break;
      }
      case 'lotto-ticket': case 'lotto-tickets': case 'lotto': {
        const price = products.ticket.price * amount;

        if(result.coins < price) {
          return SendErrorMsg(message, `you don't have ${price.toLocaleString()}${banutz}`);
        }
  
        barbot.addCoins(author.id, -price).then(async (balance) => {
          barbot.addLottoTickets(author.id, amount).then(async (tickets) => {
            await barbot.addLogs(author.id, channel.id, guild.id, `paid $${price.toLocaleString()} for ${amount}x lotto ticket(s).`);

            const embed = new MessageEmbed()
              .setColor(spellgrey)
              .setTitle(`${euro_bag} Shop`)
              .setDescription(`${amount}x :tickets: \`${amount != 1 ? 'Lotto Tickets' : 'Lotto Ticket'}\` delivered to **${author.username}** for ${price.toLocaleString()}${banutz}`);

            channel.send(embed);
          });
        });
        break;
      }
      default: {
        SendUsageMsg(message, this.details);
        break;
      }
    }
  }
}