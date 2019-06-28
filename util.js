const main = require('./main');

exports.addItem = function (inventory, item, count) {
    var keys = Object.keys(inventory);
    if (keys.includes(item.internal)) {
        inventory[item.internal] += count;
    } else {
        inventory[item.internal] = count;
    }
}

exports.addItemFromB = function (inventory, item, count) {
    var keys = Object.keys(inventory);
    if (keys.includes(item)) {
        inventory[item] += count;
    } else {
        inventory[item] = count;
    }
}

exports.removeItem = function (inventory, item, count) {
    var keys = Object.keys(inventory);
    if (keys.includes(item.internal)) {
        inventory[item.internal] -= count;
        if (inventory[item.internal] <= 0) delete inventory[item.internal];
    }
}

exports.getTotalCount = function (inventory) {
    var keys = Object.keys(inventory);
    var total = 0;
    for (var i = 0; i < keys.length; i++) {
        if (keys[i] === 'equipped') continue;
        total += parseInt(inventory[keys[i]]);
    }
    return total;
}

exports.noAccountMessage = function () {
    return `You have not begun your adventure! Type \`${main.properties.prefix}start\` to begin!`;
}

exports.getInventoryStorage = function (data) {
    return 350;
}

exports.getBackpackStorage = function (data) {
    return 100;
}