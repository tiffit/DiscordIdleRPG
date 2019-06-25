const db = require("./../database");

exports.run = async function (discord, bot, args, member, channel) {
    await db.getUserObj(member.id, member.guild.id, (data) => {
        if(data == null){
            channel.send("You have not begun your adventure! Type `$start` to begin!");
            return;
        }
        channel.send(JSON.stringify(data.inventory));
        if (args.length == 0) {
            
        }
    });

}