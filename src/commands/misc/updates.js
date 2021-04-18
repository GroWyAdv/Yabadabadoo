const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const { spellgrey } = require('@utils/colors.json')
const { hammer } = require('@utils/emojis.json')
const paginationEmbed = require('discord.js-pagination')
const { stripIndents } = require('common-tags')

module.exports = class UpdatesCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'updates',
      memberName: 'updates',
      description: 'displays updates of the bot.',
      details: 'updates',

      group: 'misc',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    })
  }

  async run(message) {
    const pages = [
      new MessageEmbed()
        .setColor(spellgrey)
        .setTitle(`${hammer} Version 1.2.5`)
        .setDescription(stripIndents`
          **» Changed**
          \u200B\u200B  • limited the played amount at **coinflip** command to $10.000.
          
          **» Added**
          \u200B\u200B  • **fix** option to **presence** command to update the presence when the bot lost it.`),
      new MessageEmbed()
        .setColor(spellgrey)
        .setTitle(`${hammer} Version 1.2.3`)
        .setDescription(stripIndents`
          **» Added:**
          \u200B\u200B  • **reportbug** command to report a bug of bot Yabadabadoo to his owners.
          \u200B\u200B  • **weekly** command to get a weekly reward, the reward is amount of 7 uses of **daily** command.
          \u200B\u200B  • **updates** command to display last updates of the bot Yabadabadoo.
            
          • Delay from **rob** command will be displayed first before the syntax.`)
    ]
    
    paginationEmbed(message, pages)
  }
}