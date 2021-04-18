const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const { spellgrey } = require('@utils/colors.json')
const { banutz, euro_bag } = require('@utils/emojis.json')
const { SendErrorMsg } = require('@utils/functions')
const humanizeDuration = require('humanize-duration')
const Players = require('@schemas/barbot/players')
const barbot = require('@features/barbot')

const humanizeSettings = {
  largest: 2,
  round: true,
  conjunction: ' and ',
  serialComma: false
}

module.exports = class WeeklyCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'weekly',
      memberName: 'weekly',
      aliases: ['weekly-reward'],
      description: 'use to get a weekly reward, the reward is amount of 7 uses of daily command.',
      details: 'weekly',

      group: 'economy',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    })
  }

  async run(message) {
    const { author, channel, guild } = message

    let result = await Players.findOne({ _id: author.id })

    if(result == null) {
      return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`)
    }

    const then = new Date(result.weeklyLast).getTime()
    const now = new Date().getTime()

    const diffTime = (86400000 * 7) - Math.abs(then - now)

    if(diffTime > 0) {
      return SendErrorMsg(message, `you can claim your daily reward in ${humanizeDuration(diffTime, humanizeSettings)}.`)
    }

    const reward = (2000 + Math.floor(Math.random() * 500)) * 7

    barbot.addCoins(author.id, reward).then(async () => {
      await barbot.addLogs(author.id, channel.id, guild.id, `won ${reward.toLocaleString()} at weekly reward.`)

      result = await Players.findOneAndUpdate({
        _id: author.id,
      }, {
        $inc: {
          weeklyTimes: 1
        },
        weeklyLast: now
      })

      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle(`${euro_bag} Weekly Reward`)
        .setDescription(`**${author.username}** got ${reward.toLocaleString()}${banutz} from weekly reward.`)

      channel.send(embed);
    })
  }
}