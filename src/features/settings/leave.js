const { MessageEmbed }        = require('discord.js');
const { discord }             = require('@utils/colors.json');
const settingsSchema          = require('@schemas/settings');
const moment                  = require('moment-timezone');

module.exports = (client) => {
  client.on('guildMemberRemove', async (member) => {
    const { guild, user } = member;

    const result = await settingsSchema.findOne({
      _id: guild.id
    });

    if(result != null) {
      const leaveChannel = guild.channels.cache.get(result.leaveMessages);

      if(leaveChannel) {
        const missingPermissions = leaveChannel.permissionsFor(client.user).missing(['SEND_MESSAGES', 'EMBED_LINKS']);

        if(!missingPermissions.includes('EMBED_LINKS')) {
          const embed = new MessageEmbed()
            .setColor(discord)
            .setTitle('» Left')
            .setDescription(`A ${member.bot ? 'bot' : 'member'} has left the server.. 😪`)
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(client.user.username, client.user.displayAvatarURL({ size: 32, dynamic: true }))
            .addFields(
              { name: member.bot ? '× Bot' : '× Member', value: user.tag },
              { name: '× Left At', value: moment().tz('Europe/Bucharest').format('HH:mm DD.MM.YYYY') }
            );
          leaveChannel.send(embed);
        }
        else if(!missingPermissions.includes('SEND_MESSAGES')) {
          leaveChannel.send(`**${user.tag}** left the server. 😪`);
        }
      }
    }
  });
}