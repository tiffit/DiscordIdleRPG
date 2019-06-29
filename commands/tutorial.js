const main = require("./../main");

exports.run = async function (discord, bot, args, member, channel) {
    var num = 0;
    var textArray = [
        {
            title: `General`,
            text: `This is the Idle RPG Bot built by Tiffit and Abstractless. This is based off of starting off by gaining one wood per minute, and evolving to gaining several stone, wood, and other materials. If that gets old for you, you may have your character do dungeons or go fishing.`
        },
        {
            title: `Starting Off`,
            text: `To start off with, you begin with a simple wood-felling axe equipped. \n To view your equipped item, type in \`${main.properties.prefix}inventory\`. \n This will show you your currently equipped items, and all other items inside of your inventory.\nIf you ever come across an item you want to learn more about, use \`${main.properties.prefix}iteminfo <item name>\``
        },
        {
            title: `Shopping`,
            text: `Now, you may notice those numbers next to the items in your inventory. This is for the the shop. \n To access the shop, type in \`${main.properties.prefix}shop\`. \n To sell the item you see in your inventory, type \`${main.properties.prefix}sell <amount> <item name>\`. \n This will now be added to your gold.`
        },
        {
            title: `Personal Information`,
            text: `You now have gold! Gold, in short hand, is referred to as \`G\`. \n To view your gold, and a bunch of other facts about your character, type in \`${main.properties.prefix}info\`.`
        },
        {
            title: `Tasks`,
            text: `Ouch, you don't have anything to sell? Well not to worry, tasks are here! To progress in this game, you must use tasks. \n There are 2 types of tasks. \`Dungeons\`, which drop rare loot but uncommon, and \`Tasks\`, which drop consistent items every minute, which a chance at rare items. \n The three types of \`Task\` are \`${main.properties.prefix}mining\`, \`${main.properties.prefix}fishing\`, \`${main.properties.prefix}woodcutting\`. \n To start off with, you will be woodcutting. Once you have wood, sell it in the shop and buy yourself an upgrade!`
        },
        {
            title: `Crafting`,
            text: `To craft, do \`${main.properties.prefix}inventory\`. You mat notice some recipes are locked! To unlock these, buy and use a blueprint from the shop!`
        },
        {
            title: `Inventory`,
            text: `To see your inventory, do \`${main.properties.prefix}inventory\`. You may notice that after a minute your items haven't entered your inventory. Don't worry, they're in your adventuring \`${main.properties.prefix}backpack\`! \n To move all items from your backpack (which has lower storage space), click on the emoji under the output the command gives you.`
        },
        {
            title: `Dungeons`,
            text: `Dungeons are scary things gang. Just kidding. They're not. They're just really unreliable in their loot. However, whenever you do recieve loot, it's in large quantities with high value. \n To list all dungeons, type in \`${main.properties.prefix}dungeoninfo\`. To start a dungeon, type \`${main.properties.prefix}dungeon <dungeon name>\`. \n After time, you will die. This doesn't lose you anything, you just get set to idle. To prevent dying, you can \`${main.properties.prefix}fish\`! Fish heal you for a certain amount of HP every minute, keeping you alive and dungeoning longer.`
        }
    ]
    var startEmbed = new discord.RichEmbed()
        .setTimestamp()
        .setAuthor("Tutorial", bot.user.displayAvatarURL)
        .setFooter(member.displayName, member.user.avatarURL)
        .setColor([168, 15, 15])
        .addField("Explore", "Click the arrow to go to the next page to learn more about the bot in a helpful, start to late game fashion!");

    channel.send(startEmbed).then(async (msg) => {
        await msg.react('⬅');
        await msg.react('➡');
        const filter = (reaction, user) => reaction.emoji.name === '⬅' || '➡' && user.id === member.user.id;
        const collector = msg.createReactionCollector(filter, { time: 60000 * 10 });
        collector.on('collect', r => {
            r.users.array().forEach(function (user) {
                if (!user.bot) r.remove(user);
            });
            if (r.emoji.name === '⬅') {
                num--;
            }
            if (r.emoji.name === '➡') {
                num++;
            }
            if (num >= textArray.length) num = textArray.length - 1;
            else if (num < 0) num = 0;
            var title = textArray[num].title;
            var desc = textArray[num].text;
            var embed = new discord.RichEmbed()
                .setTimestamp()
                .setAuthor("Tutorial", bot.user.displayAvatarURL)
                .setTitle("Welcome!")
                .setFooter(member.displayName, member.user.avatarURL)
                .setColor([168, 15, 15])
                .addField(title, desc, true)
                .addField("Explore", "Click the arrow to go to the next page to learn more about the bot in a helpful, start to late game fashion!");
            msg.edit(embed);
        })
    })
}