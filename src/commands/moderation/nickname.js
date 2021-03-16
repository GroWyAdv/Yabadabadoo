const { Command }                                           = require('discord.js-commando');
const { SendUsageMsg, SendErrorMsg, GetUserFromMention }    = require('@utils/functions');
const { MessageEmbed }                                      = require('discord.js');
const { discord }                                           = require('@utils/colors.json');
const moment                                                = require('moment-timezone');
const settingsSchema                                        = require('@schemas/settings');

module.exports = class NicknameCmd extends Command {
  constructor(client) {
    super(client,  {
      name: 'nickname',
      memberName: 'nickname',
      aliases: ['nick', 'changenickname', 'changenick'],
      description: 'Changes the nickname of a member',
      group: 'moderation',
      argsType: 'multiple',
      
      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'CHANGE_NICKNAME', 'MANAGE_NICKNAMES'],
      userPermissions: ['CHANGE_NICKNAME', 'MANAGE_NICKNAMES']
    });
  }
  
  async run(message, args) {
    const { channel, guild, author } = message;

    if(!args[0] || !args[1])
      return SendUsageMsg(message, 'nickname <@member> <nickname>');

    let member = GetUserFromMention(this.client, args[0]);
    member = guild.members.cache.get(member.id);

    if(!member)
      return SendErrorMsg(message, 'i can\'t find this member, try again mentioning it.');

    const nickname = args.slice(1).join(' ');

    member.setNickname(nickname).then(async () => {
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
            const embed = new MessageEmbed()
              .setColor(discord)
              .setTitle('» Moderation Logs')
              .setDescription(`Nickname changed.`)
              .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true }))
              .addFields(
                { name: '× Changed By', value: `${author.username} [<@${author.id}>]`, inline: true },
                { name: '× Change At', value: moment().tz('Europe/Bucharest').format('HH:mm - DD.MM.YYYY'), inline: true },
                { name: '\u200B', value: '\u200B', inline: true },

                { name: '× Member Name', value: `${member.user.username} [<@${member.id}>]`, inline: true },
                { name: '× New Nickname', value: member.nickname == null ? 'his name' : member.nickname, inline: true },
                { name: '\u200B', value: '\u200B', inline: true }
              );
            
            logChannel.send(embed);
          }
          else if(!missingPerms.includes('SEND_MESSAGES')) {
            logChannel.send(`**${author.username}** changed **${member.user.username}'s** nickname to ${member.nickname == null ? 'his name' : `**${member.nickname}**`}.`)
          }
        }
      }

      channel.send(`You succesfully changed his nickname.`)
        .then(m => {
          m.delete({ timeout: 5000 }).catch(err => console.error(err));
        });
    }).catch(err => {
      SendErrorMsg(message, err.message);
    });
  }
}