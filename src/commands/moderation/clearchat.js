const { Command }                             = require('discord.js-commando');
const { SendErrorMsg, SendUsageMsg }          = require('@utils/functions');

module.exports = class ClearChatCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'clearchat',
      memberName: 'clearchat',
      aliases: ['cc', 'purge'],
      group: 'moderation',
      description: 'Clear chat lines',

      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'VIEW_CHANNEL'],
      userPermissions: ['SEND_MESSAGES', 'MANAGE_MESSAGES', 'VIEW_CHANNEL']
    });
  }

  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, 'clearchat [amount of messages]');

    let messages = parseInt(args);
    
    if(messages < 1 || messages > 100)
      return SendErrorMsg(message, 'you can\'t delete less than 1 message or more than 100 messages.');
    
    const { channel } = message;

    if(message.deletable) {
      message.delete({ timeout: 100 }).then(() => {
        channel.messages.fetch({ limit: messages }).then(m => {
          channel.bulkDelete(m, true).then(() => {
            channel.send(`♻ ${messages} ${messages == 1 ? 'message' : 'messages'} has been deleted.`).then(m => {
              m.delete({ timeout: 5000 }).catch(err => console.error(err.message));
            });
          }).catch(err => {
            SendErrorMsg(message, 'i can\'t delete this messages.');
            console.error(err.message);
          });
        });
      });
    }
  }
}