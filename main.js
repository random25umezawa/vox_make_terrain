const fs = require("fs");

let filedata = "VOX "+numToBinaryString(150,4);
let main = "MAIN";
let size = "SIZE"+numToBinaryString(12,4)+numToBinaryString(0,4);
let xyzi = "XYZI";

let blocks = "";

const span = 0.0625;

const biomes = [
	{
		name:"kusa",
		algorithm: (x,y) => {
			x *= span;
			y *= span;
			return 0.3*Math.sin(3+0.25*x)-0.16*Math.cos(1+0.8*x)+1.5+0.3*Math.sin(3+0.25*y)-0.16*Math.cos(1+0.8*y)+1.5;
			//return 0.3*Math.sin(3+0.25*x)-0.16*Math.cos(1+0.8*x)+1.5+0.25*Math.cos(y)+0.46*Math.sin(1.25+0.19*y)+0.85*Math.cos(0.72*y)+0.37*Math.sin(1.99+1.72*y)+Math.sin(0.125*(x+5.853)*(y+12.7329));
		},
		color:0xff00ff00,
		heightRate:3.75
	},
	{
		name:"yama",
		algorithm: (x,y) => {
			x *= span;
			y *= span;
			return Math.sin(2+0.8*x)+Math.cos(1+2.1*x)-0.5*Math.sin(3.7*x)+0.5+Math.sin(2+0.8*y)+Math.cos(1+2.1*y)-0.5*Math.sin(3.7*y)+0.5;
			//return Math.sin(2+0.8*x)+Math.cos(1+2.1*x)-0.5*Math.sin(3.7*x)+0.5+0.25*Math.cos(0.25+0.72*y)+0.5*Math.sin(0.77+1.25*y)+0.67*Math.cos(0.55+0.63*y)+0.82*Math.sin(0.36+1.75*y)+Math.cos(0.125*(x+2.6553)*(y+92.7329));
		},
		color:0xff887766,
		heightRate:6.5
	}
]

let palette = "RGBA"+numToBinaryString(256*4,4)+numToBinaryString(0,4);
palette += numToBinaryString(0,4);
for(let i = 0; i < 255; i++) {
	palette += numToBinaryString((biomes[i])?biomes[i].color:0,4);
}

let maxX = 0;
let maxY = 0;
let maxZ = 0;
for(let x = 0; x < 125; x++) {
	maxX = Math.max(x,maxX);
	for(let y = 0; y < 125; y++) {
		maxY = Math.max(y,maxY);

		let z = 0;

		let biomeIndex = 0;
		let biomeMax = 0;
		for(let i = 0; i < biomes.length; i++) {
			let biome = biomes[i];
			let calcedScore = biome.algorithm(x,y);
			if(biomeMax < calcedScore) {
				biomeMax = calcedScore;
				biomeIndex = i;
			}
		}

		if(biomeMax>0) z = biomeMax * biomes[biomeIndex].heightRate;
		maxZ = Math.max(z,maxZ);
		for(let i = 0; i < z; i++) {
			blocks += arrToBinaryString([x,y,i,biomeIndex+2]);
		}
		/*
		for(let z = 0; z < 5; z++) {
			if(z==2) continue;
			maxZ = Math.max(z,maxZ);

			blocks += arrToBinaryString([x,y,z,125]);
		}
		*/
	}
}

xyzi += numToBinaryString(blocks.length+4,4)+numToBinaryString(0,4);
xyzi += numToBinaryString(blocks.length,4);
xyzi += blocks;

size += numToBinaryString(maxX,4)
size += numToBinaryString(maxY,4)
size += numToBinaryString(maxZ,4)

let model = size+xyzi;
model += palette;

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
