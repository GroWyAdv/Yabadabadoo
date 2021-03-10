const { MessageEmbed }      = require('discord.js');
const { discord }           = require('@utils/colors.json');

module.exports = {
  SendErrorMsg: function(message, error) {
    return message.channel.send(`**${message.author.username}**, ${error}`);
  },

  SendUsageMsg: function(message, usage) {
    return message.channel.send(`**${message.author.username}** try this: \`${message.guild.commandPrefix}${usage}\``);
  },

  GetClientUpTime: function(client) {
    let seconds = Math.floor(client.uptime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);

    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let upTime = '';

    if(days) {
      upTime += `${days} ${days == 1 ? 'day' : 'days'}`;
    }

    if(hours) {
      upTime += ` ${hours} ${hours == 1 ? 'hour' : 'hours'}`;
    }

    if(minutes) {
      upTime += ` ${minutes} ${minutes == 1 ? 'minute' : 'minutes'}`;
    }

    if(seconds) {
      upTime += ` ${seconds} ${seconds == 1 ? 'second' : 'seconds'}`;
    }

    return upTime;
  },

  GetUserFromMention: function(client, mention) {
    if(!mention) return;

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
      .setColor(discord)
      .setTitle(`[NSFW] ${title} :smirk:`)
      .setDescription(`:underage: Are you sure you're over 18?`)
      .setImage(image)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ size: 32, dynamic: true }));
    
    return message.channel.send(embed).catch(err => console.error(err));
  }
}