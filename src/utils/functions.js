const { MessageEmbed }      = require('discord.js');
const { spellgrey }           = require('@utils/colors.json');

const regions = {
  "brazil": ":flag_br: Brazil",
  "europe": ":flag_eu: Europe",
  "hongkong": ":flag_hk: Hong Kong",
  "india": ":flag_in: India",
  "japan": ":flag_jp: Japan",
  "russia": ":flag_ru: Russia",
  "singapore": ":flag_sg: Singapore",
  "southafrica": ":flag_za: South Africa",
  "sydney": ":flag_au: Sydney",
  "us-central": ":flag_us: U.S. Central",
  "us-east": ":flag_us: U.S. East",
  "us-south": ":flag_us: U.S. South",
  "us-west": ":flag_us: U.S. West"
};

module.exports = {
  SendErrorMsg: function(message, error) {
    return message.channel.send(`**${message.author.username}**, ${error}`);
  },

  SendUsageMsg: function(message, usage) {
    return message.channel.send(`**${message.author.username}** try this: \`${message.guild.commandPrefix}${usage}\``);
  },

  GetUserFromMention: function(client, mention) {
    if(!mention)
      return;

    if(mention.startsWith('<@') && mention.endsWith('>')) {
      mention = mention.slice(2, -1);

      if(mention.startsWith('!')) {
        mention = mention.slice(1);
      }

      return client.users.cache.get(mention);
    }
  },

  ShowNSFWEmbed: function(message, title, image) {
    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`[NSFW] ${title} :smirk:`)
      .setDescription(`:underage: Are you sure you're over 18?`)
      .setImage(image)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
    
    return message.channel.send(embed).catch(err => console.error(err));
  },

  CapitalizeText: function(text) {
    if(typeof text != 'string')
      return '';

    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  
  GetGuildRegion: function(region) {
    return `${regions[region]}`;
  }
}