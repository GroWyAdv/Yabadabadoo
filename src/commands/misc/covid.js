const { Command }                       = require('discord.js-commando');
const { COVID19API }                    = require('@evrimfeyyaz/covid-19-api');
const { discord }                       = require('@utils/colors.json');
const { MessageEmbed }                  = require('discord.js');
const { SendUsageMsg, SendErrorMsg }    = require('@utils/functions');
const nodeFetch                         = require('node-fetch');

const covid = new COVID19API({ fetch: nodeFetch });
covid.init(() => console.log("Covid stats initialized."));

module.exports = class CovidCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'covid',
      memberName: 'covid',
      group: 'misc',
      description: 'Displays stats about covid for whatever country',
      
      guildOnly: true,

      clientPermissions: ['SEND_MESSAGES']
    });
  }

  async run(message, args) {
    if(!args)
      return SendUsageMsg(message, 'covid <country name>');

    const { channel } = message;
    const msg = await channel.send(new MessageEmbed({
      description: `Processing...`,
      color: discord
    }));

    await covid.getDataByLocation(args).then(async (data) => {
      const values = data.values[data.values.length - 1];

      const embed = await new MessageEmbed()
        .setColor(discord)
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
      
      await msg.edit({
        content: '',
        embed
      });
    }).catch(err => {
      msg.delete({ timeout: 100 }).catch(err => console.error(err));

      SendErrorMsg(message, err.message);
    });
  }
}