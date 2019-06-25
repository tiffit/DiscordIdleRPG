const itemloader = require('./../items');
const shopobj = require('./../config/shop.json')
const main = require("./../main");

const cat_per_page = 2;

/**
 * @desc displays shop
 */
exports.run = async function (discord, bot, args, member, channel) {
    var shopEmbed = createEmbed(discord, bot, member, 0);

    channel.send(shopEmbed).then(async (msg) => {
        await msg.react('⬅');
        await msg.react('➡');
        const filter = (reaction, user) => reaction.emoji.name === '⬅' || '➡' && user.id === member.user.id;
        const collector = msg.createReactionCollector(filter);
        collector.on('collect', (r) => {
            r.users.array().forEach(function(user){
                if(!user.bot)r.remove(user);
            });
            var footer = msg.embeds[0].footer;
            var page = parseInt(footer.text.substring(5).split("/")[0]) - 1;
            if(r.emoji.name === '⬅')page--;
            if(r.emoji.name === '➡')page++;
            msg.edit(createEmbed(discord, bot, member, page));
        });

    });
}

function createEmbed(discord, bot, member, page){
    const startIndex = page*cat_per_page;
    if(startIndex < 0)return createEmbed(discord, bot, member, 0);
    var categories = Object.keys(shopobj);
    var cat_count = categories.length;
    var max_page = Math.floor(cat_count/cat_per_page) - 1;
    if(startIndex >= cat_count)return createEmbed(discord, bot, member, max_page);
    var embed = new discord.RichEmbed()
        .setTimestamp()
        .setColor([244, 194, 66])
        .setDescription(`Use ⬅ and ➡ to go between pages. \`${main.properties.prefix}shop buy <item name>\` to buy an item.`)
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
                outputstr += `${item.name} T${item.tier}: ${cat_obj[cat_keys[item_index]]}G\n`;
                item_index++;
            }
            var fieldName = j == 0 ? categories[i] : '\u200B';
            if(outputstr === "")outputstr = '\u200B';
            embed.addField(fieldName, outputstr, true);
        }
    }
    return embed;
}