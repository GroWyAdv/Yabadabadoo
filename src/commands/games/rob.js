const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const { spellgrey } = require('@utils/colors.json');
const { banutz } = require('@utils/emojis.json');
const { SendErrorMsg, SendUsageMsg, GetUserFromMention } = require('@utils/functions');
const humanizeDuration = require('humanize-duration');
const Players = require('@schemas/barbot/players');
const barbot = require('@features/barbot');

const humanizeSettings = {
	largest: 2,
	round: true,
	conjunction: ' and ',
	serialComma: false
};

module.exports = class RobCmd extends Command {
	constructor(client) {
		super(client, {
			name: 'rob',
			memberName: 'rob',
			description: 'try your luck to rob someone, pay attention to the shields because they will prevent you.',
			details: 'rob <mentioned member>',

			group: 'games',

			guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },

			clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'USE_EXTERNAL_EMOJIS']
		});
	}

	async run(message, args) {
		const { author, channel, guild } = message;
		let result = await barbot.findUser(author.id);

		if(result == null) {
			return SendErrorMsg(message, `you need to use ${message.anyUsage('init')}.`);
		}

		const then = new Date(result.robLast).getTime();
		const now = new Date().getTime();

		const diffTime = 3600000 - Math.abs(then - now);

		if(diffTime > 0) {
			return SendErrorMsg(message, `you can rob again in ${humanizeDuration(diffTime, humanizeSettings)}.`)
		}

		const member = await GetUserFromMention(this.client, args);

		if(!member) {
			return SendUsageMsg(message, this.details);
		}

		if(member.id == author.id) {
			return SendErrorMsg(message, 'you can\'t rob yourself.');
		}

		result = await barbot.findUser(member.id);

		if(result == null) {
			return SendErrorMsg(message, `${member.username} has no initiated his account.`);
		}

		let description = `**${author.username}** tried to rob **${member.username}** `;

		if(result.coins <= 0) {
			description += 'but noticed he had no coins.';

			await Players.updateOne({
				_id: author.id
			}, {
				robLast: now
			});
		}
		else if(result.shields > 0) {
			await barbot.addShields(member.id, -1).then(async (shields) => {
				description += `and destroyed his shield.\nNow **${member.username}** has ${shields}x :shield: ${shields != 1 ? 'Shields' : 'Shield'} left.`;
			
				await Players.updateOne({
					_id: author.id
				}, {
					robLast: now
				});
			});
		}
		else {
			const chance = Math.floor(Math.random() * 100);

			if(chance < 30) {
				const reward = Math.floor(Math.random() * result.coins) + 1;

				await Players.updateOne({
					_id: author.id
				}, {
					robLast: now,
					$inc: {
						coins: reward,
						robTimes: 1
					}
				});

				await barbot.addCoins(member.id, -reward).then(async (remainingCoins) => {
					await barbot.addLogs(author.id, channel.id, guild.id, `he robbed ${member.username} and got $${reward.toLocaleString()}`);
					await barbot.addLogs(member.id, channel.id, guild.id, `was robbed by ${author.username} and lost $${reward.toLocaleString()}`);
				
					description += `and he succeeded to take ${reward.toLocaleString()}${banutz}\n**${member.username}'s** balance is now ${remainingCoins.toLocaleString()}${banutz}`;
				});
			}
			else {
				description += 'and he failed.';

				await Players.updateOne({
					_id: author.id
				}, {
					robLast: now
				});
			}
		}

		const embed = new MessageEmbed()
			.setColor(spellgrey)
			.setTitle('🎲 Robbing')
			.setDescription(description);

		channel.send(embed);
	}
}