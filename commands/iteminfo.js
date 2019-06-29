const items = require('./../items');
const util = require('./../util');

exports.run = async function (discord, bot, args, member, channel) {
    if (args.length == 0) {
        util.syntaxError(discord, bot, member, channel, "iteminfo <item name>");
        return;
    }
    const item_name = args.join(" ");
    const item = items.fromName(item_name);
    if (item) {
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Item Info", bot.user.displayAvatarURL)
            .setTitle(item.name)
            .setFooter(member.displayName, member.user.avatarURL)
            .setDescription(item.description)
            .addField("Type", item.type, true);
        if (typeof item.tier !== 'undefined') embed.addField("Tier", item.tier, true);
        if (typeof item.speed !== 'undefined') embed.addField("Speed", item.speed, true);
        if (typeof item.heal !== 'undefined') embed.addField("Heal", item.heal, true);
        if (typeof item.hp !== 'undefined') embed.addField("HP", item.hp, true);
        if (typeof item.mult !== 'undefined') embed.addField("Loot Multiplier", item.mult, true);
        embed.addField("Sell Value", item.value + " Gold", true);
        channel.send(embed);
    } else {
        let embed = new discord.RichEmbed()
            .setTimestamp()
            .setDescription(`Unknown item "${item_name}"!`)
            .setAuthor("Item Info", bot.user.displayAvatarURL)
            .setTitle("Info Error")
            .setFooter(member.displayName, member.user.avatarURL)
            .setColor([168, 15, 15]);
        channel.send(embed);
    }
}