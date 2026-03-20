var lastReadState_LS = [];
function timeUpdate() {
    var refresh = 200; 
    clearTimeout(window.looperTimer); 
    window.looperTimer = setTimeout(looper, refresh);
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

// CHOOSE ONE FILENAME AND STICK TO IT (e.g., 'shared_worker.js')
const WORKER_FILE = 'shared_worker.js'; 
window.sharedWorker = new SharedWorker(WORKER_FILE);

// 3. The "Source of Truth"
window.globalState = {
    buttons_titles: { Contents: [] },
    buttons_html: { Contents: "0000" },
    YT_Player_1: null,
    YT_Player_2: null,
    YT_Player_4: null,
    YT_Player_8: null
};

// 4. Initial Sync from LocalStorage
(function initData() {
    Object.keys(window.globalState).forEach(k => {
        const saved = localStorage.getItem(k);
        if (saved) {
            try { window.globalState[k] = JSON.parse(saved); } catch(e) { console.error("LS Parse Error", k); }
        }
    });
})();

// 5. Unified Communication Logic
function updateLocalStorage(key, valueObject, expire = 15) {
    const dataPackage = { 
        Contents: valueObject, 
        Expire: Date.now() + (expire * 1000), 
        Buttons: valueObject 
    };

    window.globalState[key] = dataPackage;
    window.sharedWorker.port.postMessage({ key, data: dataPackage });
    localStorage.setItem(key, JSON.stringify(dataPackage));
}

// 6. The "Single Source" Listener
window.sharedWorker.port.addEventListener('message', function(e) {
    const { key, data } = e.data;
    window.globalState[key] = data;
    
    // Debug line to confirm receipt
    console.log(`%c [Worker] -> ${key} updated`, "color: #00ff00; font-weight: bold");

    if (typeof window.onWorkerMessageReceived === 'function') {
        window.onWorkerMessageReceived(key, data);
    }
});

// Start the port once and only once
window.sharedWorker.port.start();
