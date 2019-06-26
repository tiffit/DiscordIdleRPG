exports.addItem = function(inventory, item, count){
     var keys = Object.keys(inventory);
     if(keys.includes(item.internal)){
         inventory[item.internal] += count;
     }else{
         inventory.equipped = count;
     }
}

exports.removeItem = function(inventory, item, count){
     var keys = Object.keys(inventory);
     if(keys.includes(item.internal)){
         inventory[item.internal] -= count;
         if(inventory[item.internal] <= 0)delete inventory[item.internal];
     }
}