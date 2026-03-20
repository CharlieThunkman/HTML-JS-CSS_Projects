var lastReadState_LS = [];
function timeUpdate(){
	var refresh=100; // Refresh rate in milli seconds
	mytime=setTimeout('looper()',refresh,lastReadState_LS)
}


function int2bin(i, l=8){
	return ((i+Math.pow(2,l))%Math.pow(2,l)).toString(2).padStart(l,"0");
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

// Initialize Worker
const sharedWorker = new SharedWorker('worker.js');
sharedWorker.port.start();

/**
 * Replaces the old LocalStorage-only function.
 * Now broadcasts data via SharedWorker for instant cross-site sync.
 */
function updateLocalStorage(key, valueObject, expire = 15) {
    // 1. Maintain backward compatibility (Optional: keep writing to LS)
    const exp = Date.now() + (expire * 1000);
    const data = { Contents: valueObject, Expire: exp, Buttons: valueObject }; 
    localStorage.setItem(key, JSON.stringify(data));

    // 2. THE PERFORMANCE FIX: Broadcast via Worker
    // This allows the other site to react INSTANTLY without a loop
    sharedWorker.port.postMessage({
        key: key,
        data: data,
        source: window.location.href // Helps debug which site sent it
    });
}
