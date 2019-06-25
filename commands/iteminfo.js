const items = require('./../items');

exports.run = function (discord, bot, args, member, channel) {
    if (args.length == 0) {
        channel.send("Usage: iteminfo <item name>");
    }
    const item_name = args.join(" ").toLowerCase();
    var found = false;
    items.list.forEach((item) => {
        if (!found && item.name.toLowerCase() === item_name) {
            found = true;
            const embed = new discord.RichEmbed()
                .setTimestamp()
                .setColor([24, 224, 200])
                .setAuthor("Item Info", bot.displayAvatarURL)
                .setTitle(item.name)
                .setFooter("", bot.displayAvatarURL)
                .setDescription(item.description)
                .addField("Type", item.type, true);
            if (typeof item.speed !== 'undefined') embed.addField("Speed", item.speed, true);
            embed.addField("Sell Value", item.value + " Gold", true);
            channel.send(embed);
        }
    });
}