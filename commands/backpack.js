const db = require("./../database");
const itemloader = require('./../items');
const main = require("./../main");
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }
        if (args.length > 0) {
            if (args[0].toLowerCase() === "drop") {
                var usage = `backpack drop <amount> <item name>`;
                if (args.length < 3) {
                    util.syntaxError(discord, bot, member, channel, usage);
                    return;
                }
                if (!/^\d+$/.test(args[1])) {
                    util.syntaxError(discord, bot, member, channel, usage);
                    return;
                }
                var amount = parseInt(args[1]);
                var name = args.slice(2).join(" ");
                var item = itemloader.fromName(name);
                if (!item || !data.backpack[item.internal]) {
                    util.syntaxError(discord, bot, member, channel, usage, name + " is not a valid item in your backpack.");
                    return;
                }
                var holding = data.backpack[item.internal];
                var new_holing = holding - amount;
                if (new_holing < 0) {
                    let embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`You do not have enough ${item.name}!`)
                        .setAuthor("Backpack", bot.user.displayAvatarURL)
                        .setTitle("Drop Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15])
                        .addField("Current Count", holding, true)
                        .addField("Amount Dropping", amount, true);
                    channel.send(embed);
                    return;
                }
                let embed = new discord.RichEmbed()
                    .setTimestamp()
                    .setDescription(`✅ to confirm and ❌ to cancel. This will expire in 1 minute.`)
                    .setAuthor("Backpack", bot.user.displayAvatarURL)
                    .setTitle("Drop Confirmation")
                    .setFooter(member.displayName, member.user.avatarURL)
                    .addField("Item", item.name, true)
                    .addField("Count", amount, true);
                channel.send(embed).then(async (msg) => {
                    await msg.react('✅');
                    await msg.react('❌');
                    const filter = (reaction, user) => reaction.emoji.name === '✅' || '❌' && user.id === member.user.id;
                    const collector = msg.createReactionCollector(filter, { time: 60000 });
                    collector.on('collect', (r) => {
                        msg.clearReactions();
                        if (r.emoji.name === '✅') {
                            embed = embed.setTimestamp()
                                .setDescription(`Confirmed! ✅`)
                                .setColor([15, 168, 15]);
                            msg.edit(embed);
                            util.removeItem(data.backpack, item, amount);
                            db.updateUserObj(data);
                        }
                        if (r.emoji.name === '❌') {
                            embed = embed.setTimestamp()
                                .setDescription(`Canceled! ❌`)
                                .setColor([168, 15, 15]);
                            msg.edit(embed);
                        }
                        collector.stop();
                    });
                });
                return;
            }
        }
        var description = `\`${main.properties.prefix}backpack drop <amount> <item name>\` to drop items from your backpack.\n`;
        description += "React with 👍 to transfer all items from the backpack to the inventory.\n";
        description += "Storage: " + util.getTotalCount(data.backpack) + "/" + util.getBackpackStorage(data);
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Backpack", bot.user.displayAvatarURL)
            .setDescription(description)
            .setFooter(`${member.displayName}`, member.user.avatarURL);
        var invStr = "";
        for (let [internal, count] of Object.entries(data.backpack)) {
            var item = itemloader.fromInternal(internal);
            invStr += `${item.name} x${count} [${item.value}G each | ${item.value * count}G total]\n`
        }
        if (invStr === "") invStr = "Backpack is empty!";
        embed.addField("Contents", invStr);
        const filter = (reaction, user) => {
            return ['👍'].includes(reaction.emoji.name) && user.id === member.id;
        };

        channel.send(embed).then(msg => {
            msg.react('👍');
            msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] })
                .then(collected => {
                    msg.clearReactions();
                    if (util.getInventoryStorage(data) - util.getTotalCount(data.inventory) - util.getTotalCount(data.backpack) < 0) {
                        let embed = new discord.RichEmbed()
                            .setTimestamp()
                            .setDescription(`Your inventory is too full! Try selling some of it, buying an upgrade in ${main.properties.prefix}shop, or dropping items in your backpack.`)
                            .setAuthor("Backpack", bot.user.displayAvatarURL)
                            .setTitle("Transfer Error")
                            .setFooter(member.displayName, member.user.avatarURL)
                            .setColor([168, 15, 15])
                            .addField("Backpack", util.getTotalCount(data.backpack), true)
                            .addField("Amount Dropping", amount, true);
                        channel.send(embed);
                    } else {
                        var keys = Object.keys(data.backpack);
                        for (var i = 0; i < keys.length; i++) {
                            var item = itemloader.fromInternal(keys[i]);
                            util.addItem(data.inventory, item, data.backpack[item.internal]);
                        }
                        data.backpack = {};
                        db.updateUserObj(data);
                        embed.setDescription("All contents moved to inventory!");
                        msg.edit(embed);
                    }
                })
        });

    });

}