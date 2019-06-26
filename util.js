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

exports.noAccountMessage = function(){
    return `You have not begun your adventure! Type \`${main.properties.prefix}start\` to begin!`;
}