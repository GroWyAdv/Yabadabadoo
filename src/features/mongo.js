const mongoose            = require('mongoose');
const { mongoPath }       = require('@root/config.json');
const initSettings        = require('@features/settings/init-settings');

module.exports = async (client) => {
  mongoose.connect(mongoPath, {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  mongoose.connection.on('connected', () => {
    console.log(`Mongoose has connected.`);
    initSettings(client);
  });

  mongoose.connection.on('err', err => {
    console.error(`Mongoose error:\n${err.stack}`);
  });

  mongoose.connection.on('disconnect', () => {
    console.warn(`Mongoose connection lost.`);
  });
}