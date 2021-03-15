const { Command }                                           = require('discord.js-commando');
const { SendUsageMsg, SendErrorMsg, GetUserFromMention }    = require('@utils/functions');

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

    member.setNickname(nickname).then(() => {
      channel.send(`**${author.username}**, you succesfully changed the **${member.user.username}'s** nickname to ${member.nickname == null ? `his name` : `**${member.nickname}**`}.`);
    }).catch(err => {
      SendErrorMsg(message, err.message);
    });
  }
}