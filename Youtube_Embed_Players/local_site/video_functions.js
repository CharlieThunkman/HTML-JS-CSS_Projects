// Function to check body dimensions on load
console.log(document.body.clientHeight,document.body.clientWidth);

// Polling function for the myFrame1 element
function pollDOM () {
	var el = document.getElementById('myFrame1');
	
	if (el) {
		// Do something with el
	} else {
		setTimeout(pollDOM, 3000); // try again in 300 milliseconds
	}
}
pollDOM();

// Main YouTube player and DOM manipulation logic
var source = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLuXaDdOtKhFdgYYaZ5SmkxqHntujrS73k&key=AIzaSyDI5nYD54CtFM3GjiP1fm2J59LmGJDH-7g&maxResults=50"
var url = window.location.href;
let allowFS = 0;

function myFrame(){
	let iframe = document.createElement("iFrame");
	let textblip1 = document.createElement("span");
	let textblip2 = document.createElement("span");
	let div = document.createElement("div");
	div.appendChild(iframe);
	div.appendChild(textblip1);
	div.appendChild(textblip2);
	return div;
}

let myFrameBase = "https://www.youtube.com/embed/videoseries?enablejsapi=1";
let myFrameHolder = [myFrame(),myFrame(),myFrame(),myFrame()];
let hidePlayerInt = Math.pow(2,myFrameHolder.length)-1;
const playlist_IDs = ["PLuXaDdOtKhFcytpEqQ6fay1KF4eSZI-eq","PLuXaDdOtKhFdgYYaZ5SmkxqHntujrS73k","PL07iBthz24JBwDqSScgUCH_XpCxd72-WC","PLuXaDdOtKhFeu-eIaEG63-qVwt2DUO8tA"]
// Load only players if designated by url params
if(getAllUrlParams(url)["showplayer"] && parseInt(getAllUrlParams(url)["showplayer"]) >= 0){
	hidePlayerInt = parseInt(getAllUrlParams(url)["showplayer"]);
}

let hidePlayerBin = int2bin(hidePlayerInt,playlist_IDs.length);
let showPlayerCount = 0;

for(i=0;i<playlist_IDs.length;i++){
	showPlayerCount += parseInt(hidePlayerBin.charAt(i));
}

let indexSPC = 0;
console.log(getAllUrlParams(url)["showplayer"],hidePlayerInt,hidePlayerBin,showPlayerCount)
console.log(hidePlayerBin.charAt(3),hidePlayerBin.charAt(2),hidePlayerBin.charAt(1),hidePlayerBin.charAt(0));

for(var i=0;i<myFrameHolder.length;i++){ // Load SELECTED players only, all players set further down
	if(hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1"){ // if 1 is showing, indicated by EVEN number
		myFrameHolder[i].children[0].src = myFrameBase + "&list=" + playlist_IDs[i];
		myFrameHolder[i].style.position = "fixed";
		myFrameHolder[i].width= 100.0 / showPlayerCount + "%";
		myFrameHolder[i].children[0].style.width= 100.0 / showPlayerCount + "%";
		myFrameHolder[i].children[0].style.left= 100 * (indexSPC++ / showPlayerCount) + "%";
		console.log("modified index " + i);
	}
}
updateLocalStorage("buttons_html",hidePlayerBin);

function updateLocalStorage(key,valueObject,expire = 10){
	const exp = (Date.now()+expire*1000); // Expires in seconds
	localStorage.setItem(key, JSON.stringify({Contents: valueObject, Expire: exp}));
	this.currentIndex = 0;
}

if(getAllUrlParams(url)["allowfullscreen"]){
	allowFS = 1;
	console.log(allowFS)
} else {
	for(var i=0;i<myFrameHolder.length;i++){
		myFrameHolder[i].children[0].src = myFrameHolder[i].children[0].src + "&fs=0";
	}
}

// Video Titles and constantly visible time clock
indexSPC = 0;
for(var i=0;i<myFrameHolder.length;i++){
	if(hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1"){ // if 1 is showing, indicated by EVEN number
		myFrameHolder[i].children[1].innerHTML = "Placeholder Text";
		myFrameHolder[i].children[2].innerHTML = "Placeholder Time";
		myFrameHolder[i].children[1].style.left= "calc(" + 100 * (indexSPC / showPlayerCount) + "% + 2px)";
		myFrameHolder[i].children[2].style.left= "calc(" + 100 * (indexSPC / showPlayerCount) + "% + 2px)";
		indexSPC++;
		myFrameHolder[i].children[1].style.right= 100 * ((showPlayerCount - indexSPC) / showPlayerCount) + "%";
		myFrameHolder[i].children[2].style.right= 100 * ((showPlayerCount - indexSPC) / showPlayerCount) + "%";
		myFrameHolder[i].children[1].style.top= "calc(100% - 40px)";
		myFrameHolder[i].children[2].style.top= "calc(100% - 20px)";
		myFrameHolder[i].children[1].style.justifyContent = "center";
	}
}

