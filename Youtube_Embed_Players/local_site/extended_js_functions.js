function pow(a,b){
	let n = a**b;
	// n = Math.pow(a,b)
	return n;
}

var lastReadState_LS = [];
function timeUpdate(){
	var refresh=100; // Refresh rate in milli seconds
	mytime=setTimeout('looper()',refresh,lastReadState_LS)
}


function int2bin(i, l=8){
	return ((i+pow(2,l))%pow(2,l)).toString(2).padStart(l,"0");
}

function timeFormat(f,h=true){
	let hour = Math.floor(f/60/60);
	let minute = Math.floor(f/60)%60;
	let second = Math.floor(f)%60;
	if(h){
		return hour + ":" + minute.toString().padStart(2,"0") + ":" + second.toString().padStart(2,"0");
	} else {
		minute += hour*60;
		return minute.toString().padStart(1,"0") + ":" + second.toString().padStart(2,"0");
		}
}

function isEqual(arr1, arr2){
	return JSON.stringify(arr1) === JSON.stringify(arr2);
}
