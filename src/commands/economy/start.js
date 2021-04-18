const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { SendErrorMsg } = require('@utils/functions');
const { spellgrey } = require('@utils/colors.json');
const { euro_bag, banutz } = require('@utils/emojis.json');
const Players = require('@schemas/barbot/players');
const barbot = require('@features/barbot');

module.exports = class StartCmd extends Command {
  constructor(client) {
    super(client, {
      name: 'start',
      memberName: 'start',
      aliases: ['init'],
      description: 'initiating your account, the bot will insert you a new account in the database.',
      details: 'start',
      
      group: 'economy',

      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
    });
  }

  async run(message) {
    const { author, channel, guild } = message;

    const then = new Date(author.createdAt).getTime();
    const now = new Date().getTime();

    const diffTime = Math.abs(then - now);
    const diffDays = Math.floor((((diffTime / 1000) / 60) / 60) / 24); 

    if(diffDays < 14) {
      return SendErrorMsg(message, `members who have the account created in less than 14 days can't initiate an account.`);
    }

    let result = await Players.findOne({
      memberId: author.id
    });

    if(result != null) {
      return SendErrorMsg(message, 'you already initiated an account.');
    }
    
    barbot.registerUser(author.id).then(async (result) => {
      await barbot.addLogs(author.id, channel.id, guild.id, `started the game with $${result.coins.toLocaleString()}.`);

      const embed = new MessageEmbed()
        .setColor(spellgrey)
        .setTitle(`${euro_bag} Initiating account`)
        .setDescription(`Welcome **${author.username}**.\nYour account was created and you've got **${result.coins.toLocaleString()}**${banutz} to begin.\nBe careful, someone can steal your coins.\n\nUse help command to see **economy** and **games** groups commands.`);

      channel.send(embed);
    });
  }
}