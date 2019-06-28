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
            .setDescription("Storage: " + util.getTotalCount(data.backpack) + "/" + util.getBackpackStorage(data))
            .setFooter(`👍 to move all items from backpack to inventory - ${member.displayName}`, member.user.avatarURL);
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
                    if (util.getTotalCount(data.backpack) > util.getBackpackStorage(data)) {
                        return channel.send('Your inventory is too full! Try selling some of it, or buying an upgrade in $shop.');
                    } else {
                        for (var item in data.backpack) {
                            var len = data.backpack[item]
                            util.addItemFromB(data.inventory, item, len);
                            data.backpack = {};
                            db.updateUserObj(data);
                            invStr = "";
                        }
                        const newEmbed = new discord.RichEmbed()
                            .setTimestamp()
                            .setColor([24, 224, 200])
                            .setAuthor("Backpack", bot.user.displayAvatarURL)
                            .setDescription("Storage: " + util.getTotalCount(data.backpack) + "/" + util.getBackpackStorage(data))
                            .setFooter(`👍 to move all items from backpack to inventory - ${member.displayName}`, member.user.avatarURL);
                        if (invStr === "") invStr = "Backpack is empty!";
                        newEmbed.addField("Contents", invStr);
                        msg.edit(newEmbed);
                    }
                })
        });

    });

}