var db = require('../database');
var dungeons = require('./../dungeons');
var items = require('./../items');
var task = require('../task');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }
        if(args.length === 0){
            util.syntaxError(discord, bot, member, channel, "dungeon <dungeon name>");
            return;
        }
        var hp = util.getMaxHp(data);
        var name = args.join(" ");
        var dungeon = dungeons.fromName(name);
        if (!dungeon) {
            let embed = new discord.RichEmbed()
                .setTimestamp()
                .setDescription(`Dungeon \`${name}\` does not exist!`)
                .setAuthor("Task Set", bot.user.displayAvatarURL)
                .setTitle("Task Error")
                .setFooter(member.displayName, member.user.avatarURL)
                .setColor([168, 15, 15]);
            channel.send(embed);
            return;
        }
        var task = `dungeon:${dungeon.internal}:${hp}`;
        util.attemptSetTask(discord, bot, member, channel, data, task, "Sword");
    });
}