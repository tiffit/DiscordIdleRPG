const db = require("./../database");
const itemloader = require('./../items');
const crafting = require("./../crafting");
const util = require("./../util");
const main = require("./../main");

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }
        if (args.length > 0) {
            if (args[0].toLowerCase() === "craft") {
                var usage = `Usage: ${main.properties.prefix}crafting craft <amount> <item name>`;
                if (args.length < 3) {
                    channel.send(usage);
                    return;
                }
                if (!/^\d+$/.test(args[1])) {
                    channel.send(usage);
                    return;
                }
                var amount = parseInt(args[1]);
                var name = args.slice(2).join(" ");
                var item = itemloader.fromName(name);
                if (!item || !crafting.fromInternal(item.internal)) {
                    channel.send(name + " is not a valid craftable item!");
                    return;
                }
                var recipe = crafting.fromInternal(item.internal);
                var ingKeys = Object.keys(recipe.ingredients);
                for (var k = 0; k < ingKeys.length; k++) {
                    var ingamount = recipe.ingredients[ingKeys[k]] * amount;
                    if (!data.inventory[ingKeys[k]] || data.inventory[ingKeys[k]] < ingamount) {
                        let embed = new discord.RichEmbed()
                            .setTimestamp()
                            .setDescription(`You do not have the required ingredients!`)
                            .setAuthor("Crafting", bot.user.displayAvatarURL)
                            .setTitle("Crafting Error")
                            .setFooter(member.displayName, member.user.avatarURL)
                            .setColor([168, 15, 15]);
                        channel.send(embed);
                        return;
                    }
                }
                let embed = new discord.RichEmbed()
                    .setTimestamp()
                    .setDescription(`✅ to confirm and ❌ to cancel. This will expire in 1 minute.`)
                    .setAuthor("Crafting", bot.user.displayAvatarURL)
                    .setTitle("Crafting Confirmation")
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
                            for (var k = 0; k < ingKeys.length; k++) {
                                var ingamount = recipe.ingredients[ingKeys[k]] * amount;
                                util.removeItem(data.inventory, itemloader.fromInternal(ingKeys[k]), ingamount);
                            }
                            util.addItem(data.inventory, item, amount);
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
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Crafting", bot.user.displayAvatarURL)
            .setTitle("Recipe List")
            .setDescription(``)
            .setFooter(member.displayName, member.user.avatarURL);
        for (var i = 0; i < crafting.recipes.length; i++) {
            var value = "";
            var recipe = crafting.recipes[i];
            var ingKeys = Object.keys(recipe.ingredients);
            for (var k = 0; k < ingKeys.length; k++) {
                var ing = itemloader.fromInternal(ingKeys[k]);
                value += `${ing.name} x${recipe.ingredients[ingKeys[k]]}\n`;
            }
            embed.addField(itemloader.fromInternal(recipe.item).name + (crafting.unlocked(recipe, data) ? "" : "🔒"), value, true);
        }
        channel.send(embed);
    });
}