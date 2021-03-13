require('module-alias/register');

const { MongoClient }                                       = require('mongodb');
const { MongoDBProvider }                                   = require('commando-provider-mongo');
const { CommandoClient }                                    = require('discord.js-commando');
const path                                                  = require('path');

const { tokenId, ownerId, defaultPrefix, mongoPath }        = require('@root/config.json');
const mongo                                                 = require('@features/mongo');

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
      ['misc', ':tools: Miscellaneous'],
      ['moderation', ':unlock: Moderation'],
      ['nsfw', ':underage: NSFW'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));
});

client.setProvider(MongoClient.connect(mongoPath, { useUnifiedTopology: true })
  .then((client) => {
    return new MongoDBProvider(client, 'yabadabadoo');
  }).catch((err) => {
    console.error(err);
  }));

client.login(tokenId);