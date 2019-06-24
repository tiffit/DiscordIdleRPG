const discord = require('discord.js');
const secret = require('./config/secret.json');
const manager = require('./commands/manager');
const database = require('./database');

const client = new discord.Client();

client.on('message', async (msg) => {
    manager.parse(discord, msg);
});

client.login(secret.token);
//database.init(secret);