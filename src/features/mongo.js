const mongoose            = require('mongoose');
const { mongoPath }       = require('@root/config.json');
const initSettings        = require('@features/settings/init-settings');

module.exports = async (client) => {
  mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function() {
    console.log('Mongoose connected...');
    initSettings(client);
  });
}