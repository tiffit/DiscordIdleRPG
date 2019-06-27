var craftingInfo = require('./config/crafting.json');

exports.recipes = craftingInfo;

exports.fromInternal = function(internal){
    for(var i = 0; i < craftingInfo.length; i++){
        if(craftingInfo[i].item === internal)return craftingInfo[i];
    }
    return null;
}

exports.unlocked = function(recipe, data){
    return recipe.unlocked;
}