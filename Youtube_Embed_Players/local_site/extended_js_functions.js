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

// Initialize the Hub
window.sharedWorker = new SharedWorker('shared_worker.js');
window.sharedWorker.port.start();

// This object is the "Source of Truth" in RAM
window.globalState = {
    buttons_titles: {},
    buttons_html: "",
    YT_Player_1: null,
    YT_Player_2: null,
    YT_Player_4: null,
    YT_Player_8: null
};

// INITIAL LOAD: Sync from disk once on startup
(function initData() {
    const keys = Object.keys(window.globalState);
    keys.forEach(k => {
        const saved = localStorage.getItem(k);
        if (saved) window.globalState[k] = JSON.parse(saved);
    });
})();

/**
 * Replaces old localStorage logic. 
 * Use this for ALL data updates on both sites.
 */
function updateLocalStorage(key, valueObject, expire = 15) {
    const exp = Date.now() + (expire * 1000);
    const dataPackage = { 
        Contents: valueObject, 
        Expire: exp, 
        Buttons: valueObject 
    };

    // Update local RAM immediately
    window.globalState[key] = dataPackage;

    // Broadcast to the other site
    window.sharedWorker.port.postMessage({ key, data: dataPackage });

    // Save to disk as a background task
    localStorage.setItem(key, JSON.stringify(dataPackage));
}

// Global Listener for the worker "Push"
window.sharedWorker.port.onmessage = function(e) {
    const { key, data } = e.data;
    window.globalState[key] = data;

    // Trigger specific site logic if functions exist
    if (window.onWorkerMessageReceived) {
        window.onWorkerMessageReceived(key, data);
    }
};
