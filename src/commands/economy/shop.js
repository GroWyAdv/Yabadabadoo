const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { euro_bag, banutz } = require('@utils/emojis.json');
const { products, discount, discountReason } = require('@features/barbot');

const CalcDiscount = (money) => {
  return (money * (100 - discount)) / 100;
}

module.exports = class ShopCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'shop',
      memberName: 'shop',
      description: 'see what items is available in the shop, sometimes can be a discount applied so this will appear on shop.',
      details: 'shop',

      group: 'economy',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message) {
    let text = '';
      
    if(discount) {
      text += `\nDiscount applied: ${discount}% (${discountReason})`;
    }
    
    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`${euro_bag} Shop`)
      .setDescription(`Here are listed the items you can buy.${text}\n\u200B`)
      .setFooter('Use buy command to buy something', this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));

    for(const product in products) {
      embed.addField(products[product].name, `${CalcDiscount(products[product].price).toLocaleString()}${banutz}`, true);
    }
    
    message.channel.send(embed);
  }
}