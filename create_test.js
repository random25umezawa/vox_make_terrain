const fs = require("fs");
const VoxelCreate = require("./VoxelCreate");

let SIZE = 5;

function addStair(x,y,z) {
	for(let i = 0; i < SIZE; i++) {
		for(let j = 0; j < SIZE; j++) {
			for(let k = 0; k < SIZE-i; k++) {
				vm.addBlock(x*SIZE+j,y*SIZE+k,z*SIZE+i,0);
			}
		}
	}
}
function addFloor(x,y,z) {
	for(let i = 0; i < 1; i++) {
		for(let j = 0; j < SIZE; j++) {
			for(let k = 0; k < SIZE; k++) {
				vm.addBlock(x*SIZE+j,y*SIZE+k,z*SIZE+i,0);
			}
		}
	}
}
function addRoom(x,y,z) {
	for(let i = 0; i < SIZE; i++) {
		for(let j = 0; j < SIZE; j++) {
			for(let k = 0; k < SIZE; k++) {
				vm.addBlock(x*SIZE+j,y*SIZE+k,z*SIZE+i,0);
			}
		}
	}
}
function addPath(x,y,z) {
	for(let i = 0; i < SIZE; i++) {
		for(let j = 0; j < SIZE; j++) {
			for(let k = 0; k < SIZE; k++) {
				vm.addBlock(x*SIZE+j,y*SIZE+k,z*SIZE+i,1);
			}
		}
	}
}

let vm = new VoxelCreate();
vm.addRGBA(25,125,255,0);
vm.addRGBA(125,255,255,0);
/*
addFloor(1,3,3);
addStair(1,2,3);
addFloor(1,1,4);

addStair(0,0,0);
addStair(5,2,3);
*/

let room_counter = 0;
let room_arr = {};
let path_arr = [];
let size = 3;
for(let i = 0; i < size; i++) {
	for(let j = 0; j < size; j++) {
		for(let k = 0; k < size; k++) {
			let key = i+" "+j+" "+k;
			room_arr[key] = [null];
			addRoom(i*2,j*2,k*2);
		}
	}
}
for(let i = 0; i < size-1; i++) {
	for(let j = 0; j < size; j++) {
		for(let k = 0; k < size; k++) {
			path_arr.push([i,j,k,1,0,0]);
		}
	}
}
for(let i = 0; i < size; i++) {
	for(let j = 0; j < size-1; j++) {
		for(let k = 0; k < size; k++) {
			path_arr.push([i,j,k,0,1,0]);
		}
	}
}
for(let i = 0; i < size; i++) {
	for(let j = 0; j < size; j++) {
		for(let k = 0; k < size-1; k++) {
			path_arr.push([i,j,k,0,0,1]);
		}
	}
}
path_arr.sort(_=>Math.random()-0.5);
for(let p of path_arr) {
	let r1 = room_arr[(p[0])+" "+(p[1])+" "+(p[2])];
	let r2 = room_arr[(p[0]+p[3])+" "+(p[1]+p[4])+" "+(p[2]+p[5])];
	let rr1 = get_room(r1);
	let rr2 = get_room(r2);
	if(rr1!=rr2) {
		let new_room = [null];
		rr1[0] = new_room;
		rr2[0] = new_room;
		addPath(p[0]*2+p[3],p[1]*2+p[4],p[2]*2+p[5]);
	}
}
function get_room(room) {
	let res = room;
	if(room[0]!=null) {
		res = get_room(room[0]);
		room[0] = res;
	}
	return res;
}


let result = vm.exportBinary();

fs.writeFileSync("test.vox",result,"binary");
