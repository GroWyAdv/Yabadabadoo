const { Command } = require('discord.js-commando');
const { MessageEmbed, MessageCollector } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { stripIndents } = require('common-tags');
const { banutz, thinking, hammer } = require('@utils/emojis.json');
const { SendErrorMsg, GetUserFromMention } = require('@utils/functions');
const humanize = require('humanize-duration');
const Players = require('@schemas/barbot/players');
const Logs = require('@schemas/barbot/logs');

const humanizeSettings = {
  largest: 2,
  round: true,
  conjunction: ' and ',
  serialComma: false
};

const collectorSettings = {
  max: 1,
  time: 1000 * 20
};

const removingCache = new Map();

module.exports = class EconomyModCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'economy-mod',
      memberName: 'economy-mod',
      aliases: ['mod-economy'],
      description: 'use this command to moderate the economy.',
      details: 'economy-mod <option> <value>',

      argsType: 'multiple',
      group: 'owner',

      guildOnly: true,
      ownerOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message, args) {
    const { author, channel } = message;
    const [ option, value, filter ] = args;

    switch(option) {
      case 'delete-profile': case 'delete-user': case 'remove-user': case 'remove-profile': {
        const member = await GetUserFromMention(this.client, value);

        if(!member) {
          return SendErrorMsg(message, 'please mention who user you want to remove from the database.');
        }

        let result = await Players.findOne({
          _id: member.id
        });

        if(result == null) {
          return SendErrorMsg(message, 'this user has not initiated an account.');
        }

        if(removingCache.has(member.id)) {
          const by = removingCache.get(member.id);

          if(by == author.id) {
            return SendErrorMsg(message, 'please type `yes` to confirm or `no` to decline.');
          }
          else {
            return this.client.users.fetch(by).then(async (member) => {
              SendErrorMsg(message, `${member.username} is already in confirming state to remove this account.`);
            });
          }
        }

        const collectorFilter = (msg) => {
          return (msg.content.toLowerCase() == 'yes' || msg.content.toLowerCase() == 'no') && msg.author.id == author.id;
        }

        this.client.users.fetch(result._id).then(async (user) => {
          const embed = new MessageEmbed()
            .setColor(spellgrey)
            .setTitle(`${hammer} Confirm`)
            .setDescription(`**${author.username}** you're about to remove user **${user.username}** from the database.\nAre you sure you want to delete his account?\n\nType in chat \`yes\` to confirm or \`no\` to decline.`)
          
          channel.send(embed)
        });

        const collector = new MessageCollector(channel, collectorFilter, collectorSettings);
        
        removingCache.set(member.id, author.id);

        collector.on('end', async (collected) => {
          const collectedMessage = collected.first();
          
          removingCache.delete(member.id);

          if(!collectedMessage) {
            const embed = new MessageEmbed()
              .setColor(spellgrey)
              .setTitle(`${hammer} Canceled`)
              .setDescription(`**${author.username}'s** confirmation to remove **${member.username}'s** account has expired.`)

            return channel.send(embed)
          }

          if(collectedMessage.content.toLowerCase() == 'yes') {
            result = await Players.deleteOne({
              _id: member.id
            });

            if(result.deletedCount) {
              const embed = new MessageEmbed()
                .setColor(spellgrey)
                .setTitle(`${hammer} Action confirmed`)
                .setDescription(`**${author.username}** succesfully removed **${member.username}'s** account from the database.`)

              channel.send(embed)
            }
          }
          else {
            const embed = new MessageEmbed()
              .setColor(spellgrey)
              .setTitle(`${hammer} Action declined`)
              .setDescription(`**${author.username}** declined his action to remove **${member.username}'s** account.`)

            channel.send(embed)
          }
        });
        break;
      }
      case 'show-profile': case 'show-user': {
        const member = await GetUserFromMention(this.client, value);

        if(!member) {
          return SendErrorMsg(message, 'please mention who profile you want to see.');
        }

        const result = await Players.findOne({
          _id: member.id
        });

        if(result == null) {
          return SendErrorMsg(message, 'this user has not initiated an account.');
        }

        const now = new Date().getTime();

        const diffTime = {
          shieldDelay: 3600000 - Math.abs(new Date(result.shieldsDelay).getTime() - now),
          lottoDelay: 43200000 - Math.abs(new Date(result.lottoWinDelay).getTime() - now),
          dailyDelay: 86400000 - Math.abs(new Date(result.dailyLast).getTime() - now),
          robDelay: 3600000 - Math.abs(new Date(result.robLast).getTime() - now)
        };

        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle(`${hammer} ${member.username}'s account`)
          .setThumbnail(member.displayAvatarURL({ size: 256, dynamic: true, format: 'png' }))
          .setDescription(`There are informations about **${member.username}'s account**.\n\u200B`)
          .addFields({
            name: '• Balance',
            value: `${banutz}${result.coins.toLocaleString()}`,
            inline: true
          }, {
            name: '• Shields',
            value: `:shield: ${result.shields.toLocaleString()}`,
            inline: true
          }, {
            name: '• Lotto Tickets',
            value: `:tickets: ${result.lottoTickets.toLocaleString()}`,
            inline: true
          }, {
            name: '• Shield Delay',
            value: diffTime.shieldDelay > 0 ? humanize(diffTime.shieldDelay, humanizeSettings) : 'no delay',
            inline: true
          }, {
            name: '• Rob Delay',
            value: diffTime.robDelay > 0 ? humanize(diffTime.robDelay, humanizeSettings) : 'no delay',
            inline: true
          }, {
            name: '• Daily Delay',
            value: diffTime.dailyDelay > 0 ? humanize(diffTime.dailyDelay, humanizeSettings) : 'no delay',
            inline: true
          }, {
            name: '• Lotto Delay',
            value: diffTime.lottoDelay > 0 ? humanize(diffTime.lottoDelay, humanizeSettings) : 'no delay',
            inline: true
          }, {
            name: '• Daily Times',
            value: `${result.dailyTimes.toLocaleString()} times`,
            inline: true
          }, {
            name: '• Rob Times',
            value: `${result.robTimes.toLocaleString()} times`,
            inline: true
          }, {
            name: '• Lotto Win Times',
            value: `${result.lottoWinTimes.toLocaleString()} times`,
            inline: true
          }, {
            name: '\u200B',
            value: '\u200B',
            inline: true
          });

        channel.send(embed);
        break;
      }
      case 'show-logs': {
        const rows = parseInt(value) || 10;

        if(rows > 30) {
          return SendErrorMsg(message, 'you cannot get more than 30 logs.');
        }

        let results;

        if(value == '-g' || value == '-guild') {
          results = await Logs.find({
            guildId: filter
          }).sort({
            $natural: -1
          }).limit(rows); 
        }
        else if(value == '-m' || value == '-member') {
          results = await Logs.find({
            memberId: filter
          }).sort({
            $natural: -1
          }).limit(rows);
        }
        else if(value == '-c' || value == '-channel') {
          results = await Logs.find({
            channelId: filter
          }).sort({
            $natural: -1
          }).limit(rows);
        }
        else {
          results = await Logs.find({})
            .sort({
              $natural: -1
            }).limit(rows);
        }

        if(!results.length) {
          return SendErrorMsg(message, 'there are no logs in database.');
        }

        let string = `There are the last **${results.length} logs**.\n\n`;

        for(let counter = 0; counter < results.length; counter ++) {
          let { memberId, channelId, guildId, text } = results[counter];

          await this.client.users.fetch(memberId).then(async (user) => {
            string += `**${counter + 1}. ${user.username}** ${text}\n`;
          });
        }

        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle(`${hammer} Last Economy Logs`)
          .setDescription(string)

        channel.send(embed);
        break
      }
      default: {
        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle(`${thinking} Invalid option`)
          .setDescription(stripIndents`
            • Use ${message.anyUsage('economy-mod')} and any available option from below.
            
            **Available options:**
            » \`show-logs\`: display last 10 logs from database.
            » \`show-profile\`: display details about any user who started playing.
            » \`delete-profile\`: delete a user from database.`)
          .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }));
        
        channel.send(embed);
      }
    }
  }
}