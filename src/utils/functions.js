module.exports = {
  SendErrorMsg: function(message, error) {
    return message.channel.send(`**${message.author.username}**, ${error}`);
  },

  SendUsageMsg: function(message, usage) {
    return message.channel.send(`**${message.author.username}** try this ${message.guild.commandPrefix}${usage}`);
  }
}