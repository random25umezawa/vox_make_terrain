const fs = require("fs");

let filedata = "VOX "+numToBinaryString(150,4);
let main = "MAIN";
let size = "SIZE"+numToBinaryString(12,4)+numToBinaryString(0,4);
let xyzi = "XYZI";

let blocks = "";

let maxX = 0;
let maxY = 0;
let maxZ = 0;
for(let x = 0; x < 5; x++) {
	if(x==3) continue;
	maxX = Math.max(x,maxX);
	for(let y = 0; y < 5; y++) {
		if(y==1) continue;
		maxY = Math.max(y,maxY);
		for(let z = 0; z < 5; z++) {
			if(z==2) continue;
			maxZ = Math.max(z,maxZ);

			blocks += arrToBinaryString([x,y,z,125]);
		}
	}
}

xyzi += numToBinaryString(blocks.length+4,4)+numToBinaryString(0,4);
xyzi += numToBinaryString(blocks.length,4);
xyzi += blocks;

size += numToBinaryString(maxX,4)
size += numToBinaryString(maxY,4)
size += numToBinaryString(maxZ,4)

let model = size+xyzi;

main += numToBinaryString(0,4);
main += numToBinaryString(model.length,4);
main += model;

filedata += main;

fs.writeFileSync("out.vox",filedata,"binary");

function numToBinaryString(num,len) {
	let str = "";
	for(let padding = 0; padding < len; padding++) {
		str += String.fromCharCode((num>>(padding*8))&0xff);
	}
	return str;
}

function arrToBinaryString(arr) {
	return arr.reduce((str,num) => {str += String.fromCharCode(num); return str;}, "");
}
