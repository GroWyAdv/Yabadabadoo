const { Command }                                           = require('discord.js-commando');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention }    = require('@utils/functions');
const { MessageEmbed }                                      = require('discord.js');
const { discord }                                           = require('@utils/colors.json');
const settingsSchema                                        = require('@schemas/settings');
const logSchema                                             = require('@schemas/ban-log');
const moment                                                = require('moment-timezone');

module.exports = class BanCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      memberName: 'ban',
      group: 'moderation',
      description: 'Ban a member from the guild',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS', 'MANAGE_MESSAGES'],
      userPermissions: ['BAN_MEMBERS']
    });
  }

  async run(message, args) {
    if(!args[0])
      return SendUsageMsg(message, 'ban <@user> <reason (optional)>');

    const { guild, author } = message;

    let member = GetUserFromMention(this.client, args[0]);
    member = guild.members.cache.get(member.id);

    if(!member)
      return SendErrorMsg(message, 'i can\'t find this member, try again mentioning it.');

    if(this.client.isOwner(member))
      return SendErrorMsg(message, 'i don\'t want to ban this member, is my developer. 😢');

    if(member.id == message.author.id)
      return SendErrorMsg(message, 'i don\'t want to ban you, wtf.');
    
    if(!member.bannable)
      return SendErrorMsg(message, 'i can\'t ban this member, his permissions are higher than mine.');

      let reason = args.slice(1).join(' ');

      if(!reason) {
        reason = 'without reason';
      }

      await member.ban({ reason }).then(async () => {
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
                .setDescription(`A new member was banned, ${msgs[Math.floor(Math.random() * msgs.length)]}`)
                .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true }))
                .setThumbnail(member.user.displayAvatarURL({ size: 1024, dynamic: true }))
                .addFields(
                  { name: '× Banned Member', value: `${member.user.username} [<@${member.id}>]`, inline: true },
                  { name: '× Banned By', value: `${author.username} [<@${author.id}>]`, inline: true },
                  { name: '\u200B', value: '\u200B', inline: true },
                  { name: '× Banned At', value: moment().tz('Europe/Bucharest').format('HH:mm - DD.MM.YYYY'), inline: true },
                  { name: '× Reason', value: reason, inline: true },
                  { name: '\u200B', value: '\u200B', inline: true },
                );
              
              logChannel.send(embed);
            }
            else if(!missingPerms.includes('SEND_MESSAGES')) {
              logChannel.send(`**${member.user.username}** was banned by **${author.username}** for: \`${reason}\``);
            }
          }
        }

        await new logSchema({
          targetId: member.id,
          memberId: author.id,
          guildId: guild.id,
          reason
        }).save();

        await message.channel.send(`* **${member.user.username}** has been succesfully banned. 😢`)
          .then(msg => msg.delete({ timeout: 5000 })).catch(err => console.error(err))
          .catch(err => console.error(err));
      }).catch(err => {
        SendErrorMsg(message, `an error has been produced when i tried to ban this member.\nError: ${err.message}`);
        console.error(err);
      });
  }
}