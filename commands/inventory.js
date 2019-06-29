const db = require("./../database");
const itemloader = require('./../items');
const craftingloader = require('./../crafting');
const main = require("./../main");
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }
        var equips = data.inventory.equipped;
        if (args.length > 0) {
            if (args[0].toLowerCase() === 'use') {
                var usage = `inventory use <item name>`;
                if (args.length < 2) {
                    util.syntaxError(discord, bot, member, channel, usage);
                    return;
                }
                var name = args.slice(1).join(" ");
                var item = itemloader.fromName(name);
                if (!item || !data.inventory[item.internal]) {
                    util.syntaxError(discord, bot, member, channel, usage, name + " is not a valid item in your inventory.");
                    return;
                }
                let embed = new discord.RichEmbed()
                    .setTimestamp()
                    .setColor([15, 168, 15])
                    .setAuthor("Inventory", bot.user.displayAvatarURL)
                    .setTitle("Item Used")
                    .setFooter(member.displayName, member.user.avatarURL);
                if (item.type === "Axe" || item.type === "Pickaxe" || item.type === "Fishing Pole" || item.type === "Armor" || item.type === "Sword") {
                    var type = item.type.replace(" ", "_");
                    var old = itemloader.fromInternal(equips[type]);
                    equips[type] = item.internal;
                    util.removeItem(data.inventory, item, 1);
                    if (old) {
                        util.addItem(data.inventory, old, 1);
                    }
                    embed = embed.addField("Old " + item.type, old ? old.name : "None", true)
                        .addField("New " + item.type, item.name, true);
                    channel.send(embed);
                    db.updateUserObj(data);
                } else if (item.type === "Upgrade") {
                    if (!data.perks[item.use.type] || data.perks[item.use.type] < item.use.type) {
                        data.perks[item.use.type] = item.use.tier;
                        util.removeItem(data.inventory, item, 1);
                        embed = embed.addField("Upgrade", item.name);
                        channel.send(embed);
                    } else {
                        let embed = new discord.RichEmbed()
                            .setTimestamp()
                            .setDescription(`You already have an upgrade as good as or better than this!`)
                            .setAuthor("Inventory", bot.user.displayAvatarURL)
                            .setTitle("Use Error")
                            .setFooter(member.displayName, member.user.avatarURL)
                            .setColor([168, 15, 15]);
                        channel.send(embed);
                        return;
                    }
                    db.updateUserObj(data);
                } else if (item.type === "Blueprint") {
                    if (!craftingloader.unlocked(craftingloader.fromInternal(item.unlock), data)) {
                        if (!data.perks.blueprints) data.perks.blueprints = [];
                        data.perks.blueprints.push(item.unlock);
                        util.removeItem(data.inventory, item, 1);
                        embed = embed.addField("Blueprint", itemloader.fromInternal(item.unlock).name);
                        channel.send(embed);
                    } else {
                        let embed = new discord.RichEmbed()
                            .setTimestamp()
                            .setDescription(`You already have this recipe unlocked!`)
                            .setAuthor("Inventory", bot.user.displayAvatarURL)
                            .setTitle("Use Error")
                            .setFooter(member.displayName, member.user.avatarURL)
                            .setColor([168, 15, 15]);
                        channel.send(embed);
                        return;
                    }
                    db.updateUserObj(data);
                } else {
                    let embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(item.name + " is not a usable item!")
                        .setAuthor("Inventory", bot.user.displayAvatarURL)
                        .setTitle("Use Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15]);
                    channel.send(embed);
                    return;
                }
                return;
            } else if (args[0].toLowerCase() === 'unequip') {
                var usage = `inventory unequip <item type>`;
                if (args.length < 2) {
                    util.syntaxError(discord, bot, member, channel, usage);
                    return;
                }
                if (util.getTotalCount(data.inventory) + 1 > util.getInventoryStorage(data)) {
                    let embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`You do not have inventory space!`)
                        .setAuthor("Inventory", bot.user.displayAvatarURL)
                        .setTitle("Uneqip Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15]);
                    channel.send(embed);
                    return;
                }
                var type = args.slice(1).join(" ").toLowerCase();
                var typeFix = type === "axe" ? "Axe" : type === "pickaxe" ? "Pickaxe" : type === "fishing pole" ? "Fishing Pole" : type === "sword" ? "Sword" : type === "armor" ? "Armor" : undefined;
                if (typeof typeFix != 'undefined') {
                    if (!data.inventory.equipped[typeFix]) {
                        let embed = new discord.RichEmbed()
                            .setTimestamp()
                            .setDescription(`You do not have any ${typeFix} equipped!`)
                            .setAuthor("Inventory", bot.user.displayAvatarURL)
                            .setTitle("Uneqip Error")
                            .setFooter(member.displayName, member.user.avatarURL)
                            .setColor([168, 15, 15]);
                        channel.send(embed);
                        return;
                    }
                    var item = itemloader.fromInternal(data.inventory.equipped[typeFix]);
                    let embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setColor([15, 168, 15])
                        .setAuthor("Inventory", bot.user.displayAvatarURL)
                        .setTitle("Item Unequipped")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .addField("Type", typeFix, true)
                        .addField("Item", item.name, true);
                    channel.send(embed);
                    util.addItem(data.inventory, item, 1);
                    delete data.inventory.equipped[typeFix];
                    db.updateUserObj(data);
                    return;
                } else {
                    let embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`${type} is not a valid equipment type!`)
                        .setAuthor("Inventory", bot.user.displayAvatarURL)
                        .setTitle("Uneqip Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15]);
                    channel.send(embed);
                }
                return;
            }
        }
        var equipment = "";
        equipment += "**Axe:** " + (equips.Axe ? itemloader.fromInternal(equips.Axe).name : "") + "\n";
        equipment += "**Pickaxe:** " + (equips.Pickaxe ? itemloader.fromInternal(equips.Pickaxe).name : "") + "\n";
        equipment += "**Fishing Pole:** " + (equips.Fishing_Pole ? itemloader.fromInternal(equips.Fishing_Pole).name : "") + "\n";
        equipment += "**Sword:** " + (equips.Sword ? itemloader.fromInternal(equips.Sword).name : "") + "\n";
        equipment += "**Armor:** " + (equips.Armor ? itemloader.fromInternal(equips.Armor).name : "");
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Inventory", bot.user.displayAvatarURL)
            .setDescription(`Equip or use and item with \`${main.properties.prefix}inventory use <item name>\`. Unequip with \`${main.properties.prefix}inventory uneqip <item type>\`.\nStorage: ${util.getTotalCount(data.inventory)}/${util.getInventoryStorage(data)}`)
            .setFooter(member.displayName, member.user.avatarURL)
            .addField("Equipment", equipment);
        var invStr = "";
        for (let [internal, count] of Object.entries(data.inventory)) {
            if (internal === "equipped") continue;
            var item = itemloader.fromInternal(internal);
            invStr += `${item.name} x${count} [${item.value}G each | ${item.value * count}G total]\n`
        }
        if (invStr === "") invStr = "Inventory is empty!";
        embed.addField("Inventory", invStr);
        channel.send(embed);
    });
}