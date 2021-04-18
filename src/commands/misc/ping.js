const { Command }           = require('discord.js-commando');
const { MessageEmbed }      = require('discord.js');
const { spellgrey }           = require('@utils/colors.json');

module.exports = class PingCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      memberName: 'ping',
      group: 'misc',
      description: 'displays bot ping.',
      details: 'ping',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message) {
    const msg = await message.channel.send('pinging...');
    
    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setAuthor('Pong! 🏓')
      .setThumbnail(this.client.user.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }))
      .setDescription(`• Api Latency: **${Math.round(this.client.ws.ping)}** ms.\n• Message Response Time: **${Math.round(msg.createdTimestamp - message.createdTimestamp)}** ms.`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
    
    await msg.edit({ content: '', embed });
  }
}