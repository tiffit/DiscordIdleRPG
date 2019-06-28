var db = require('../database');
var dungeons = require('./../dungeons');
var task = require('../task');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    var hp = 100;
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        channel.send('Started dungeon.');
        var dungeon = dungeons.fromInternal(args[0].toLowerCase());
        var task = `dungeon:${dungeon.internal}:${hp}`;
        data.task = task;
        db.updateUserObj(data);
    });
}