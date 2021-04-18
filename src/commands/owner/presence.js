const { Command } = require('discord.js-commando')
const { spellgrey } = require('@utils/colors.json')
const { MessageEmbed } = require('discord.js')
const Presence = require('@schemas/presence.js')
const { stripIndents } = require('common-tags')
const { SendErrorMsg } = require('@utils/functions')
const { hammer, thinking } = require('@utils/emojis.json')

const validStatus = ['online', 'idle', 'invisible', 'dnd']
const validActivity = ['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING']

module.exports = class PresenceCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'presence',
      memberName: 'presence',
      description: 'use this command to change the presence of the bot.',
      details: 'presence <option> <value>',

      argsType: 'multiple',
      group: 'owner',

      guildOnly: true,
      ownerOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS'],
    })
  }

  async run(message, args) {
    const [ option, value ] = args

    switch(option) {
      case 'activity-name': {
        const name = args.slice(1).join(' ')

        if(!name) {
          return SendErrorMsg(message, 'pleace specify the activity name to set.')
        }

        const result = await Presence.findOneAndUpdate({
          unique: 69
        }, {
          activityName: name
        }, {
          new: true
        })

        await this.client.user.setPresence({
          activity: {
            name: result.activityName,
            type: result.activityType
          },
          status: result.status
        }).then(() => {
          const embed = new MessageEmbed()
            .setColor(spellgrey)
            .setTitle(`${hammer} Presence`)
            .setDescription(`Presence activity name updated to **${name}**.`)

          message.channel.send(embed)
        }).catch(err => {
          SendErrorMsg(message, err.message)
          console.log(err)
        })
        
        break
      }
      case 'activity-type': {
        if(!value) {
          return SendErrorMsg(message, 'please specify the activity type to set.')
        }

        const activitytype = value.toUpperCase();

        if(!validActivity.includes(activitytype)) {
          return SendErrorMsg(message, 'please use a valid activity type.')
        }

        const result = await Presence.findOneAndUpdate({
          unique: 69
        }, {
          activityType: activitytype
        }, {
          new: true
        })

        await this.client.user.setPresence({
          activity: {
            name: result.activityName,
            type: result.activityType
          },
          status: result.status
        }).then(() => {
          const embed = new MessageEmbed()
            .setColor(spellgrey)
            .setTitle(`${hammer} Presence`)
            .setDescription(`Presence activity type updated to **${activitytype}**.`)

          message.channel.send(embed)
        }).catch(err => {
          SendErrorMsg(message, err.message)
          console.log(err)
        })

        break
      }
      case 'fix': {
        const result = await Presence.findOne({
          unique: 69
        })

        await this.client.user.setPresence({
          activity: {
            name: result.activityName,
            type: result.activityType
          },
          status: result.status
        }).then(() => {
          const embed = new MessageEmbed()
            .setColor(spellgrey)
            .setTitle(`${hammer} Presence`)
            .setDescription(stripIndents`
              Presence has successfully fixed.
              
              **Activity Name:** ${result.activityName}
              **Activity Type:** ${result.activityType.toLowerCase()}
              **Status:** ${result.status}`)

          message.channel.send(embed)
        }).catch(err => {
          SendErrorMsg(message, err.message)
          console.log(err)
        })
        break;
      }
      case 'status': {
        if(!value) {
          return SendErrorMsg(message, 'please specify the new status to update.')
        }

        const status = value.toLowerCase()

        if(!validStatus.includes(status)) {
          return SendErrorMsg(message, 'please use a valid status presence.')
        }

        const result = await Presence.findOneAndUpdate({
          unique: 69
        }, {
          status
        }, {
          new: true
        })

        await this.client.user.setPresence({
          activity: {
            name: result.activityName,
            type: result.activityType
          },
          status: result.status
        }).then(() => {
          const embed = new MessageEmbed()
            .setColor(spellgrey)
            .setTitle(`${hammer} Presence`)
            .setDescription(`Presence status updated to **${status}**.`)

          message.channel.send(embed)
        }).catch(err => {
          SendErrorMsg(message, err.message)
          console.log(err)
        })

        break
      }
      default: {
        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle(`${thinking} Invalid option`)
          .setDescription(stripIndents`
            • Use ${message.anyUsage('presence')} and any available option from below.
            
            **Available options:**
            » \`status\`: change status of the bot.
            » \`fix\`: use when to bot lost his presence.
            » \`activity-type\`: change type of activity of the bot.
            » \`activity-name\`: change name of activity of the bot.`)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }))
      
        message.channel.send(embed)
      }
    }
  }
}