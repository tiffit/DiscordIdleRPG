const db = require("./../database");
const itemloader = require('./../items');
const crafting = require("./../crafting");

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send(util.noAccountMessage());
            return;
        }
        const embed = new discord.RichEmbed()
            .setTimestamp()
            .setColor([24, 224, 200])
            .setAuthor("Crafting Recipes", bot.user.displayAvatarURL)
            .setDescription(``)
            .setFooter(member.displayName, member.user.avatarURL);
        for(var i = 0; i < crafting.recipes.length; i++){
            var value = "";
            var recipe = crafting.recipes[i];
            var ingKeys = Object.keys(recipe.ingredients);
            for(var k = 0; k < ingKeys.length; k++){
                var ing = itemloader.fromInternal(ingKeys[k]);
                value += `${ing.name} x${recipe.ingredients[ingKeys[k]]}\n`;
            }
            embed.addField(itemloader.fromInternal(recipe.item).name + (crafting.unlocked(recipe, data) ? "" : "🔒"), value, true);
        }
        channel.send(embed);
    });
}