const discord = require('discord.js');
const secret = require('./config/secret.json');
const properties = require('./config/prop.json');
const manager = require('./commands/manager');
const database = require('./database');
const task = require('./task');

const client = new discord.Client();

client.on('message', async (msg) => {
    manager.parse(discord, client, msg);

});

client.on('ready', () => {
    database.init(secret);
    console.log(`Connected to Discord!`);

    setInterval(() => task.runTasks(), 1000*60);
    task.runTasks();
    console.log(`Started Task Interval!`);
})

client.login(secret.token);
exports.discordclient = client;
exports.properties = properties;