let myFrameDiv = document.getElementById("myFrameDiv");
for(i=0;i<playlist_IDs.length;i++){
	if(getAllUrlParams(url)["showplayer"] && parseInt(getAllUrlParams(url)["showplayer"]) >= 0){
		let hidePlayerBin = int2bin(hidePlayerInt,playlist_IDs.length);
		if(hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1"){ // if 1 is showing, indicated by EVEN number
			myFrameDiv.appendChild(myFrameHolder[i]);
			console.log("displaying index " + i);
		}
	} else {
		myFrameDiv.appendChild(myFrameHolder[i]);
		console.log("displaying all indexes");
	}
}

// global variable for the player
var player;
var running=0;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
	// create the global player from the specific iframe (#video)
	player = [new YT.Player(myFrameHolder[0].children[0], {
		events: {
			// call this function when each player is ready to use
			'onReady': onPlayerReady
		}
	}),	
	new YT.Player(myFrameHolder[1].children[0], {
		events: {
			'onReady': onPlayerReady2
		}
	}),	
	new YT.Player(myFrameHolder[2].children[0], {
		events: {
			'onReady': onPlayerReady4
		}
	}),
	new YT.Player(myFrameHolder[3].children[0], {
		events: {
			'onReady': onPlayerReady8
		}
	})
	];
}

const storageArray = ["YT_Player_1","YT_Player_2","YT_Player_4","YT_Player_8"];
var thisReadState = [];
var adSense = [];
function onPlayerReady(event) {
	console.log("Player1 is ready.");
	timeUpdate();
	running = running + 1;
}

function onPlayerReady2(event) {
	console.log("Player2 is ready.");
	timeUpdate();
	running = running + 2;
}

function onPlayerReady4(event) {
	console.log("Player4 is ready.");
	timeUpdate();
	running = running + 4;
}

function onPlayerReady8(event) {
	console.log("Player8 is ready.");
	timeUpdate();
	running = running + 8;
}

var vid2ls_old = [4];
var muteMaster = [0,0,0,0];
var replayMaster = [0,0,0,0];

