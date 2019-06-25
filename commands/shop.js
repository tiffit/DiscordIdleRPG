const itemloader = require('./../items');
const items = require('./../config/shop.json')

/**
 * @desc displays shop
 */
exports.run = async function (discord, bot, args, author, channel) {
    var pageAmount = Math.ceil(items.length / 8);

    var shopEmbed = new discord.RichEmbed()
        .setTimestamp()
        .setColor([24, 224, 200])
        .setAuthor("Shop", bot.displayAvatarURL)
        .setFooter(`%last for previous, %next for next. Page 1/${pageAmount}`, bot.displayAvatarURL);

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
        const filter = m => m.content.startsWith('$');

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
                if (message === "$close") {
                    test = false;
                } else if (message === "$next") {
                    var nextEmbed = new discord.RichEmbed()
                        .setTimestamp()
                        .setColor([24, 224, 200])
                        .setAuthor("Shop", bot.displayAvatarURL)
                        .setFooter(`<- $last | $next -> | Page ${page}/${pageAmount}`, bot.displayAvatarURL);

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
                } else if (message === "$last") {
                    var lastEmbed = new discord.RichEmbed()
                        .setTimestamp()
                        .setColor([24, 224, 200])
                        .setAuthor("Shop", bot.displayAvatarURL)
                        .setFooter(`<- $last | $next -> | Page ${page}/${pageAmount}`, bot.displayAvatarURL);


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