"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBProvider = void 0;
const discord_js_commando_1 = require("discord.js-commando");
/**
 * Uses an MongoDB collection to store settings with guilds
 */
class MongoDBProvider extends discord_js_commando_1.SettingProvider {
    /**
     * @param client - Database for the provider
     * @param dbName - The database name
     */
    constructor(client, dbName) {
        super();
        /**
         * Settings cached in memory, mapped by guild ID (or 'global')
         */
        this.settings = new Map();
        /**
         * Listeners on the client, mapped by the event name
         */
        this.listeners = new Map();
        this.mongoClient = client;
        this.db = client.db(dbName);
    }
    async init(client) {
        this.client = client;
        // Load or create the settings collection
        const collection = this.db.collection('settings');
        // Load all settings
        collection.find().forEach(doc => {
            const guild = doc.guild !== '0' ? doc.guild : 'global';
            this.settings.set(guild, doc.settings);
            // Guild is not global, and doesn't exist currently so lets skip it.
            if (guild !== 'global' && !client.guilds.cache.has(doc.guild))
                return;
            this.setupGuild(guild, doc.settings);
        });
        // Listen for changes
        this.listeners
            .set('commandPrefixChange', (guild, prefix) => this.set(guild, 'prefix', prefix))
            .set('commandStatusChange', (guild, command, enabled) => this.set(guild, `cmd-${command.name}`, enabled))
            .set('groupStatusChange', (guild, group, enabled) => this.set(guild, `grp-${group.id}`, enabled))
            .set('guildCreate', (guild) => {
            const settings = this.settings.get(guild.id);
            if (!settings)
                return;
            this.setupGuild(guild.id, settings);
        })
            .set('commandRegister', (command) => {
            for (const [guild, settings] of this.settings) {
                if (guild !== 'global' && !client.guilds.cache.has(guild))
                    continue;
                this.setupGuildCommand(client.guilds.cache.get(guild), command, settings);
            }
        })
            .set('groupRegister', (group) => {
            for (const [guild, settings] of this.settings) {
                if (guild !== 'global' && !client.guilds.cache.has(guild))
                    continue;
                this.setupGuildGroup(client.guilds.cache.get(guild), group, settings);
            }
        });
        for (const [event, listener] of this.listeners)
            client.on(event, listener);
    }
    async destroy() {
        // Close database connection
        this.mongoClient.close();
        // Remove all listeners from the client
        for (const [event, listener] of this.listeners)
            this.client.removeListener(event, listener);
        this.listeners.clear();
    }
    get(guild, key, defVal) {
        const settings = this.settings.get(discord_js_commando_1.SettingProvider.getGuildID(guild));
        return settings ? typeof settings[key] !== 'undefined' ? settings[key] : defVal : defVal;
    }
    async set(guild, key, val) {
        const guildId = discord_js_commando_1.SettingProvider.getGuildID(guild);
        let settings = this.settings.get(guildId);
        if (!settings) {
            settings = {};
            this.settings.set(guildId, settings);
        }
        settings[key] = val;
        await this.updateGuild(guildId, settings);
        if (guildId === 'global')
            this.updateOtherShards(key, val);
        return val;
    }
    async remove(guild, key) {
        const guildId = discord_js_commando_1.SettingProvider.getGuildID(guild);
        const settings = this.settings.get(guildId);
        if (!settings || typeof settings[key] === 'undefined')
            return;
        const val = settings[key];
        delete settings[key]; // NOTE: I know this isn't efficient, but it does the job.
        await this.updateGuild(guildId, settings);
        if (guildId === 'global')
            this.updateOtherShards(key, undefined);
        return val;
    }
    async clear(guild) {
        const guildId = discord_js_commando_1.SettingProvider.getGuildID(guild);
        if (!this.settings.has(guildId))
            return;
        this.settings.delete(guildId);
        const collection = this.db.collection('settings');
        await collection.deleteOne({ guild: guildId !== 'global' ? guildId : 0 });
    }
    async updateGuild(guild, settings) {
        guild = guild !== 'global' ? guild : 0;
        const collection = this.db.collection('settings');
        await collection.updateOne({ guild }, { $set: { guild, settings } }, { upsert: true });
    }
    /**
     * Loads all settings for a guild
     * @param guild - Guild ID to load the settings of (or 'global')
     * @param settings - Settings to load
     */
    setupGuild(guildId, settings) {
        if (typeof guildId !== 'string')
            throw new TypeError('The guild must be a guild ID or "global".');
        const guild = this.client.guilds.cache.get(guildId) || null;
        // Load the command prefix
        if (typeof settings.prefix !== 'undefined') {
            if (guild)
                guild.commandPrefix = settings.prefix;
            else
                this.client.commandPrefix = settings.prefix;
        }
        // Load all command/group statuses
        for (const command of this.client.registry.commands.values())
            this.setupGuildCommand(guild, command, settings);
        for (const group of this.client.registry.groups.values())
            this.setupGuildGroup(guild, group, settings);
    }
    /**
     * Sets up a command's status in a guild from the guild's settings
     * @param guild		- Guild to set the status in
     * @param command	- Command to set the status of
     * @param settings	- Settings of the guild
     */
    setupGuildCommand(guild, command, settings) {
        if (typeof settings[`cmd-${command.name}`] === 'undefined')
            return;
        command.setEnabledIn(guild, settings[`cmd-${command.name}`]);
    }
    /**
     * Sets up a group's status in a guild from the guild's settings
     * @param guild		- Guild to set the status in
     * @param group		- Group to set the status of
     * @param settings	- Settings of the guild
     */
    setupGuildGroup(guild, group, settings) {
        if (typeof settings[`grp-${group.id}`] === 'undefined')
            return;
        group.setEnabledIn(guild, settings[`grp-${group.id}`]);
    }
    /**
     * Updates a global setting on all other shards if using the {@link ShardingManager}.
     * @param key - Key of the setting to update
     * @param val - Value of the setting
     */
    updateOtherShards(key, val) {
        if (!this.client.shard)
            return;
        key = JSON.stringify(key);
        val = typeof val !== 'undefined' ? JSON.stringify(val) : 'undefined';
        this.client.shard.broadcastEval(`
			const ids = [${this.client.shard.ids.join(',')}];
			if(!this.shard.ids.some(id => ids.includes(id)) && this.provider && this.provider.settings) {
				let global = this.provider.settings.get('global');
				if(!global) {
					global = {};
					this.provider.settings.set('global', global);
				}
				global[${key}] = ${val};
			}
		`);
    }
}
exports.MongoDBProvider = MongoDBProvider;
