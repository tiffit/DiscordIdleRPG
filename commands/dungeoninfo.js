const db = require('../database');
const util = require('../util');
const dungeons = require('../dungeons');
const main = require('../main');
const items = require('../items');
const dungeonlist = require('../config/dungeons.json');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        if(args.length > 0){
            var name = args.join(" ");
            var dungeon = dungeons.fromName(name);
            if(!dungeon){
                util.syntaxError(discord, bot, member, channel, "dungeoninfo <dungeon name>", name + " is not a valid dungeon.");
                return;
            }
            let embed = new discord.RichEmbed()
                .setTimestamp()
                .setColor([224, 156, 31])
                .setAuthor("Dungeon Info", bot.user.displayAvatarURL)
                .setTitle(dungeon.name)
                .setFooter(member.displayName, member.user.avatarURL)
                .setDescription(dungeon.desc)
                .addField("Tier", dungeon.tier, true)
                .addField("Damage Range", `[${dungeon.hp.min}, ${dungeon.hp.max}]`, true);
                var dropStr = "";
                var keyList = Object.keys(dungeon.loot);
                for(var i = 0; i < keyList.length; i++){
                    var item = items.fromInternal(keyList[i]);
                    dropStr += `${item.name}: ${dungeon.loot[item.internal]*100}%\n`
                }
                embed = embed.addField("Loot", dropStr, true);
            channel.send(embed);
            return;
        }
        var list = "";
        for(var i = 0; i < dungeonlist.length; i++){
            var dungeon = dungeonlist[i];
            list += dungeon.name + "\n";
        }
        const embed = new discord.RichEmbed()
                .setTimestamp()
                .setColor([224, 156, 31])
                .setAuthor("Dungeon Info", bot.user.displayAvatarURL)
                .setDescription("`"+main.properties.prefix + "dungeoninfo <dungeon name>` to get dungeon information.")
                .addField("Dungeon List", list)
                .setFooter(member.displayName, member.user.avatarURL);
        channel.send(embed);
    });
    
}