const list = new Array();

const fileLoc = "./config/items/";
const fileList = [require(fileLoc + "axe.json")];

fileList.forEach((items) => items.forEach((item) => list.push(item)));

exports.list = list;

exports.fromInternal = function(internal){
    for(var i = 0; i < list.length; i++){
        if(list[i].internal === internal)return list[i];
    }
    return null;
}