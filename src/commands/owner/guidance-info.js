const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors');
const { stripIndents } = require('common-tags');

module.exports = class GuidanceInfoCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'guidance-info',
      memberName: 'guidance-info',
      description: 'guidance info.',
      details: 'guidance-info',

      group: 'owner',

      guildOnly: true,
      ownerOnly: true,

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS']
    });
  }

  run(message) {
    const { channel, guild } = message;

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setTitle(`Salutare! :wave:`)
      .setThumbnail(guild.iconURL({ size: 1024, dynamic: true, format: 'png' }))
      .setDescription(stripIndents`
        Bine ai venit pe serverul de discord **${guild.name}**.
        Regulamentul poate fi modificat oricand, se recomanda vizualizarea frecventa al acestuia.
        
        **• Respecta termenii si conditiile Discord**
        Acceseaza [TOS](https://www.discord.com/terms) si [Guidelines](https://www.discord.com/guidelines) pentru mai multe detalii.
        
        **• Fara invite link-uri**
        Nu este permisa reclama altor servere de discord pe niciun canal.
        
        **• Fara continut NSFW**
        Pentru a nu se crea probleme, continutul NSFW nu este permis pe niciun canal.
        
        **• Pastreaza chat-urile curate**
        Asta inseamna ca nu este permis \`caps-lock\` excesiv, \`spam\`, \`free-chat\` in locurile nepermise sau deranjarea unui membru prin mention.
        
        » Owner - **${guild.owner.user.tag}**
        » YouTube - [Click Here](https://www.youtube.com/c/GroWyTuts)
        » GitHub - [Click Here](https://github.com/GroWyAdv)
        » Steam - [Click Here](https://steamcommunity.com/id/gr0wy/)`);

    channel.send(embed);
  }
}