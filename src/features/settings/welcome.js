const { MessageEmbed }                  = require('discord.js');
const { discord }                       = require('@utils/colors.json');
const settingsSchema                    = require('@schemas/settings');
const moment                            = require('moment-timezone');

module.exports = (client) => {
  client.on('guildMemberAdd', async (member) => {
    const { guild, user } = member;

    const result = await settingsSchema.findOne({
      _id: guild.id
    });
    
    if(result != null) {
      const welcomeChannel = guild.channels.cache.get(result.welcomeMessages);
     
      if(welcomeChannel) {
        const missingPermissions = welcomeChannel.permissionsFor(client.user).missing(['SEND_MESSAGES', 'EMBED_LINKS']);

        if(!missingPermissions.includes('EMBED_LINKS')) {
          const embed = new MessageEmbed()
            .setColor(discord)
            .setTitle('» Join')
            .setDescription(`A new ${member.bot ? 'bot' : 'member'} joined the server... 🍾🤗🥂`)
            .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter(client.user.username, client.user.displayAvatarURL({ size: 32, dynamic: true }))
            .addFields(
              { name: member.bot ? '× Bot' : '× Member', value: user.tag },
              { name: '× Account Created At', value: moment(user.createdAt).tz('Europe/Bucharest').format('HH:mm - DD.MM.YYYY') }
            );
          
          welcomeChannel.send(embed);
        } else if(!missingPermissions.includes('SEND_MESSAGES')) {
          welcomeChannel.send(`**${user.tag}** joined the server. 🍾🤗🥂`);
        }
      }
    }
  });
}