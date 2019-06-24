const list = new Array();

const fileLoc = "./config/items/";
const fileList = [require(fileLoc + "axe.json")];

fileList.forEach((items) => items.forEach((item) => list.push(item)));

exports.list = list;