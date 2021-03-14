const { Command }                                           = require('discord.js-commando');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention }    = require('@utils/functions');
const logSchema                                             = require('@schemas/ban-log');

module.exports = class BanCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      memberName: 'ban',
      group: 'moderation',
      description: 'Ban a member from the guild',
      argsType: 'multiple',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'BAN_MEMBERS'],
      userPermissions: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'BAN_MEMBERS']
    });
  }

  async run(message, args) {
    if(!args[0])
      return SendUsageMsg(message, 'ban <@user> <reason (optional)>');

    let member = GetUserFromMention(this.client, args[0]);
    member = message.guild.members.cache.get(member.id);

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

        const banLog = {
          targetId: member.id,
          memberId: message.author.id,
          guildId: message.guild.id,
          reason
        };
        await new logSchema(banLog).save();

        await message.channel.send(`* **${member.user.username}** has been succesfully banned. 😢`)
          .then(msg => msg.delete({ timeout: 5000 })).catch(err => console.error(err))
          .catch(err => console.error(err));
      }).catch(err => {
        SendErrorMsg(message, `an error has been produced when i tried to ban this member.\nError: ${err.message}`);
        console.error(err);
      });
  }
}