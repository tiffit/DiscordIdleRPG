const database = require('./database');
var items = require('./items');
const utils = require('./util');
var dungeonsTask = require('./config/dungeons.json');
var dungeon = require('./dungeons');


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
            var remaining_space = utils.getBackpackStorage(data) - utils.getTotalCount(data.backpack);
            var amount = Math.min(speed, remaining_space);
            utils.addItem(data.backpack, items.fromInternal("wood"), amount);
            if (amount === remaining_space) {
                data.task = "idle";
                database.updateUserObj(data);
                return;
            }
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
                if (utils.getTotalCount(data.backpack) >= utils.getBackpackStorage(data)) {
                    data.task = "idle";
                    database.updateUserObj(data);
                    return;
                }
            }
            database.updateUserObj(data);
        }
    } else if (data.task.startsWith("dungeon")) {
        var d = data.task.split(":");
        var dInt = d[1];
        var dHp = d[2]
        var dHp = dHp - (Math.random() * ((dungeon.fromInternal(dInt).hp.max - dungeon.fromInternal(dInt).hp.min) + 1) + dungeon.fromInternal(dInt).hp.min);
        var maxHp = utils.getMaxHp(data);
        var invKeys = Object.keys(data.inventory);
        for(var i = 0; i < invKeys.length; i++){
            var key = invKeys[i];
            if(key === 'equipped')continue;
            var item = items.fromInternal(key);
            if(item.type === "Heal"){
                var item_count = data.inventory[key];
                for(var k = 0; k < item_count; k++){
                    if(item.heal + dHp <= maxHp){
                        dHp += item.heal;
                        utils.removeItem(data.inventory, item, 1);
                    }else{
                        break;
                    }
                }
            }
        }
        var newString = `dungeon:${dInt}:${dHp}`;
        if (dHp <= 0) {
            data.task = "idle";
            database.updateUserObj(data);
            return;
        }
        for (var i in dungeon.fromInternal(dInt).loot) {
            var rand = Math.random();
            var item_type = "";
            
            if (rand > dungeon.fromInternal(dInt).loot[i]*items.fromInternal(data.inventory.equipped.Sword).mult) item_type = i;
            data.task = newString;
            if (typeof item_type === 'string' && item_type !== "") {
                utils.addItem(data.backpack, items.fromInternal(item_type), 1);
            }
        }
        database.updateUserObj(data);

    } else if (data.task === "fishing") {
        const equipped = items.fromInternal(inv.equipped.pole);
        if (equipped) {
            var speed = equipped.speed;
            for (var i = 0; i < speed; i++) {
                utils.addItem(data.backpack, items.fromInternal("fish"), 1);
                if (utils.getTotalCount(data.backpack) >= utils.getBackpackStorage(data)) {
                    data.task = "idle";
                    database.updateUserObj(data);
                    return;
                }
            }
            database.updateUserObj(data);
        }
    }


    database.updateUserObj(data);
}