const { Command } = require('discord.js-commando');
const { COVID19API } = require('@evrimfeyyaz/covid-19-api');
const { spellgrey } = require('@utils/colors.json');
const { MessageEmbed } = require('discord.js');
const { SendUsageMsg, SendErrorMsg } = require('@utils/functions');
const nodeFetch = require('node-fetch');

const covid = new COVID19API({ fetch: nodeFetch });
covid.init(() => console.log("Covid stats initialized."));

module.exports = class CovidCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'covid',
      memberName: 'covid',
      group: 'misc',
      description: 'displays stats about Covid-19 for whatever country you want.',
      details: 'covid <country name>',
      
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES']
    });
  }

  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, this.details);

    const { channel } = message;

    const embed = new MessageEmbed()
      .setColor(spellgrey)
      .setDescription(`Processing...`);

    const msg = await channel.send(embed);

    covid.getDataByLocation(args).then(async (data) => {
      const values = data.values[data.values.length - 1];

      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle('» Covid 19 Statistics')
        .setDescription(`Informations about **${data.location}** on **${values.date}**\n\u200B`)
        .addFields(
          { name: '• Confirmed', value: values.confirmed.toLocaleString(), inline: true },
          { name: '• Recovered', value: values.recovered.toLocaleString(), inline: true },
          { name: '• Deaths', value: values.deaths.toLocaleString(), inline: true },

          { name: '• New Confirmed', value: values.newConfirmed.toLocaleString(), inline: true },
          { name: '• New Recovered', value: values.newRecovered.toLocaleString(), inline: true },
          { name: '• New Deaths', value: values.newDeaths.toLocaleString(), inline: true },

          { name: '• Active Cases', value: values.activeCases.toLocaleString(), inline: true },
          { name: '• Recovery Rate', value: values.recoveryRate.toFixed(2), inline: true },
          { name: '• Fatality Rate', value: values.caseFatalityRate.toFixed(2), inline: true }
        );
      
      msg.edit({ content: '', embed });
    }).catch(err => {
      msg.delete({ timeout: 100 }).catch(err => console.error(err));

      SendErrorMsg(message, err.message);
    });
  }
}