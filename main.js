const discord = require('discord.js');
const secret = require('./config/secret.json');
const properties = require('./config/prop.json');
var items = require('./items');
const utils = require('./util');
const manager = require('./commands/manager');
const database = require('./database');

const client = new discord.Client();

client.on('message', async (msg) => {
    manager.parse(discord, client, msg);

});

client.on('ready', () => {
    database.init(secret);
    console.log(`Connected to Discord!`);

    database.getAllUsers(datas => {
        datas.forEach(async (data) => {
            if (data.task === "idle") {
                return;
            }
            
            var obj = JSON.parse(data.inventory);

            var speed = 1 * items.fromInternal(obj.equipped[Object.keys(obj.equipped)[0]]).speed;
            if (data.task === "woodcutting") {
                await utils.addItem(data.backpack, "wood", speed);
                database.updateUserObj(data)
            }
            
            
        })
    })
})

client.login(secret.token);
exports.discordclient = client;
exports.properties = properties;