// Function to check body dimensions on load
console.log(document.body.clientHeight,document.body.clientWidth);

// Main YouTube player and DOM manipulation logic
var source = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLuXaDdOtKhFdgYYaZ5SmkxqHntujrS73k&key=AIzaSyDI5nYD54CtFM3GjiP1fm2J59LmGJDH-7g&maxResults=50"
var url = window.location.href;
let allowFS = "";
// global variable for the player
var player;
var running=0;
const storageArray = ["YT_Player_1","YT_Player_2","YT_Player_4","YT_Player_8"];
var thisReadState = [];
var adSense = [];
var vid2ls = [{}, {}, {}, {}]; // Pre-allocate objects
var vid2ls_old = [{}, {}, {}, {}];
var lastReadState_LS = ["", "", "", ""]; 
var muteMaster = [0,0,0,0];
var replayMaster = [0,0,0,0];
let showPlayerCount = 0;
let myFrameBase = "https://www.youtube.com/embed/videoseries?enablejsapi=1";
let myFrameHolder = [myFrame(),myFrame(),myFrame(),myFrame()];
const playlist_IDs = ["PLuXaDdOtKhFcytpEqQ6fay1KF4eSZI-eq","PLuXaDdOtKhFdgYYaZ5SmkxqHntujrS73k","PL07iBthz24JBwDqSScgUCH_XpCxd72-WC","PLuXaDdOtKhFeu-eIaEG63-qVwt2DUO8tA"]
let hidePlayerInt = Math.pow(2,myFrameHolder.length)-1;
let lastStatusBar = ["","","",""];

// Load only players if designated by url params
if(getAllUrlParams(url)["showplayer"] && parseInt(getAllUrlParams(url)["showplayer"]) >= 0){
	hidePlayerInt = parseInt(getAllUrlParams(url)["showplayer"]);
}
let hidePlayerBin = int2bin(hidePlayerInt,playlist_IDs.length);
pollDOM();

for(let i=0;i<playlist_IDs.length;i++){
	showPlayerCount += parseInt(hidePlayerBin.charAt(i));
}

console.log(getAllUrlParams(url)["showplayer"],hidePlayerInt,hidePlayerBin,showPlayerCount);
console.log(hidePlayerBin.charAt(3),hidePlayerBin.charAt(2),hidePlayerBin.charAt(1),hidePlayerBin.charAt(0));

if(getAllUrlParams(url)["allowfullscreen"]){
} else {
	allowFS = "&fs=0";
}

// Clear the count for fresh calculation
let activePlayers = 0;

for (var i = 0; i < myFrameHolder.length; i++) {
    let wrapper = myFrameHolder[i];
    let isVisible = hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1";

    if (isVisible) {
        activePlayers++;
        // Remove manual positioning styles so Flexbox can take over
        wrapper.style.position = ""; 
        wrapper.style.left = "";
        wrapper.style.right = "";
        wrapper.classList.remove("hidden");

        // Set the source only if it's empty to prevent unnecessary reloading
        let iframe = wrapper.querySelector("iframe");
        if (!iframe.src || iframe.src === "") {
            iframe.src = myFrameBase + "&list=" + playlist_IDs[i] + "" + allowFS;
            iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        }
        
        // Handle Placeholder Text/Time (Titles)
        wrapper.children[1].innerHTML = "Playlist " + (i + 1);
        wrapper.children[2].innerHTML = "00:00";
		
		wrapper.children[1].style.justifyContent = "center";

		} else {
        wrapper.classList.add("hidden");
    }
}

// Update the container once
let myFrameDiv = document.getElementById("myFrameDiv");
if (myFrameDiv.children.length === 0) {
    for (i = 0; i < playlist_IDs.length; i++) {
        myFrameDiv.appendChild(myFrameHolder[i]);
    }
}
updateLocalStorage("buttons_html",hidePlayerBin);


