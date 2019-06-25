const items = require('./../items');

exports.run = function (discord, bot, args, member, channel) {
    if (args.length == 0) {
        channel.send("Usage: iteminfo <item name>");
    }
    const item_name = args.join(" ");
    const item = items.fromName(item_name);
    if(item){
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Item Info", bot.user.displayAvatarURL)
            .setTitle(item.name)
            .setFooter(member.displayName, member.user.avatarURL)
            .setDescription(item.description)
            .addField("Type", item.type, true);
        if (typeof item.speed !== 'undefined') embed.addField("Speed", item.speed, true);
        embed.addField("Sell Value", item.value + " Gold", true);
        channel.send(embed);
    }else{
        channel.send(`Unknown item "${item_name}"!`);
    }
}