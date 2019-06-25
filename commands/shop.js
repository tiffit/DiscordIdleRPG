const itemloader = require('./../items');
const items = require('./../config/shop.json')
const main = require("./../main");

/**
 * @desc displays shop
 */
exports.run = async function (discord, bot, args, member, channel) {
    const prefix = main.properties.prefix;
    var pageAmount = Math.ceil(items.length / 8);

    var shopEmbed = createEmbed(discord, bot, member, 1, pageAmount);

    // declarations for later
    var page;
    var ind;

    // lists the first 9 items and adds them to the embed dynamically.
    for (var i = 0; i < Math.min(items.length, 9); i++) {
        shopEmbed.addField(itemloader.fromInternal(items[i].item).name, `${items[i].cost} Gold`, true);

        if (i === 8 || i === items.length) {
            page = 2;
            ind = i;
            break;
        }
    }

    channel.send(shopEmbed).then(async (msg) => {
        const filter = m => m.content.startsWith(prefix) && m.member.user.id === member.user.id;

        // variable is set to true whenever the user types in %close
        var isClosed = false;
        while (!isClosed) {
            await msg.channel.awaitMessages(filter, {
                max: 1,
                time: 3000000,
                errors: ['time']
            }).then(async (collected) => {
                var message = collected.find(message => message).content
                // user close event
                if (message === `${prefix}close`) {
                    test = false;
                } else if (message === `${prefix}next`) {
                    var nextEmbed = createEmbed(discord, bot, member, page, pageAmount);

                    for (var i = ind; i < ind + 9 || items.length; i++) {
                        if (i >= items.length) {
                            break;
                        }
                        nextEmbed.addField(`${items[i].name}`, `${items[i].value}`, true);

                        if (i > ind + 9) {
                            page = page + 1;
                            ind = i;
                        }
                    };
                    msg.edit(nextEmbed)
                } else if (message === `${prefix}last`) {
                    var lastEmbed = createEmbed(discord, bot, member, page, pageAmount);


                    for (var i = ind; i < ind - 9 || items.length; i--) {
                        if (i <= 0 ) {
                            break;
                        }
                        lastEmbed.addField(`${items[i].name}`, `${items[i].value}`, true);

                        if (i > ind - 9) {
                            page = page - 1;
                            ind = i;
                        }
                    };
                    msg.edit(lastEmbed)
                }
            })
        }

    })
}

function createEmbed(discord, bot, member, page, pageAmount){
    const prefix = main.properties.prefix;
    return new discord.RichEmbed()
        .setTimestamp()
        .setColor([244, 194, 66])
        .setAuthor("Shop", bot.user.displayAvatarURL)
        .setFooter(`${prefix}last for previous, ${prefix}next for next. Page ${page}/${pageAmount}`, member.user.avatarURL);
}