for(let i=0;i<playlist_IDs.length;i++){
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

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Polling function for the myFrame1 element
function pollDOM () {
	var el = document.getElementById('myFrame1');
	
	if (el) {
		// Do something with el
	} else {
		setTimeout(pollDOM, 3000); // try again in 300 milliseconds
	}
}

function myFrame(){
	let div = document.createElement("div");
	let iframe = document.createElement("iFrame");
	div.appendChild(iframe);
	for(let i=0;i<2;i++){
		let textblip = document.createElement("span");
		div.appendChild(textblip);
	}
	div.classList.add("frame-wrapper");
	return div;
}

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
	// create the global player from the specific iframe (#video)
	player = [new YT.Player(myFrameHolder[0].children[0], {
			events: {
				// call this function when each player is ready to use
				'onReady': onPlayerReady,
				'onError': onPlayerError,
				'onAutoplayBlocked': onPlayerAutoplayBlocked,
				'onStateChange': onPlayerStateChange
			}
		}),	
		new YT.Player(myFrameHolder[1].children[0], {
			events: {
				'onReady': onPlayerReady2,
				'onError': onPlayerError2,
				'onAutoplayBlocked': onPlayerAutoplayBlocked,
				'onStateChange': onPlayerStateChange
			}
		}),	
		new YT.Player(myFrameHolder[2].children[0], {
			events: {
				'onReady': onPlayerReady4,
				'onError': onPlayerError4,
				'onAutoplayBlocked': onPlayerAutoplayBlocked,
				'onStateChange': onPlayerStateChange
			}
		}),
		new YT.Player(myFrameHolder[3].children[0], {
			events: {
				'onReady': onPlayerReady8,
				'onError': onPlayerError8,
				'onAutoplayBlocked': onPlayerAutoplayBlocked,
				'onStateChange': onPlayerStateChange
			}
		})
	];
}

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

const onPlayerErrorCodes = {
	'Error': "Unidentified Error. Error message is not encoded in this script yet. Visit https://developers.google.com/youtube/iframe_api_reference#Events for more information",
	2: "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.",
	5: "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.",
	100: "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.",
	101: "The owner of the requested video does not allow it to be played in embedded players.",
	150: "This error is the same as 101. The owner of the requested video does not allow it to be played in embedded players.",
	153: "The request does not include the HTTP Referer header or equivalent API Client identification. See API Client Identity and Credentials for more information}"
}
function onPlayerError(event) {
	console.error("Player1 is in error code:",event.data,onPlayerErrorCodes[event.data] ?? onPlayerErrorCodes['Error'],event.target);
//	player[0].nextVideo();
	timeUpdate();
}

function onPlayerError2(event) {
	console.error("Player2 is in error code:",event.data,onPlayerErrorCodes[event.data] ?? onPlayerErrorCodes['Error'],event.target);
//	player[1].nextVideo();
	timeUpdate();
}

function onPlayerError4(event) {
	console.error("Player4 is in error code:",event.data,onPlayerErrorCodes[event.data] ?? onPlayerErrorCodes['Error'],event.target);
//	player[2].nextVideo();
	timeUpdate();
}

function onPlayerAutoplayBlocked(event) {
	console.error("Youtube Embed Player has autoplay blocked. Click on the player to verify you are a human.",event);
//	player[3].nextVideo();
	timeUpdate();
}

function onPlayerError8(event) {
	console.error("Player8 is in error code:",event.data,onPlayerErrorCodes[event.data] ?? onPlayerErrorCodes['Error'],event.target);
//	player[3].nextVideo();
	timeUpdate();
}

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        // Direct access to the parent's function
        if (window.parent.activateUIControls) {
            window.parent.activateUIControls();
        }
    }
}


