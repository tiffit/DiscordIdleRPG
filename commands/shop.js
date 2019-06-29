const itemloader = require('./../items');
const shopobj = require('./../config/shop.json')
const main = require("./../main");
var db = require('./../database');
var util = require('./../util');

const cat_per_page = 2;

/**
 * @desc displays shop
 */
exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        if(args.length > 0){
            if(args[0].toLowerCase() === "buy"){
                var usage = `Usage: ${main.properties.prefix}shop buy <amount> <item name>`;
                if(args.length < 3){
                    channel.send(usage);
                    return;
                }
                if(!/^\d+$/.test(args[1])){
                    channel.send(usage);
                    return;
                }
                var amount = parseInt(args[1]);
                var name = args.slice(2).join(" ");
                var item = itemloader.fromName(name);

                var shop_items = new Array();
                for(var i = 0; i < Object.values(shopobj).length; i++){
                    var shop_cat = Object.values(shopobj)[i];
                    shop_items = shop_items.concat(Object.entries(shop_cat));
                }
                var shop_map = new Map(shop_items);
                if(!item || !shop_map.has(item.internal)){
                    channel.send(name + " is not a valid shop item!");
                    return;
                }
                var individual_cost = shop_map.get(item.internal);
                var total_cost = individual_cost*amount; 
                var new_bal = data.gold - total_cost;
                if(new_bal < 0){
                    var embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`You do not have enough gold!`)
                        .setAuthor("Shop", bot.user.displayAvatarURL)
                        .setTitle("Purchase Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15])
                        .addField("Current Balance", data.gold+ "G", true)
                        .addField("Cost", total_cost+ "G", true);
                        channel.send(embed);
                    return;
                }
                var storage = util.getTotalCount(data.inventory);
                var totalStorage = util.getInventoryStorage(data);
                if(storage + amount > totalStorage){
                    var embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`You do not have enough space!`)
                        .setAuthor("Shop", bot.user.displayAvatarURL)
                        .setTitle("Purchase Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15])
                        .addField("Current Space", totalStorage - storage, true)
                        .addField("Required Space", amount, true);
                        channel.send(embed);
                    return;
                }
                var embed = new discord.RichEmbed()
                    .setTimestamp()
                    .setDescription(`✅ to confirm and ❌ to cancel. This will expire in 1 minute.`)
                    .setAuthor("Shop", bot.user.displayAvatarURL)
                    .setTitle("Purchase Confirmation")
                    .setFooter(member.displayName, member.user.avatarURL)
                    .addField("Item", item.name, true)
                    .addField("Count", amount, true)
                    .addField("Individual Cost", individual_cost + "G", true)
                    .addField("Total Cost", total_cost+ "G", true)
                    .addField("Current Balance", data.gold+ "G", true)
                    .addField("New Balance", new_bal+ "G", true);
                    channel.send(embed).then(async (msg) => {
                        await msg.react('✅');
                        await msg.react('❌');
                        const filter = (reaction, user) => reaction.emoji.name === '✅' || '❌' && user.id === member.user.id;
                        const collector = msg.createReactionCollector(filter, { time: 60000 });
                        collector.on('collect', (r) => {
                            msg.clearReactions();
                            if(r.emoji.name === '✅'){
                                embed = embed.setTimestamp()
                                    .setDescription(`Confirmed! ✅`)
                                    .setColor([15, 168, 15]);
                                msg.edit(embed);
                                util.addItem(data.inventory, item, amount);
                                data.gold -= total_cost;
                                db.updateUserObj(data);
                            }
                            if(r.emoji.name === '❌'){
                                embed = embed.setTimestamp()
                                    .setDescription(`Canceled! ❌`)
                                    .setColor([168, 15, 15]);
                                msg.edit(embed);
                            }
                            collector.stop();
                        });
                });
                return;
            }else if(args[0].toLowerCase() === "sell"){
                var usage = `Usage: ${main.properties.prefix}shop sell <amount> <item name>`;
                if(args.length < 3){
                    channel.send(usage);
                    return;
                }
                if(!/^\d+$/.test(args[1])){
                    channel.send(usage);
                    return;
                }
                var amount = parseInt(args[1]);
                var name = args.slice(2).join(" ");
                var item = itemloader.fromName(name);
                if(!item || !data.inventory[item.internal]){
                    channel.send(name + " is not a valid item in your inventory!");
                    return;
                }
                var holding = data.inventory[item.internal];
                var new_holing = holding - amount;
                var total_profit = amount*item.value;
                if(new_holing < 0){
                    var embed = new discord.RichEmbed()
                        .setTimestamp()
                        .setDescription(`You do not have enough ${item.name}!`)
                        .setAuthor("Shop", bot.user.displayAvatarURL)
                        .setTitle("Sell Error")
                        .setFooter(member.displayName, member.user.avatarURL)
                        .setColor([168, 15, 15])
                        .addField("Current Count", holding, true)
                        .addField("Amount Selling", amount, true);
                        channel.send(embed);
                    return;
                }
                var embed = new discord.RichEmbed()
                    .setTimestamp()
                    .setDescription(`✅ to confirm and ❌ to cancel. This will expire in 1 minute.`)
                    .setAuthor("Shop", bot.user.displayAvatarURL)
                    .setTitle("Sell Confirmation")
                    .setFooter(member.displayName, member.user.avatarURL)
                    .addField("Item", item.name, true)
                    .addField("Count", amount, true)
                    .addField("Individual Profit", item.value + "G", true)
                    .addField("Total Profit", total_profit+ "G", true)
                    .addField("Current #", holding, true)
                    .addField("New #", new_holing, true);
                    channel.send(embed).then(async (msg) => {
                        await msg.react('✅');
                        await msg.react('❌');
                        const filter = (reaction, user) => reaction.emoji.name === '✅' || '❌' && user.id === member.user.id;
                        const collector = msg.createReactionCollector(filter, { time: 60000 });
                        collector.on('collect', (r) => {
                            msg.clearReactions();
                            if(r.emoji.name === '✅'){
                                embed = embed.setTimestamp()
                                    .setDescription(`Confirmed! ✅`)
                                    .setColor([15, 168, 15]);
                                msg.edit(embed);
                                util.removeItem(data.inventory, item, amount);
                                data.gold += total_profit;
                                db.updateUserObj(data);
                            }
                            if(r.emoji.name === '❌'){
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
        var shopEmbed = createEmbed(discord, bot, member, 0, data);
        channel.send(shopEmbed).then(async (msg) => {
            await msg.react('⬅');
            await msg.react('➡');
            const filter = (reaction, user) => reaction.emoji.name === '⬅' || '➡' && user.id === member.user.id;
            const collector = msg.createReactionCollector(filter, { time: 15000 });
            collector.on('collect', (r) => {
                r.users.array().forEach(function(user){
                    if(!user.bot)r.remove(user);
                });
                var footer = msg.embeds[0].footer;
                var page = parseInt(footer.text.substring(5).split("/")[0]) - 1;
                if(r.emoji.name === '⬅')page--;
                if(r.emoji.name === '➡')page++;
                msg.edit(createEmbed(discord, bot, member, page, data));
            });
        });
    });
}

function createEmbed(discord, bot, member, page, data){
    const startIndex = page*cat_per_page;
    if(startIndex < 0)return createEmbed(discord, bot, member, 0);
    var categories = Object.keys(shopobj);
    var cat_count = categories.length;
    var max_page = Math.ceil(cat_count/cat_per_page) - 1;
    if(startIndex >= cat_count)return createEmbed(discord, bot, member, max_page);
    var embed = new discord.RichEmbed()
        .setTimestamp()
        .setColor([244, 194, 66])
        .setDescription(`Use ⬅ and ➡ to go between pages. \`${main.properties.prefix}shop buy <amount> <item name>\` to buy an item. You currently have ${data.gold}G.`)
        .setAuthor("Shop", bot.user.displayAvatarURL)
        .setFooter(`Page ${page + 1}/${max_page+1}`, member.user.avatarURL);
    for(var i = startIndex; i < Math.min(cat_count, startIndex + cat_per_page); i++){
        var cat_obj = shopobj[categories[i]];
        var cat_keys = Object.keys(cat_obj);
        var item_index = 0;
        for(var j = 0; j < 3; j++){
            var outputstr = "";
            for(var k = 0; k < 5; k++){
                if(item_index >= cat_keys.length)continue;
                var item = itemloader.fromInternal(cat_keys[item_index]);
                outputstr += `${item.name}: ${cat_obj[cat_keys[item_index]]}G\n`;
                item_index++;
            }
            var fieldName = j == 0 ? categories[i] : '\u200B';
            if(outputstr === "")outputstr = '\u200B';
            embed.addField(fieldName, outputstr, true);
        }
    }
    return embed;
}