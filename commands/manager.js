const main = require("./../main");

const cmdmap = new Map(
    [
        ["ping", require('./ping')],
        ["iteminfo", require('./iteminfo')],
        ["shop", require('./shop')],
        ["start", require('./start')],
        ["info", require('./info')],
        ["inventory", require('./inventory')],
        ["backpack", require('./backpack')],
        ["woodcutting", require('./woodcutting')]
    ]
);

exports.parse = async(discord, bot, msg) => {
    if (msg.author.bot) return;
    const prefix = main.properties.prefix;
    const content = msg.content;
    if(!content.startsWith(prefix))return;
    const words = content.split(" ");
    const command_name = words[0].substring(prefix.length).toLowerCase();
    const args = words.slice(1);
    if(cmdmap.has(command_name)){
        cmdmap.get(command_name).run(discord, bot, args, msg.member, msg.channel);
    }
}