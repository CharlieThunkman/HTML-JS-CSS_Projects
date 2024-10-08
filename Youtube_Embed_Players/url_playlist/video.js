var url = window.location.href;
let allowFS = 0;
let myFrame = document.getElementById("myFrame");
let list;
if(getAllUrlParams(url)["allowfullscreen"]){
	allowFS = 1; 
	console.log(allowFS)
} else {
	myFrame.src = myFrame.src + "&fs=0";
}
if(getAllUrlParams(url)['list']){
	list= getAllUrlParams(url)["list"];
} else {
	list = "PLoSIOFPSXQoN9mz00ZrI1a7ZW5aqPFVq-"
}
console.log(getAllUrlParams(url));
myFrame.src = myFrame.src + "&list=" + list;

	// global variable for the player
var player;
var running=0;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
	// create the global player from the specific iframe (#video)
	player = [new YT.Player('myFrame', {
		events: {
			// call this function when player is ready to use
			'onReady': onPlayerReady
		}
	}) ];
}
const storageArray = ["YT_Player"];
var lastReadState = [""];
function onPlayerReady(event) {
	console.log("Player1 is ready.");
	timeUpdate();
	running++;
}

function looper(){
	if(running != storageArray.length){ return; }
	var thisReadState = [];
	for(let i=0;i<storageArray.length;i++){
		const ls = JSON.parse(localStorage.getItem(storageArray[i]));
		if(ls && (lastReadState.length != storageArray.length || ls.Expire!=lastReadState[i].Expire)){
			console.log(lastReadState[i], ls, Date.now());
			if(Date.now()>ls.Expire){
				//localStorage.removeItem(storageArray[i]);
			}
				 if(ls.Buttons.playState == 1){player[i].playVideo();  /*console.log("1",i);*/}
			else if(ls.Buttons.playState == 0){player[i].stopVideo();  /*console.log("0",i);*/}
			else if(ls.Buttons.playState == 2){player[i].pauseVideo(); /*console.log("2",i);*/}
			if(ls.Buttons.speedState != 0){
				var currentTime = player[i].getCurrentTime();
				player[i].seekTo(currentTime+ls.Buttons.speedState, true);
				player[i].pauseVideo();
				/*console.log("1",i);*/
			}
			thisReadState.push(ls);
		}
		
	}
	lastReadState = thisReadState;
	timeUpdate()
	return;
}
function timeUpdate(){
	var refresh=100; // Refresh rate in milli seconds
	mytime=setTimeout('looper()',refresh,lastReadState)
}

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function getAllUrlParams(url) {
	// get query string from url (optional) or window
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		// stuff after # is not part of query string, so get rid of it
		queryString = queryString.split('#')[0];
		// split our query string into its component parts
		var arr = queryString.split('&');
		for (var i = 0; i < arr.length; i++) {
			var a = arr[i].split('=');
			// set parameter name and value (use 'true' if empty)
			var paramName = a[0];
			var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
			// (optional) keep case consistent
			paramName = paramName.toLowerCase();
//					if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
			// if the paramName ends with square brackets, e.g. colors[] or colors[2]
			if (paramName.match(/\[(\d+)?\]$/)) {
				// create key if it doesn't exist
				var key = paramName.replace(/\[(\d+)?\]/, '');
				if (!obj[key]) obj[key] = [];
				// if it's an indexed array e.g. colors[2]
				if (paramName.match(/\[\d+\]$/)) {
				// get the index value and add the entry at the appropriate position
					var index = /\[(\d+)\]/.exec(paramName)[1];
					obj[key][index] = paramValue;
				} else { //push value into array
					obj[key].push(paramValue);
				}
			} else {// we're dealing with a string
				if (!obj[paramName]) {// if it doesn't exist, create property
					obj[paramName] = paramValue;
				} else if (obj[paramName] && typeof obj[paramName] === 'string'){
				// if property does exist and it's a string, convert it to an array
					obj[paramName] = [obj[paramName]];
					obj[paramName].push(paramValue);
				} else {
					obj[paramName].push(paramValue);
				}
			}
		}
	}
	return obj;
}
