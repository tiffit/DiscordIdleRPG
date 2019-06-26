const db = require("./../database");
const itemloader = require('./../items');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Backpack", bot.user.displayAvatarURL)
            .setFooter(member.displayName, member.user.avatarURL);
        var invStr = "";
        for (let [internal, count] of Object.entries(data.backpack)) {
            var item = itemloader.fromInternal(internal);
            invStr += `${item.name} x${count} [${item.value}G each | ${item.value * count}G total]`
        }
        if(invStr === "")invStr = "Backpack is empty!";
        embed.addField("Contents", invStr);
        channel.send(embed);
    });

}