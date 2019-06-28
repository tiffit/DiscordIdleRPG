var dungeonsInfo = require('./config/dungeons.json');

exports.fromInternal = function(internal){
    for(var i = 0; i < dungeonsInfo.length; i++){
        if (typeof dungeonsInfo[i].internal != "undefined") {
            if(dungeonsInfo[i].internal === internal)return dungeonsInfo[i];
        }
    }
    return null;
}