// Main update loop
function looper(){
	if(running != hidePlayerInt){ return; }
	let hidePlayerBin = int2bin(hidePlayerInt,playlist_IDs.length);
	for(let i=0;i<storageArray.length;i++){
		const ls = JSON.parse(localStorage.getItem(storageArray[i]));
		if(!lastReadState_LS[i] && ls){
			lastReadState_LS[i] = ls;
			console.log("Set " + i + " to", lastReadState_LS[i]);
			lastReadState_LS[i].Expire = lastReadState_LS[i].Expire%100000000 - 20;
		}
		// adSense disable function, triggers every tick ad is detected from the previous tick
				if(adSense[i]){if(adSense[i] == 1){adSense[i]++;}else if(muteMaster[i]=0){player[i].unMute(); adSense[i]=0;}}
		// if request sent, request is either skimState or new, and request sent to a loaded player
		if(ls && (ls.Buttons.skimState != 0 || ls.Expire%100000000!=lastReadState_LS[i].Expire%100000000) && hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1"){
			console.log(lastReadState_LS[i], ls, ls.Expire%100000000, lastReadState_LS[i].Expire%100000000, Date.now()%100000000); // Background Debugging purposes
			if(Date.now()>ls.Expire){
				//localStorage.removeItem(storageArray[i]);
			}
			// playState
				 if(ls.Buttons.playState == 1){player[i].playVideo(); /*console.log("1",i);*/}
			else if(ls.Buttons.playState == 0){player[i].stopVideo(); /*console.log("0",i);*/}
			else if(ls.Buttons.playState == 2){player[i].pauseVideo(); /*console.log("2",i);*/}
			// skimState
			if(ls.Buttons.skimState != 0){
				var currentTime = player[i].getCurrentTime();
				player[i].seekTo(currentTime+ls.Buttons.skimState, true);
				player[i].pauseVideo();
				/*console.log("1",i);*/
			}
			// timeJumpTo_sec
			if(ls.Buttons.timeJumpTo_sec >= 0 ){
				player[i].seekTo(ls.Buttons.timeJumpTo_sec, true);
				/*console.log("1",i);*/
			}
			// volumeState
			player[i].setVolume(ls.Buttons.volState);
			// isMuted
			if(ls.Buttons.isMuted){player[i].mute();muteMaster[i]=1;}
			else{player[i].unMute();muteMaster[i]=0;}
			// playbackSpeedState
			if(ls.Buttons.playbackSpeedState != player[i].getPlaybackRate()){
	//			console.log(player[i].getAvailablePlaybackRates(),ls.Buttons.playbackSpeedState);
				player[i].setPlaybackRate(ls.Buttons.playbackSpeedState);
			}
			
			// skipState - seeking through the playlist
			
				 if(ls.Buttons.skipState == -1 && lastReadState_LS[i].Expire%100000000 != ls.Expire%100000000){player[i].previousVideo(); /*console.log("1",i);*/}
			else if(ls.Buttons.skipState == 1 && lastReadState_LS[i].Expire%100000000 != ls.Expire%100000000){player[i].nextVideo(); /*console.log("0",i);*/}
			
			// Replay initiate
			replayMaster[i]=ls.Buttons.replayBool;

			
			// store saved state
			thisReadState[i] = ls;
		}
		
	}
	// edit span Text
	let showPlayerCount = 0, indexSPC = 0;
	for(i=0;i<playlist_IDs.length;i++){
		showPlayerCount += parseInt(hidePlayerBin.charAt(i));
	}
	var vid2ls = [4];
	var vid2ls_dif=false;
	for(i=0;i<playlist_IDs.length;i++){
		if(hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1"){ // if 1 is showing, indicated by EVEN number
			let duration = player[i].getDuration();
			let currentTime = player[i].getCurrentTime();
			let currentBufferFrac = player[i].getVideoLoadedFraction();
			let bufferTime = Math.max(0,duration*currentBufferFrac-currentTime);
			// Mute player if an ad is detected (NEW FEATURE noticed as early as August 1st, 2024)
			let prefix = "";
			if(getAllUrlParams(url)["muteads"]){
				if(duration*currentBufferFrac-currentTime < 0 || bufferTime > 180){
					prefix = "ad?? ";
					if(duration*currentBufferFrac-currentTime < -0.1 || bufferTime > 700){
						// Definite ad detected, muted player and send request to unmute from volumeState above
						adSense[i] = 1;
						player[i].mute();
					}
				}
			}
			let currentVolume = player[i].getVolume();
			myFrameHolder[i].children[1].innerHTML = myFrameHolder[i].children[0].title;
			let prevIndex=null,nextIndex=null;
			if(player[i].getPlaylistIndex()>1){
				prevIndex = player[i].getPlaylist()[player[i].getPlaylistIndex()-1];
				}
			if(player[i].getPlaylistIndex()<player[i].getPlaylist().length){
				nextIndex = player[i].getPlaylist()[player[i].getPlaylistIndex()+1]
			}
			vid2ls[i] = [myFrameHolder[i].children[0].title.slice(0,63),prevIndex,nextIndex,player[i].getPlaylistIndex()];
			if(!isEqual(vid2ls[i],vid2ls_old[i])){
				vid2ls_dif = true;
			}
			var aspace = "";
			for(let j=0;j<duration*currentBufferFrac-currentTime;j=Math.floor((j*1.05)+1)){
				aspace += " "; // = alt+1279
			}
			myFrameHolder[i].children[2].innerHTML = timeFormat(currentTime) + " / " + timeFormat(duration) + " " + prefix + " " + aspace + " " + currentVolume + "% (" + timeFormat(bufferTime,false) + ") ";
    //			console.log("."+aspace+".",myFrameHolder[i].children[2].innerHTML,timeFormat(duration) + " " + aspace + " (" + timeFormat(Math.max(0,duration*currentBuffer-currentTime),false));

			// Video Looper
			if(replayMaster[i] == 1 
				&& player[i].getVideoLoadedFraction() > 0.999
				&& duration-currentTime <= 30){player[i].seekTo(0); /*console.log("1",i);*/}
		}
	}
	if(vid2ls_dif){
		updateLocalStorage("buttons_titles",vid2ls,15);
		console.log(vid2ls,vid2ls_old);
	}
	vid2ls_old = vid2ls;
	lastReadState_LS = thisReadState;
	timeUpdate()
	return;
}

function timeUpdate(){
	var refresh=100; // Refresh rate in milli seconds
	mytime=setTimeout('looper()',refresh,lastReadState_LS)
}		

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function getAllUrlParams(url) {
	var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
	var obj = {};
	if (queryString) {
		queryString = queryString.split('#')[0];
		var arr = queryString.split('&');
		for (var i = 0; i < arr.length; i++) {
		var a = arr[i].split('=');
		var paramName = a[0];
		var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
		paramName = paramName.toLowerCase();
		if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
		if (paramName.match(/\[(\d+)?\]$/)) {
			var key = paramName.replace(/\[(\d+)?\]/, '');
			if (!obj[key]) obj[key] = [];
			if (paramName.match(/\[\d+\]$/)) {
				var index = /\[(\d+)\]/.exec(paramName)[1];
				obj[key][index] = paramValue;
			} else {
				obj[key].push(paramValue);
			}
		} else {
			if (!obj[paramName]) {
				obj[paramName] = paramValue;
			} else if (obj[paramName] && typeof obj[paramName] === 'string'){
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

// Resizing function (commented out in original)
/*
function resizeIFrameToFitContent( iFrame ) {
	iFrame.width = iFrame.contentWindow.document.body.scrollWidth;
	iFrame.height = iFrame.contentWindow.document.body.scrollWidth*9/16;
}
window.addEventListener('DOMContentLoaded', function(e) {
	var iFrame = document.getElementById( 'iFrame' );
	resizeIFrameToFitContent( iFrame );
	var iframes = document.querySelectorAll("iframe");
	for( var i = 0; i < iframes.length; i++) {
		resizeIFrameToFitContent( iframes[i] );
	}
} );
*/