const { Command } = require('discord.js-commando');
const { SendErrorMsg, SendUsageMsg } = require('@utils/functions');
const { spellgrey } = require('@utils/colors.json');
const { MessageEmbed } = require('discord.js');
const settingsSchema = require('@schemas/settings');

module.exports = class UpdateCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'settings',
      memberName: 'settings',
      aliases: ['setting'],
      group: 'moderation',
      description: 'use to acces the settings panel of the bot for this guild, also you can change options with this command.',
      details: 'settings <option (default will show you the panel)>',
      argsType: 'multiple',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS'],
      userPermissions: ['ADMINISTRATOR']
    });
  }

  async run(message, args) {
    const { channel, guild } = message;

    switch(args[0]) {
      case 'help': {
        const embed = new MessageEmbed()
          .setColor(spellgrey)
          .setTitle('Settings Help')
          .setDescription('Here are some informations for settings panel.\nUse `disable` parameter to disable a feature.')
          .addFields(
            { name: '• Welcome Messages', value: 'Set the channel where the bot will send messages related to members who are joining the server. **TIP:** You can disable the `EMBED_LINKS` permission for the bot so he\'ll only send messages instead of embeds.' },
            { name: '• Leave Messages', value: 'Set the channel where the bot will send messages related to members who are leaving the server. **TIP:** You can disable the `EMBED_LINKS` permission for the bot so he\'ll only send messages instead of embeds.' },
            { name: '• Moderation Logs', value: 'Set the channel where the bot will send log messages related to `ban` and `kick` commands. **TIP:** You can disable the `EMBED_LINKS` permission for the bot so he\'ll only send messages instead of embeds.' }
          );
        
        return channel.send(embed);
      }
      case 'welcome': case 'welcomemessage': case 'welcome-message': case 'welcomemsg': {
        if(!args[1])
          return SendUsageMsg(message, 'settings welcome-message <mention the channel/disable>');
        
        if(args[1] == 'disable') {
          await settingsSchema.findOneAndUpdate({
            _id: guild.id
          }, {
            welcomeMessages: 'none'
          });

          await channel.send(`**Welcome Messages** disabled.`);
        }
        else {
          const welcomeChannel = message.mentions.channels.first();

          if(!welcomeChannel)
            return SendErrorMsg(message, 'i don\'t find this channel, please try again mentioning the channel.');

          await settingsSchema.findOneAndUpdate({
            _id: guild.id
          }, {
            welcomeMessages: welcomeChannel.id
          });

          await channel.send(`**Welcome Messages** updated to ${welcomeChannel}.`);
        }
        break;
      }
      case 'leave': case 'leavemessages': case 'leave-messages': case 'leave-msg': {
        if(!args[1])
          return SendUsageMsg(message, 'settings leave-messages <mention the channel/disable>');
        
        if(args[1] == 'disable') {
          await settingsSchema.findOneAndUpdate({
            _id: guild.id
          }, {
            leaveMessages: 'none'
          });

          await channel.send(`**Leave Messages** disabled.`);
        }
        else {
          const leaveChannel = message.mentions.channels.first();

          if(!leaveChannel)
            return SendErrorMsg(message, 'i don\'t find this channel, please try again mentioning the channel.');

          await settingsSchema.findOneAndUpdate({
            _id: guild.id
          }, {
            leaveMessages: leaveChannel.id
          });

          await channel.send(`**Leave Messages** updated to ${leaveChannel}.`);
        }
        break;
      }
      case 'moderation': case 'moderation-logs': case 'moderationlogs': {
        if(!args[1])
          return SendUsageMsg(message, 'settings moderation-logs <mention the channel/disable>');

        if(args[1] == 'disable') {
          await settingsSchema.findOneAndUpdate({
            _id: guild.id
          }, {
            modMessages: 'none'
          });

          await channel.send(`**Moderation Logs** disabled.`);
        }
        else {
          const logChannel = message.mentions.channels.first();

          if(!logChannel)
            return SendErrorMsg(message, 'i don\'t find this channel, please try again mentioning the channel.');

          await settingsSchema.findOneAndUpdate({
            _id: guild.id
          }, {
            modMessages: logChannel.id
          });

          await channel.send(`**Moderation Logs** updated to ${logChannel}.`);
        }
        break;
      }
      default: {
        const settings = await settingsSchema.findOne({ _id: guild.id });
        
        if(settings != null) {
          const welcomeChannel = settings.welcomeMessages == 'none' ? 'Disabled' : guild.channels.cache.get(settings.welcomeMessages);
          const leaveChannel = settings.leaveMessages == 'none' ? 'Disabled' : guild.channels.cache.get(settings.leaveMessages);
          const modChannel = settings.modMessages == 'none' ? 'Disabled' : guild.channels.cache.get(settings.modMessages);

          const embed = new MessageEmbed()
            .setColor(spellgrey)
            .setTitle('» Settings')
            .setDescription(`There are the current guild settings for the bot.\n• You can use ${message.anyUsage('settings')} to change.\n• Also use ${message.anyUsage('settings help')} for more informations.`)
            .setFooter(this.client.user.username, this.client.user.displayAvatarURL({ size: 32, dynamic: true, format: 'png' }))
            .addFields(
              { name: '• Welcome Messages', value: welcomeChannel ? welcomeChannel : `Disabled`, inline: true },
              { name: '• Leave Messages', value: leaveChannel ? leaveChannel : `Disabled`, inline: true },
              { name: '• Moderation Logs', value: modChannel ? modChannel : `Disabled`, inline: true }
            );
    
          channel.send(embed);
        }
      }
    }
  }
}