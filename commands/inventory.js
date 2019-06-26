const db = require("./../database");
const itemloader = require('./../items');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        var equipment = "";
        var equips = data.inventory.equipped;
        equipment += "**Axe:** " + (equips.Axe ? itemloader.fromInternal(equips.Axe).name : "") + "\n";
        equipment += "**Pickaxe:** " + (equips.Pickaxe ? itemloader.fromInternal(equips.Pickaxe) : "") + "\n";
        equipment += "**Fishing Rod:** " + (equips.Fishing_Rod ? itemloader.fromInternal(equips.Fishing_Rod) : "") + "\n";
        equipment += "**Sword:** " + (equips.Sword ? itemloader.fromInternal(equips.Sword) : "") + "\n";
        equipment += "**Armor:** " + (equips.Armor ? itemloader.fromInternal(equips.Armor) : "");
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Inventory", bot.user.displayAvatarURL)
            .setFooter(member.displayName, member.user.avatarURL)
            .addField("Equipment", equipment);
        var invStr = "";
        for (let [internal, count] of Object.entries(data.inventory)) {
            if(internal === "equipped")continue;
            var item = itemloader.fromInternal(internal);
            invStr += `${item.name} x${count} [${item.value}G each | ${item.value * count}G total]`
        }
        if(invStr === "")invStr = "Inventory is empty!";
        embed.addField("Inventory", invStr);
        channel.send(embed);
    });
}