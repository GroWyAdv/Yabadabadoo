require('module-alias/register');

const { MongoClient }                                       = require('mongodb');
const { MongoDBProvider }                                   = require('commando-provider-mongo');
const { CommandoClient }                                    = require('discord.js-commando');
const path                                                  = require('path');

const { tokenId, ownerId, defaultPrefix, mongoPath }        = require('@root/config.json');
const mongo                                                 = require('@features/mongo.js');

const client = new CommandoClient({
  commandPrefix: defaultPrefix,
  owner: ownerId
});

client.on('ready', async () => {
  console.log(`We are logged in as ${client.user.tag}`);

  await mongo();

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['misc', 'misc commands'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));
});

client.on('message', message => {
  if(message.author.bot) return;
  if(message.content.includes("@here") || message.content.includes("@everyone")) return;

  if(message.mentions.has(client.user.id)) {
    message.reply('ce vrei ma?');
    return;
  }
})

client.setProvider(MongoClient.connect(mongoPath, { useUnifiedTopology: true })
  .then((client) => {
    return new MongoDBProvider(client, 'yabadabadoo');
  }).catch((err) => {
    console.error(err);
  }));

client.login(tokenId);