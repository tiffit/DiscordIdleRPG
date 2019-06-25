const discord = require('discord.js');
const secret = require('./config/secret.json');
const manager = require('./commands/manager');
const database = require('./database');

const client = new discord.Client();

client.on('message', async (msg) => {
    manager.parse(discord, client, msg);
    
});

client.on('ready', () => {
    database.init(secret);
    console.log(`Connected to Discord`);
})

client.login(secret.token);
exports.discordclient = client;