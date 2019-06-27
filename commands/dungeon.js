var db = require('../database');
var dungeon = require('../dungeons');
var task = require('../task');

exports.run = async function (discord, bot, args, member, channel) {
    if (args.length == 0) {
        channel.send("INCORRECT LENGTH");
    }
    var hp = 100
    db.getUserObj(member.id, member.guild.id, (data) => {
        var string = `dungeon:${dungeon.fromInternal(args[0]).internal}:${hp}`;

        data.task = string;
        console.log(data.task);
        db.updateUserObj(data)
    });
}