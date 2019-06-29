var db = require('../database');
var main = require('../main');

exports.run = async function (discord, bot, args, member, channel) {
    var defaultInventory = {
        equipped: {
            Axe: "axe_0"
        }
    }
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if (data == null) {
            var userObj = {
                user: member.id,
                guild: member.guild.id,
                inventory: defaultInventory
            };
            db.insertUserObj(userObj);
            var embed = new discord.RichEmbed()
                .setTimestamp()
                .setDescription(`You have started your adventure! \`${main.properties.prefix}tutorial\` to learn what to do.`)
                .setAuthor("Idle RPG", bot.user.displayAvatarURL)
                .setTitle("Adventure Start")
                .setFooter(member.displayName, member.user.avatarURL)
                .setColor([15, 168, 15]);
            channel.send(embed);
            console.log(`New user put in using values ${member.id} and ${member.guild.id}`);
        } else {
            var embed = new discord.RichEmbed()
                .setTimestamp()
                .setDescription(`✅ to reset and ❌ to cancel. This will expire in 1 minute.`)
                .setAuthor("Idle RPG", bot.user.displayAvatarURL)
                .setTitle("Reset Confirmation")
                .setFooter(member.displayName, member.user.avatarURL)
                .setDescription("Are you sure you want to reset your data? This is permanent and can not be reversed.");
            channel.send(embed).then(async (msg) => {
                await msg.react('✅');
                await msg.react('❌');
                const filter = (reaction, user) => reaction.emoji.name === '✅' || '❌' && user.id === member.user.id;
                const collector = msg.createReactionCollector(filter, { time: 60000 });
                collector.on('collect', (r) => {
                    msg.clearReactions();
                    if (r.emoji.name === '✅') {
                        embed = embed.setTimestamp()
                            .setDescription(`Reset! ✅`)
                            .setColor([15, 168, 15]);
                        msg.edit(embed);
                        data.inventory = defaultInventory;
                        data.backpack = {};
                        data.task = "idle";
                        data.gold = 0;
                        data.perks = {};
                        db.updateUserObj(data);
                    }
                    if (r.emoji.name === '❌') {
                        embed = embed.setTimestamp()
                            .setDescription(`Canceled! ❌`)
                            .setColor([168, 15, 15]);
                        msg.edit(embed);
                    }
                    collector.stop();

                })
            })
        }
    })
}