// Main update loop
function looper(){
	if(running !== hidePlayerInt){ timeUpdate(); return; }
	let hidePlayerBin = int2bin(hidePlayerInt,playlist_IDs.length);
	/* // LS version commented, now uses sharedWorker outside of looper
	for(let i=0;i<storageArray.length;i++){
		const rawLs = localStorage.getItem(storageArray[i]);
		if(!rawLs) continue;
		if(lastReadState_LS[i] && lastReadState_LS[i] == rawLs) continue; // breaks loop if BOTH ls has history AND ls matches ls history
		const ls = JSON.parse(rawLs);
		if(!lastReadState_LS[i] && rawLs){
			lastReadState_LS[i] = rawLs;
			console.log("Set " + i + " to", lastReadState_LS[i]);
			lastReadState_LS[i].Expire = lastReadState_LS[i].Expire%100000000 - 20;
		}

		
		// adSense disable function, triggers every tick ad is detected from the previous tick
				if(adSense[i]){if(adSense[i] == 1){adSense[i]++;}else if(muteMaster[i]==0){player[i].unMute(); adSense[i]=0;}}
		// if request sent, request is either skimState or new, and request sent to a loaded player
		if(ls && (ls.Buttons.skimState != 0 || ls.Expire%100000000!=lastReadState_LS[i].Expire%100000000) && hidePlayerBin.charAt(playlist_IDs.length - i - 1) == "1"){
			console.log(lastReadState_LS[i], ls, ls.Expire%100000000, lastReadState_LS[i].Expire%100000000, Date.now()%100000000); // Background Debugging purposes
			if(Date.now()>ls.Expire){
				//localStorage.removeItem(storageArray[i]);
			}
	// API calls
			muteMaster = processAPIcalls(i,ls,player,muteMaster)
		}
		thisReadState[i] = rawLs;
	}*/
	// edit span Text
/*	let showPlayerCount = 0;
	for(let i=0;i<playlist_IDs.length;i++){
		showPlayerCount += parseInt(hidePlayerBin.charAt(i));
	} */
	var vid2ls_dif=false;
	for(let i=0;i<playlist_IDs.length;i++){
/*		const currentState = player[i].getPlayerState();

        // CHECK IF PAUSED
        if (currentState === YT.PlayerState.PAUSED) {
            if (!isPaused[i]) {
                isPaused[i] = true;
                pauseStartTime[i] = Date.now();
            }
            
            // If paused for more than 30 seconds, stop processing this player entirely
            if (Date.now() - pauseStartTime[i] > 30000) {
                continue; 
            }
        }

        // RESET ON PLAY
        if (currentState === YT.PlayerState.PLAYING && isPaused[i]) {
            console.log(`Player ${i} resumed. Performing Memory Reset.`);
            isPaused[i] = false;
            lastStatusBar[i] = ""; // Force a clean redraw
            lastSavedMetadata[i] = ""; 
            // This prevents the script from trying to "catch up" on 30 minutes of missed math
        }
		*/
		
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
					if(duration*currentBufferFrac-currentTime < -0.2 || bufferTime > 700){
						// Definite ad detected, muted player and send request to unmute from volumeState above
						adSense[i] = 1;
						player[i].mute();
					}
				}
			}
			let currentVolume = player[i].getVolume();
			if(myFrameHolder[i].children[1].innerText!==myFrameHolder[i].children[0].title){
				myFrameHolder[i].children[1].innerText = myFrameHolder[i].children[0].title;
			}
			let prevIndex=null,nextIndex=null,thisIndex=null;
			if(player[i].getPlaylistIndex()>1){
				prevIndex = player[i].getPlaylist()[player[i].getPlaylistIndex()-1];
				}
			if(player[i].getPlaylist() && player[i].getPlaylistIndex()<player[i].getPlaylist().length){
				nextIndex = player[i].getPlaylist()[player[i].getPlaylistIndex()+1]
			}
			thisIndex = player[i].getPlaylist()[player[i].getPlaylistIndex()]
			//vid2ls[i] = [myFrameHolder[i].children[0].title.slice(0,63),prevIndex,nextIndex,player[i].getPlaylistIndex()];
			vid2ls[i] = {
				title:myFrameHolder[i].children[0].title.slice(0,127),
				prevIndex:prevIndex,
				nextIndex:nextIndex,
				thisIndex:thisIndex,
				indexValue:player[i].getPlaylistIndex(),
				//qualities: player[i].getAvailableQualityLevels()} //Not changable in current version
				playerTime: Math.floor(currentTime)};

			if(!isEqual(vid2ls[i],vid2ls_old[i])){
				vid2ls_dif = true;
			}
			let spaceCount = Math.max(1, Math.floor(23 * Math.log(0.065 * bufferTime + 1)));
			let aspace = " ".repeat(spaceCount); // = alt+1279
			let newStatusBar = timeFormat(currentTime) + " / " + timeFormat(duration) + " " + prefix + " " + aspace + " " + player[i].getVolume() + "% (" + timeFormat(bufferTime,false) + ")";

			// 2. CRITICAL MEMORY SAVER: Only touch DOM if text changed
			if(lastStatusBar[i] !== newStatusBar) {
				myFrameHolder[i].children[2].innerText = newStatusBar;
				lastStatusBar[i] = newStatusBar;
			}    //			console.log("."+aspace+".",myFrameHolder[i].children[2].innerHTML,timeFormat(duration) + " " + aspace + " (" + timeFormat(Math.max(0,duration*currentBuffer-currentTime),false));

			// Video Looper
			if(replayMaster[i] == 1 
				&& player[i].getVideoLoadedFraction() > 0.999
				&& duration-currentTime <= 30){player[i].seekTo(0); /*console.log("1",i);*/}
		}
	}
	if (vid2ls_dif) {
        updateLocalStorage("buttons_titles", vid2ls, 15);
		console.log("Site-V: Broadcasting titles to Worker...");
	}

    // FIX: Create a real copy, not just a reference
    vid2ls_old = structuredClone(vid2ls); 

    lastReadState_LS = [...thisReadState]; // Use spread operator to clone this array too
    timeUpdate();
    return;
}

