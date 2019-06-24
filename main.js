const discord = require('discord.js');
const config = require('./config.json');
const manager = require('./commands/manager');

const client = new discord.Client();

client.on('message', async (msg) => {
    manager.parse(discord, msg);
});

client.login(config.token);