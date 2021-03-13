const { Command }                                               = require('discord.js-commando');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention }        = require('@utils/functions');
const logSchema                                                 = require('@schemas/kick-log');

module.exports = class KickCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      memberName: 'kick',
      group: 'moderation',
      description: 'Kick out a member from the guild',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'KICK_MEMBERS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'KICK_MEMBERS'],
    });
  }

  async run(message, args) {
    if(!args[0])
      return SendUsageMsg(message, 'kick @user reason (optional)');
    
    let member = GetUserFromMention(this.client, args[0]);
    member = message.guild.members.cache.get(member.id);

    if(!member)
      return SendErrorMsg(message, 'i can\'t find this member, try again mentioning it.');

    if(this.client.isOwner(member))
      return SendErrorMsg(message, 'i don\'t want to kick this member, is my developer. 😢');

    if(member.id == message.author.id)
      return SendErrorMsg(message, 'i don\'t want to kick you.');

    if(!member.kickable)
      return SendErrorMsg(message, 'i can\'t kick this member, his permissions are higher than mine.');

    let reason = args.slice(1).join(' ');

    if(!reason) {
      reason = 'without reason';
    }

    member.kick(reason).then(() => {
      if(message.deletable) {
        message.delete({ timeout: 5000 }).catch(err => console.error(err));
      }

      new logSchema({
        targetId: member.id,
        memberId: message.author.id,
        guildId: message.guild.id,
        reason
      }).save();

      message.channel.send(`* **${member.user.username}** has been successfully kicked. 😢`)
        .then(m => m.delete({ timeout: 5000 }).catch(err => console.error(err)))
        .catch(err => SendErrorMsg(message, `an error has been produced when i tried to kick this member.\nError: ${err.message}`));
    });
  }
}