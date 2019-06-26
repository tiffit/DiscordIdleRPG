const db = require("./../database");
const itemloader = require('./../items');
const main = require("./../main");
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        var equips = data.inventory.equipped;
        if(args.length > 0){
            if(args[0].toLowerCase() === 'use'){
                var usage = `Usage: ${main.properties.prefix}inventory use <item name>`;
                if(args.length < 2){
                    channel.send(usage);
                    return;
                }
                var name = args.slice(1).join(" ");
                var item = itemloader.fromName(name);
                if(!item || !data.inventory[item.internal]){
                    channel.send(name + " is not a valid item in your inventory!");
                    return;
                }
                if(item.type === "Axe" || "Pickaxe"){
                    var old = itemloader.fromInternal(equips[item.type]);
                    equips[item.type] = item.internal;
                    util.removeItem(data.inventory, item, 1);
                    if(old){
                        util.addItem(data.inventory, old, 1);
                    }
                    channel.send("Equipped!");
                    db.updateUserObj(data);
                }else{
                    channel.send(name + " is not a usable item!");
                    return;
                }
                return;
            }
        }
        var equipment = "";
        equipment += "**Axe:** " + (equips.Axe ? itemloader.fromInternal(equips.Axe).name : "") + "\n";
        equipment += "**Pickaxe:** " + (equips.Pickaxe ? itemloader.fromInternal(equips.Pickaxe).name : "") + "\n";
        equipment += "**Fishing Rod:** " + (equips.Fishing_Rod ? itemloader.fromInternal(equips.Fishing_Rod).name : "") + "\n";
        equipment += "**Sword:** " + (equips.Sword ? itemloader.fromInternal(equips.Sword).name : "") + "\n";
        equipment += "**Armor:** " + (equips.Armor ? itemloader.fromInternal(equips.Armor).name : "");
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Inventory", bot.user.displayAvatarURL)
            .setDescription(`Equip or use and item with \`${main.properties.prefix}inventory use <item name>\`.`)
            .setFooter(member.displayName, member.user.avatarURL)
            .addField("Equipment", equipment);
        var invStr = "";
        for (let [internal, count] of Object.entries(data.inventory)) {
            if(internal === "equipped")continue;
            var item = itemloader.fromInternal(internal);
            invStr += `${item.name} x${count} [${item.value}G each | ${item.value * count}G total]\n`
        }
        if(invStr === "")invStr = "Inventory is empty!";
        embed.addField("Inventory", invStr);
        channel.send(embed);
    });
}