const items = require('./../items');

exports.run = function(discord, bot, args, author, channel){
    if(args.length == 0){
        channel.send("Usage: iteminfo <item name>");
    }
    const item_name = args.join(" ").toLowerCase();
    items.list.forEach((item) => {
        if(item.name.toLowerCase() === item_name){
            const embed = new discord.RichEmbed();
            embed.setTimestamp();
            embed.setColor([24, 224, 200]);
            embed.setAuthor("Item Info", bot.displayAvatarURL);
            embed.setFooter("", bot.displayAvatarURL);
            embed.setDescription(`${item.name} (${item.internal})`);
            embed.addField("Type", item.type, true);
            if(typeof item.speed !== 'undefined')embed.addField("Speed", item.speed, true);
            embed.addField("Sell Value", item.value + " Gold", true);
            channel.send(embed);
            return;
        }
    });
}