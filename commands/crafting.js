const db = require("./../database");
const itemloader = require('./../items');
const crafting = require("./../crafting");
const util = require("./../util");
const main = require("./../main");

const cat_per_page = 6;

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }
        if (args.length > 0) {
            if (args[0].toLowerCase() === "craft") {
                var usage = `crafting craft <amount> <item name>`;
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
                if (!item || !crafting.fromInternal(item.internal)) {
                    util.syntaxError(discord, bot, member, channel, usage, name + " is not a valid item in your backpack.");
                    return;
                }
                var recipe = crafting.fromInternal(item.internal);
                if (!crafting.unlocked(recipe, data)) {
                    let embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`You do not have this recipe unlocked!`)
                        .setAuthor("Crafting", bot.user.displayAvatarURL)
                        .setTitle("Crafting Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15]);
                    channel.send(embed);
                    return;
                }
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
        
        channel.send(createEmbed(discord, bot, member, 0, data)).then(async (msg) => {
            await msg.react('⬅');
            await msg.react('➡');
            const filter = (reaction, user) => reaction.emoji.name === '⬅' || '➡' && user.id === member.user.id;
            const collector = msg.createReactionCollector(filter, { time: 15000*100 });
            collector.on('collect', (r) => {
                r.users.array().forEach(function (user) {
                    if (!user.bot) r.remove(user);
                });
                var footer = msg.embeds[0].footer;
                var page = parseInt(footer.text.substring(5).split("/")[0]) - 1;
                if (r.emoji.name === '⬅') page--;
                if (r.emoji.name === '➡') page++;
                msg.edit(createEmbed(discord, bot, member, page, data));
            });
        });;
    });
}

function createEmbed(discord, bot, member, page, data) {
    const startIndex = page * cat_per_page;
    if (startIndex < 0) return createEmbed(discord, bot, member, 0);
    var cat_count = crafting.recipes.length;
    var max_page = Math.ceil(cat_count / cat_per_page) - 1;
    if (startIndex >= cat_count) return createEmbed(discord, bot, member, max_page);

    const embed = new discord.RichEmbed()
        .setTimestamp()
        .setColor([24, 224, 200])
        .setAuthor("Crafting", bot.user.displayAvatarURL)
        .setTitle("Recipe List")
        .setDescription(`Use ⬅ and ➡ to go between pages. \`${main.properties.prefix}crafting craft <amount> <item name>\` to craft items.`)
        .setFooter(`Page ${page + 1}/${max_page + 1}`, member.user.avatarURL);
    for (var i = startIndex; i < Math.min(cat_count, startIndex + cat_per_page); i++) {
        var value = "";
        var recipe = crafting.recipes[i];
        var ingKeys = Object.keys(recipe.ingredients);
        for (var k = 0; k < ingKeys.length; k++) {
            var ing = itemloader.fromInternal(ingKeys[k]);
            value += `${ing.name} x${recipe.ingredients[ingKeys[k]]}\n`;
        }
        embed.addField(itemloader.fromInternal(recipe.item).name + (crafting.unlocked(recipe, data) ? "" : "🔒"), value, true);
    }
    return embed;
}