const list = new Array();

const fileLoc = "./config/items/";
const fileList = [require(fileLoc + "axe.json"), require(fileLoc + "pickaxe.json"), require(fileLoc + "pole.json"), require(fileLoc + "sword.json"), require(fileLoc + "armor.json"), 
                    require(fileLoc + "materials.json"), require(fileLoc + "upgrades.json"), , require(fileLoc + "blueprints.json")];

fileList.forEach((items) => items.forEach((item) => list.push(item)));

exports.list = list;

exports.fromInternal = function(internal){
    for(var i = 0; i < list.length; i++){
        if(list[i].internal === internal)return list[i];
    }
    return null;
}

exports.fromName = function(name){
    for(var i = 0; i < list.length; i++){
        if(list[i].name.toLowerCase() === name.toLowerCase())return list[i];
    }
    return null;
}