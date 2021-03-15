const { Command }           = require('discord.js-commando');
const { MessageEmbed }      = require('discord.js');
const { discord }           = require('@utils/colors.json');

module.exports = class PingCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'ping',
      memberName: 'ping',
      group: 'misc',
      description: 'Displays bot ping',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  async run(message) {
    const msg = await message.channel.send('pinging...');
    const embed = new MessageEmbed()
      .setColor(discord)
      .setAuthor('Pong! 🏓')
      .setThumbnail(this.client.user.displayAvatarURL({ size: 1024, dynamic: true }))
      .setDescription(`• Api Latency: **${Math.round(this.client.ws.ping)}** ms.\n• Message Response Time: **${Math.round(msg.createdTimestamp - message.createdTimestamp)}** ms.`)
      .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({ size: 32, dynamic: true }));
    
    await msg.edit({
      content: '',
      embed
    });
  }
}