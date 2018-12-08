class VoxelCreate {
	constructor() {
		this.block_arr = {};
		this.palette_arr = [];
	}

	xyzstr(x,y,z) {
		return `${x},${y},${z}`;
	}

	addBlock(x,y,z,c) {
		this.block_arr[this.xyzstr(x,y,z)] = c;
	}

	removeBlock(x,y,z) {
		delete this.block_arr[this.xyzstr(x,y,z)];
	}

	addRGBA(r,g,b,a) {
		this.palette_arr.push([r,g,b,a]);
	}

	numToBinaryString(num,len) {
		let str = "";
		for(let padding = 0; padding < len; padding++) {
			str += String.fromCharCode((num>>(padding*8))&0xff);
		}
		return str;
	}

	arrToBinaryString(arr) {
		return arr.reduce((str,num) => {str += String.fromCharCode(num); return str;}, "");
	}

	exportBinary() {

		let maxX = 0;
		let maxY = 0;
		let maxZ = 0;

		let blocks = "";
		for(let xyz_str of Object.keys(this.block_arr)) {
			let _arr = xyz_str.split(",");
			_arr.push(this.block_arr[xyz_str]+2);
			blocks += this.arrToBinaryString(_arr);

			maxX = Math.max(maxX,_arr[0]);
			maxY = Math.max(maxY,_arr[1]);
			maxZ = Math.max(maxZ,_arr[2]);
		}

		let palette = "RGBA"+this.numToBinaryString(256*4,4)+this.numToBinaryString(0,4);
		palette += this.numToBinaryString(0,4);
		for(let i = 0; i < 255; i++) {
			palette += (this.palette_arr[i])?this.arrToBinaryString(this.palette_arr[i]):this.numToBinaryString(0,4);
		}

		let filedata = "VOX "+this.numToBinaryString(150,4);
		let main = "MAIN";
		let size = "SIZE"+this.numToBinaryString(12,4)+this.numToBinaryString(0,4);
		let xyzi = "XYZI";

		xyzi += this.numToBinaryString(blocks.length+4,4)+this.numToBinaryString(0,4);
		xyzi += this.numToBinaryString(blocks.length,4);
		xyzi += blocks;

		size += this.numToBinaryString(maxX,4)
		size += this.numToBinaryString(maxY,4)
		size += this.numToBinaryString(maxZ,4)

		let model = size+xyzi;
		model += palette;

		main += this.numToBinaryString(0,4);
		main += this.numToBinaryString(model.length,4);
		main += model;

		filedata += main;

		return filedata;
	}
}

module.exports = VoxelCreate;
