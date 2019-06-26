const database = require('./database');
var items = require('./items');
const utils = require('./util');

exports.runTasks = async () => {
    database.getAllUsers(datas => {
        datas.forEach(async (data) => {
            runTask(data);
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
    } else if (data.task === "mining") {
        const equipped = items.fromInternal(inv.equipped.Pickaxe);
        if (equipped) {
            var speed = equipped.speed;
            for (var i = 0; i < speed; i++) {
                var item_type = "";
                var rand = Math.random();
                if (rand > .20) item_type = "rock";
                else if (rand > .06) item_type = "iron";
                else if (rand > .01) item_type = "diamond";
                else item_type = "strengonine";
                utils.addItem(data.backpack, items.fromInternal(item_type), 1);
            }
        }
    }
    if (utils.getTotalCount(data.backpack) >= utils.getBackpackStorage(data)) {
        data.task = "idle";
    }
    database.updateUserObj(data);
}