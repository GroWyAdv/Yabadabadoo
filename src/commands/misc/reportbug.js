const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const { spellgrey } = require('@utils/colors.json')
const { hammer } = require('@utils/emojis.json')
const { SendErrorMsg, SendUsageMsg } = require('@utils/functions')
const moment = require('moment-timezone')
const Bugs = require('@schemas/bugs')

module.exports = class ReportBugCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'reportbug',
      memberName: 'reportbug',
      aliases: ['bugreport'],
      description: 'use to report a bug of this bot.',
      details: 'reportbug <explain the bug here>',

      guildOnly: true,

      group: 'misc',
      throttling: {
        usages: 1,
        duration: 60,
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    })
  }

  async run(message, args) {
    if(!args) {
      return SendUsageMsg(message, this.details)
    }

    await Bugs({
      reportBy: message.member.id,
      reportOnChannel: message.channel.id,
      reportOnGuild: message.guild.id,
      bugText: args
    }).save();
    
    let embed = new MessageEmbed()
      .setColor(spellgrey)
      .setAuthor(`${message.author.username} reported a bug`, message.author.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }))
      .addField('Reported Bug', args)
      .setFooter(moment().tz('Europe/Bucharest').format('HH:mm - DD.MM.YYYY'), this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }))

    const owners = this.client.owners;

    await owners.forEach(async element => {
      this.client.users.fetch(element.id).then((user) => user.send(embed))
    })

    embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`${hammer} Bug report sent`)
      .setDescription(`**${message.author.username}** thanks, your report was succesfully sent to the bot owner. Be sure in the next update the problem will be solved. 🤗`)

    message.channel.send(embed)
  }
}