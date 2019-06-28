const db = require("./../database");
const itemloader = require('./../items');
const util = require('../util');

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            channel.send(util.noAccountMessage());
            return;
        }

        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Backpack", bot.user.displayAvatarURL)
            .setDescription("Storage: " + util.getTotalCount(data.backpack) + "/" + util.getBackpackStorage(data) + "\nReact with 👍 to move all items from the backpack to the inventory.")
            .setFooter(`${member.displayName}`, member.user.avatarURL);
        var invStr = "";
        for (let [internal, count] of Object.entries(data.backpack)) {
            var item = itemloader.fromInternal(internal);
            invStr += `${item.name} x${count} [${item.value}G each | ${item.value * count}G total]\n`
        }
        if (invStr === "") invStr = "Backpack is empty!";
        embed.addField("Contents", invStr);
        const filter = (reaction, user) => {
            return ['👍'].includes(reaction.emoji.name) && user.id === member.id;
        };

        channel.send(embed).then(msg => {
            msg.react('👍');
            msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] })
                .then(collected => {
                    msg.clearReactions();
                    if (util.getTotalCount(data.backpack) > util.getBackpackStorage(data)) {
                        return channel.send('Your inventory is too full! Try selling some of it, or buying an upgrade in $shop.');
                    } else {
                        var keys = Object.keys(data.backpack);
                        for (var i = 0; i < keys.length; i++) {
                            var item = itemloader.fromInternal(keys[i]);
                            util.addItem(data.inventory, item, data.backpack[item.internal]);
                        }
                        data.backpack = {};
                        db.updateUserObj(data);
                        embed.setDescription("All contents moved to inventory!");
                        msg.edit(embed);
                    }
                })
        });

    });

}