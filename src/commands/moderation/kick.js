const { Command }                                               = require('discord.js-commando');
const { MessageEmbed }                                          = require('discord.js');
const { discord }                                               = require('@utils/colors.json');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention }        = require('@utils/functions');
const logSchema                                                 = require('@schemas/kick-log');
const settingsSchema                                            = require('@schemas/settings');
const moment                                                    = require('moment-timezone');

module.exports = class KickCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      memberName: 'kick',
      group: 'moderation',
      description: 'Kick out a member from the guild',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'KICK_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'KICK_MEMBERS'],
    });
  }

  async run(message, args) {
    if(!args[0])
      return SendUsageMsg(message, 'kick @user reason (optional)');
    
    const { guild, author } = message;

    let member = GetUserFromMention(this.client, args[0]);
    member = guild.members.cache.get(member.id);

    if(!member)
      return SendErrorMsg(message, 'i can\'t find this member, try again mentioning it.');

    if(this.client.isOwner(member))
      return SendErrorMsg(message, 'i don\'t want to kick this member, is my developer. 😢');

    if(member.id == message.author.id)
      return SendErrorMsg(message, 'i don\'t want to kick you, wtf.');

    if(!member.kickable)
      return SendErrorMsg(message, 'i can\'t kick this member, his permissions are higher than mine.');

    let reason = args.slice(1).join(' ');

    if(!reason) {
      reason = 'without reason';
    }

    await member.kick(reason).then(async () => {
      if(message.deletable) {
        message.delete({ timeout: 5000 }).catch(err => console.error(err));
      }

      const result = await settingsSchema.findOne({ _id: guild.id });

      if(result != null) {
        const logChannel = guild.channels.cache.get(result.modMessages);

        if(logChannel) {
          const missingPerms = logChannel.permissionsFor(this.client.user)
            .missing(['SEND_MESSAGES', 'EMBED_LINKS']);

          if(!missingPerms.includes('EMBED_LINKS')) {
            const msgs = ["lul...", "lmao...", "lel...", "soo sad ☹", "hehe 🤣"];

            const embed = new MessageEmbed()
              .setColor(discord)
              .setTitle('» Moderation Logs')
              .setDescription(`A new member was kicked, ${msgs[Math.floor(Math.random() * msgs.length)]}`)
              .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true }))
              .setThumbnail(member.user.displayAvatarURL({ size: 1024, dynamic: true }))
              .addFields(
                { name: '× Kicked Member', value: `${member.user.username} [<@${member.id}>]`, inline: true },
                { name: '× Kicked By', value: `${author.username} [<@${author.id}>]`, inline: true },
                { name: '\u200B', value: '\u200B', inline: true },
                { name: '× Kicked At', value: moment().tz('Europe/Bucharest').format('HH:mm - DD.MM.YYYY'), inline: true },
                { name: '× Reason', value: reason, inline: true },
                { name: '\u200B', value: '\u200B', inline: true }
              );
            
            logChannel.send(embed);
          }
          else if(!missingPerms.includes('SEND_MESSAGES')) {
            logChannel.send(`**${member.user.username}** was kicked by **${author.username}** for: \`${reason}\``);
          }
        }
      }

      await new logSchema({
        targetId: member.id,
        memberId: author.id,
        guildId: author.id,
        reason
      }).save();

      await message.channel.send(`* **${member.user.username}** has been successfully kicked. 😢`)
        .then(msg => msg.delete({ timeout: 5000 }).catch(err => console.error(err)))
        .catch(err => console.error(err));
    }).catch(err => SendErrorMsg(message, `an error has been produced when i tried to kick this member.\nError: ${err.message}`));
  }
}