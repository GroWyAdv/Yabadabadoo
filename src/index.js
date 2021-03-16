require('module-alias/register');

const { tokenId, ownerId, defaultPrefix, mongoPath }        = require('@root/config.json');
const { SendErrorMsg }                                      = require('@utils/functions');

const { MongoClient }               = require('mongodb');
const { MongoDBProvider }           = require('commando-provider-mongo');
const { CommandoClient }            = require('discord.js-commando');
const path                          = require('path');

/* Features */
const mongo           = require('@features/mongo');
const welcome         = require('@features/settings/welcome');
const leave           = require('@features/settings/leave');

const client = new CommandoClient({
  commandPrefix: defaultPrefix,
  owner: ownerId
});

client.on('ready', async () => {
  console.log(`We are logged in as ${client.user.tag}`);

  await mongo(client);
  welcome(client);
  leave(client);

  client.registry
    .registerDefaultTypes()
    .registerGroups([
      ['misc', ':tools: Miscellaneous'],
      ['moderation', ':unlock: Moderation'],
      ['nsfw', ':underage: NSFW'],
    ])
    .registerCommandsIn(path.join(__dirname, 'commands'));
});

client.on('unknownCommand', (message) => {
  if(message.channel.type == 'dm') {
    return;
  }

  const missingPermissions = message.channel.permissionsFor(client.user)
    .missing(['ADD_REACTIONS', 'SEND_MESSAGES']);
  
  if(!missingPermissions.includes('ADD_REACTIONS')) {
    message.react('🤔').catch(err => console.error(err));
  }
  else if(!missingPermissions.includes('SEND_MESSAGES')) {
    SendErrorMsg(message, 'i don\'t recognize this command, uh.');
  }
});

client.setProvider(MongoClient.connect(mongoPath, { useUnifiedTopology: true })
  .then((client) => {
    return new MongoDBProvider(client, 'yabadabadoo');
  }).catch(err => console.error(err)));

client.login(tokenId);