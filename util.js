const main = require('./main');

exports.addItem = function(inventory, item, count){
     var keys = Object.keys(inventory);
     if(keys.includes(item.internal)){
         inventory[item.internal] += count;
     }else{
         inventory[item.internal] = count;
     }
}

exports.removeItem = function(inventory, item, count){
     var keys = Object.keys(inventory);
     if(keys.includes(item.internal)){
         inventory[item.internal] -= count;
         if(inventory[item.internal] <= 0)delete inventory[item.internal];
     }
}

exports.getTotalCount = function(inventory){
    var keys = Object.keys(inventory);
    var total = 0;
    for(var i = 0; i < keys.length; i++){
        if(keys[i] === 'equipped')continue;
        total += parseInt(inventory[keys[i]]);
    }
    return total;
}

exports.noAccountMessage = function(){
    return `You have not begun your adventure! Type \`${main.properties.prefix}start\` to begin!`;
}

exports.getInventoryStorage = function(data){
    if(data.perks.upgrade_inventory !== 'undefined'){
        var val = data.perks.upgrade_inventory;
        if(val === 0)return 750;
        if(val === 1)return 2000;
        if(val === 2)return 5000;
        if(val === 3)return 20000;
    }
    return 350;
}

exports.getBackpackStorage = function(data){
    if(data.perks.upgrade_backpack !== 'undefined'){
        var val = data.perks.upgrade_backpack;
        if(val === 0)return 150;
        if(val === 1)return 400;
        if(val === 2)return 1000;
        if(val === 3)return 2500;
    }
    return 100;
}