const database = require('./database');
var items = require('./items');
const utils = require('./util');

exports.runTasks = async () => {
    database.getAllUsers(datas => {
        datas.forEach(async (data) => {
            if (data.task === "idle") {
                return;
            }
            var inv = data.inventory;
            if (data.task === "woodcutting") {
                const equipped = items.fromInternal(inv.equipped.Axe);
                if (equipped) {
                    var speed = equipped.speed;
                    utils.addItem(data.backpack, items.fromInternal("wood"), speed);
                    database.updateUserObj(data);
                }
            }
        })
    })
}

function runTask(data) {
    if (data.task === "idle") {
        return;
    }
    var inv = data.inventory;
    if (data.task === "woodcutting") {
        const equipped = items.fromInternal(inv.equipped.Axe);
        if (equipped) {
            var speed = equipped.speed;
            utils.addItem(data.backpack, items.fromInternal("wood"), speed);
            database.updateUserObj(data);
        }
    }
}