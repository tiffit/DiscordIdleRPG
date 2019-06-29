const db = require('../database');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        var taskDisplay = data.task.split(":")[0].toLowerCase();
        taskDisplay = taskDisplay.charAt(0).toUpperCase() + taskDisplay.substring(1);
        const embed = new discord.RichEmbed()
                .setTimestamp()
                .setColor([224, 156, 31])
                .setAuthor("Player Info", bot.user.displayAvatarURL)
                .setFooter(member.displayName, member.user.avatarURL)
                .addField("Gold", data.gold, true)
                .addField("Current Task", taskDisplay, true)
                .addBlankField(true)
                .addField("Inventory", util.getTotalCount(data.inventory) + "/" + util.getInventoryStorage(data), true)
                .addField("Backpack", util.getTotalCount(data.backpack) + "/" + util.getBackpackStorage(data), true)
                .addBlankField(true);
        channel.send(embed);
    });
    
}