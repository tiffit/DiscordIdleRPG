const cmdmap = new Map(
    [
        ["ping", require('./ping')]
    ]
);

exports.parse = async(discord, msg) => {
    if (msg.author.bot) return;
    const prefix = "$";
    const content = msg.content;
    if(!content.startsWith(prefix))return;
    const words = content.split(" ");
    const command_name = words[0].substring(prefix.length).toLowerCase();
    const args = words.slice(1);
    if(cmdmap.has(command_name)){
        cmdmap.get(command_name).run(discord, args, msg.author, msg.channel);
    }
}