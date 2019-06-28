const main = require('./main');
const db = require('./database');

exports.addItem = function (inventory, item, count) {
    var keys = Object.keys(inventory);
    if (keys.includes(item.internal)) {
        inventory[item.internal] += count;
    } else {
        inventory[item.internal] = count;
    }
}

exports.removeItem = function (inventory, item, count) {
    var keys = Object.keys(inventory);
    if (keys.includes(item.internal)) {
        inventory[item.internal] -= count;
        if (inventory[item.internal] <= 0) delete inventory[item.internal];
    }
}

exports.getTotalCount = function (inventory) {
    var keys = Object.keys(inventory);
    var total = 0;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === 'equipped') continue;
        total += parseInt(inventory[keys[i]]);
    }
    return total;
}

exports.attemptSetTask = function (discord, bot, member, channel, data, task, itemtype) {
    var taskDisplay = task.split(":")[0].toLowerCase();
    taskDisplay = taskDisplay.charAt(0).toUpperCase() + taskDisplay.substring(1);
    var oldTask = data.task.split(":")[0].toLowerCase();
    oldTask = oldTask.charAt(0).toUpperCase() + oldTask.substring(1);
    if (itemtype != null && !data.inventory.equipped[itemtype]) {
        let embed = new discord.RichEmbed()
            .setTimestamp()
            .setDescription(`You do not have the required tool equipped!`)
            .setAuthor("Task Set", bot.user.displayAvatarURL)
            .setTitle("Task Error")
            .setFooter(member.displayName, member.user.avatarURL)
            .setColor([168, 15, 15])
            .addField("Task", taskDisplay, true)
            .addField("Required Equipment", itemtype.replace("_", " "), true);
        channel.send(embed);
        return;
    }
    let embed = new discord.RichEmbed()
        .setTimestamp()
        .setAuthor("Task Set", bot.user.displayAvatarURL)
        .setFooter(member.displayName, member.user.avatarURL)
        .setColor([15, 168, 15])
        .addField("Previous Task", oldTask, true)
        .addField("New Task", taskDisplay, true);
    channel.send(embed);
    data.task = task;
    db.updateUserObj(data);
}

exports.syntaxError = function (discord, bot, member, channel, usage, error) {
    let embed = new discord.RichEmbed()
        .setTimestamp()
        .setAuthor("Syntax Error", bot.user.displayAvatarURL)
        .setFooter(member.displayName, member.user.avatarURL)
        .setDescription("An error was found with the syntax in your command!")
        .setColor([168, 15, 15])
        .addField("Usage", main.properties.prefix + usage, false);
    if(error){
        embed = embed.addField("Error", error, false);
    }
    channel.send(embed);
}

exports.noAccountMessage = function () {
    return `You have not begun your adventure! Type \`${main.properties.prefix}start\` to begin!`;
}

exports.getInventoryStorage = function (data) {
    if (data.perks.upgrade_inventory !== 'undefined') {
        var val = data.perks.upgrade_inventory;
        if (val === 0) return 750;
        if (val === 1) return 2000;
        if (val === 2) return 5000;
        if (val === 3) return 20000;
    }
    return 350;
}

exports.getBackpackStorage = function (data) {
    if (data.perks.upgrade_backpack !== 'undefined') {
        var val = data.perks.upgrade_backpack;
        if (val === 0) return 150;
        if (val === 1) return 400;
        if (val === 2) return 1000;
        if (val === 3) return 2500;
    }
    return 100;
}