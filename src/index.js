require('module-alias/register');

const { tokenId, ownerId, defaultPrefix, mongoPath } = require('@root/config.json');
const { SendErrorMsg } = require('@utils/functions');
const { euro_bag, thinking } = require('@utils/emojis.json');
const { MongoClient } = require('mongodb');
const { MongoDBProvider } = require('commando-provider-mongo');
const Commando = require('discord.js-commando');
const path = require('path');
const mongo = require('@features/mongo');
const welcome = require('@features/settings/welcome');
const leave = require('@features/settings/leave');
const addGuild = require('@features/settings/add-guild');
const presence = require('@features/settings/presence');

const client = new Commando.Client({
  commandPrefix: defaultPrefix,
  owner: [ownerId, '409455294603591680']
});

client.on('ready', async () => {
  console.log(`We are logged in as ${client.user.tag}`)

  await mongo(client)

  presence(client)
  addGuild(client)
  welcome(client)
  leave(client)

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['misc', ':tools: Miscellaneous'],
      ['moderation', ':unlock: Moderation'],
      ['nsfw', ':underage: NSFW'],
      ['economy', `${euro_bag} Economy`],
      ['games', ':game_die: Games'],
      ['owner', ':skull: Only Bot Owner'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'))
})

client.on('unknownCommand', (message) => {
  if(message.channel.type == "dm") {
    return;
  }

  const missingPermissions = message.channel.permissionsFor(client.user)
    .missing(['ADD_REACTIONS', 'SEND_MESSAGES']);
  
  if(!missingPermissions.includes('ADD_REACTIONS')) {
    message.react(thinking).catch(err => console.error(err));
  }
  else if(!missingPermissions.includes('SEND_MESSAGES')) {
    SendErrorMsg(message, 'i don\'t recognize this command, uh.');
  }
});

client.setProvider(MongoClient.connect(mongoPath, { useUnifiedTopology: true })
  .then((client) => {
    return new MongoDBProvider(client, 'yabadabadoo-dev');
  }).catch(err => console.error(err)));

client.login(tokenId);