function timeUpdate(){
	var refresh=200; // Refresh rate in milli seconds
	clearTimeout(window.looperTimer);
	mytime=setTimeout(looper,refresh,lastReadState_LS)
}		

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

function processAPIcalls(i, ls, player, muteMaster) {
    const buttons = ls.Buttons; // Shortcut for readability

    // playState
    if (buttons.playState === 1) { player[i].playVideo(); }
    else if (buttons.playState === 0) { player[i].stopVideo(); }
    else if (buttons.playState === 2) { player[i].pauseVideo(); }

    // skimState
    if (buttons.skimState !== 0) {
        var currentTime = player[i].getCurrentTime();
        player[i].seekTo(currentTime + buttons.skimState, true);
        player[i].pauseVideo();
    }

    // timeJumpTo_sec
    if (buttons.timeJumpTo_sec >= 0) {
        player[i].seekTo(buttons.timeJumpTo_sec, true);
    }

    // volumeState
    player[i].setVolume(buttons.volState);

    // isMuted
    if (buttons.isMuted) {
        player[i].mute();
        muteMaster[i] = 1;
    } else {
        player[i].unMute();
        muteMaster[i] = 0;
    }

    // playbackSpeedState
    if (buttons.playbackSpeedState !== player[i].getPlaybackRate()) {
        player[i].setPlaybackRate(buttons.playbackSpeedState);
    }

    // skipState - The Worker trigger ensures this only runs ONCE per click
    if (buttons.skipState === -1) {
        player[i].previousVideo();
    } else if (buttons.skipState === 1) {
        player[i].nextVideo();
    }

    // Replay initiate
    replayMaster[i] = buttons.replayBool;

    // hidePlayerDynamic
    if (buttons.hiddenBool) {
        myFrameHolder[i].classList.add('hidden');
    } else {
        myFrameHolder[i].classList.remove('hidden');
    }

    return muteMaster;
}

/**
 * Site-V logic for when Site-B clicks a button
 */
let lastProcessedExpire = [0, 0, 0, 0]; // Track the timestamp for each player (1, 2, 4, 8)

window.onWorkerMessageReceived = function(key, data) {
    if (key.includes("YT_Player_")) {
        const playerNum = parseInt(key.split("_")[2]);
        const idxMap = {1:0, 2:1, 4:2, 8:3}; 
        const i = idxMap[playerNum];

        // CHECK: Is this a NEW message or a duplicate?
        if (data.Expire !== lastProcessedExpire[i]) {
            lastProcessedExpire[i] = data.Expire; // Update the "Last Seen" timestamp
            
            if (player[i]) {
                muteMaster = processAPIcalls(i, data, player, muteMaster);
                console.log(`Action executed for Player ${playerNum} via Worker.`);
            }
        }
    }
};

// Inside your looper, Site-V sends data back to Site-B:
// updateLocalStorage("buttons_titles", vid2ls, 15);
