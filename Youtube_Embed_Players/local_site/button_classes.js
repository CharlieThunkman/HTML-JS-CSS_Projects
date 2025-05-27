class ButtonPanel { // IDs of buttons
	constructor(index, thisArray = [9], thisIntArray = [4]){
	// thisArray: storage, play, pause, stop, prev, back, skip, next, ismute, timeConfirm
	// thisIntArray: delay, speed, vol, timeValue
		this.playButton		= document.getElementById(thisArray[1]	+ "-" + index);
		this.pauseButton 	= document.getElementById(thisArray[2]	+ "-" + index);
		this.stopButton 	= document.getElementById(thisArray[3]	+ "-" + index);
		this.backButton 	= document.getElementById(thisArray[5]	+ "-" + index);
		this.skipButton 	= document.getElementById(thisArray[6]	+ "-" + index);
		this.prevButton 	= document.getElementById(thisArray[4]	+ "-" + index);
		this.nextButton 	= document.getElementById(thisArray[7]	+ "-" + index);

		this.volumeValue 	= document.getElementById(thisIntArray[2].id);
		this.isMuteButton 	= document.getElementById(thisArray[8]+ "-" + index);
		
		this.delayValue 	= document.getElementById(thisIntArray[0].id);
		this.speedValue 	= document.getElementById(thisIntArray[1].id);

		this.timeValue		= document.getElementById(thisIntArray[3].id);
		this.timeDisplay	= document.getElementById("time-value-READ_ONLY-" + index);
		this.timeButton 	= document.getElementById(thisArray[9]	+ "-" + index);


		this.p = 2; // play state (running / paused / stopped)
		this.n = 0; // tells which direction to seek in +- (and scale) (temp acceleration)
		this.s = 1; // perm time acceleration
		this.d = 0; // decay value
		this.v = 20; // volume control
		this.j = 0; // time jump
		this.confirm = false;
		this.isMuted = 0;
		this.currentIndex = 1;
		this.storage = thisArray[0] + "_" + index;
		
	//			console.log("May26Test", thisArray, index, this.isMuteButton,thisArray[9]	+ "-" + index);
	}
	setButtonLinks(){
		// bind events
		let that = this; // link all following requests to the requested call
		that.playButton.addEventListener("click", function() {
			that.p = 1;
//					player.playVideo(); // command sent to other URL
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
	
		that.pauseButton.addEventListener("click", function() {
			that.p = 2;
//					player.pauseVideo(); // command sent to other URL
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
	
		that.stopButton.addEventListener("click", function() {
			that.p = 0;
//					player.stopVideo(); // command sent to other URL
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		
		that.backButton.addEventListener("mousedown", function() {
			that.n = that.n-.75
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		
		that.backButton.addEventListener("mouseup", function() {
			that.n = 0
			if(that.nTime < Date.now()){
				console.log("Tapped instead of held, auto seeking 5 seconds.");
			}
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});		
		
		that.skipButton.addEventListener("mousedown", function() {
			that.n = that.n+.75
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		that.skipButton.addEventListener("mouseup", function() {
			that.n = 0
			if(that.nTime < Date.now()){
				console.log("Tapped instead of held, auto seeking 5 seconds.");
			}
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});	
		
		that.prevButton.addEventListener("click", function() {
			that.currentIndex = -1; // NEEDS RESET AFTER FUNCTION CALL, reset IN function call
//					player.playVideo(); // command sent to other URL
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
			//			});
//			.addEventListener("click", function() {
//				setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
//				setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex)}, that.d + 20);
		});		
		that.nextButton.addEventListener("click", function() {
			that.currentIndex = 1; // NEEDS RESET AFTER FUNCTION CALL, reset IN function call
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
//				that.currentIndex = 0;
		});	
		that.isMuteButton.addEventListener("mousedown", function() {
			that.isMuted = (that.isMuted + 1) % 2;
			let delta = that.updateMuteStatus(that.v,parseInt(that.volumeValue.value),that.isMuted);
			that.isMuted = delta[1];
			that.isMuteButton.innerHTML = delta[0];
			console.log("Muted:",that.isMuted,Date.now())
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		that.isMuteButton.addEventListener("mouseup", function() {
//				that.isMuted = 0
//				setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		that.volumeValue.addEventListener("change", function() {
			let delta = that.updateMuteStatus(parseInt(that.volumeValue.value),that.v,that.isMuted);
			that.v = Math.min(100, Math.max(0, that.volumeValue.value));
			that.volumeValue.value = that.v;
			that.isMuted = delta[1];
			that.isMuteButton.innerHTML = delta[0];
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		that.speedValue.addEventListener("change", function() {
			that.s = Math.min(2.5, Math.max(.25, that.speedValue.value));
			that.speedValue.value = that.s;
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		that.timeValue.addEventListener("change", function() {
			that.j = that.timeValue.value * 60;
			that.timeDisplay.innerHTML = timeFormat(that.j)
		});
		that.timeButton.addEventListener("click", function() {
			var old_d = that.d;
			that.d=0;
			that.currentIndex = 0;
			that.confirm = true;
			setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
			that.d = old_d;
			that.confirm = false;
		});
		that.delayValue.addEventListener("change", function() {
			that.d = that.delayValue.value * 1000;
			console.log("Delay value now " + that.d/1000 + " second(s)", that);
		});
	}
	
	updateMuteStatus(newVol, oldVol, isMuted){
		let icon;
//		console.log("in",newVol, oldVol, isMuted);
		if(isMuted == 0 || newVol > oldVol){ // unmute on volume increase
			icon = "🔊";
			isMuted = 0;
		} 
		if(isMuted == 1 || newVol == 0){ // muted
			isMuted = 1;
			icon = "🔇";
		}
//		console.log("out",newVol, oldVol, isMuted);
		return [icon, isMuted];
	}
	
	updateLocalStorage(playState,
						skimState = 0,
						playbackSpeedState = 1,
						volState = 20, 
						isMuted = 0,
						skipState = 0,
						timeJump = -1
						) {

		const buttons = {
		playState: playState,
		skimState: skimState,
		playbackSpeedState: playbackSpeedState,
		volState: volState,
		isMuted: isMuted,
		skipState: skipState,
		timeJumpTo_sec: timeJump
		};
//				const exp = (Date.now()+604800000); // Expire in a week
		const exp = (Date.now()+15000); // Expires in 15 seconds
		localStorage.setItem(this.storage, JSON.stringify({Buttons: buttons, Expire: exp}));
		this.currentIndex = 0;
//		console.log(buttons);
	}
	
} // exit class

class compoundButtonPanel extends ButtonPanel {
	constructor(index, thisArray = [11], thisIntArray = [4]){
		super(0, thisArray, thisIntArray);
		console.log(thisIntArray,thisArray);
		this.prevPlayer = document.getElementById(thisArray[10] + "-" + 0);
		this.nextPlayer = document.getElementById(thisArray[11] + "-" + 0);
		
		this.playerIndex = 1;
		this.storage = thisArray[0] + "_" + this.playerIndex;
	}
	setButtonLinksCompound(){
		this.setButtonLinks();
		let that = this;
		this.prevPlayer.addEventListener("click", function() {
			that.playerIndex -= 1;
			if(that.playerIndex<1){that.playerIndex = 4;}
			that.storage = that.storage.substring(0,that.storage.length-2) + "_" + pow(2,that.playerIndex-1);
//					setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
		this.nextPlayer.addEventListener("click", function() {
			that.playerIndex += 1;
			if(that.playerIndex>4){that.playerIndex = 1;}
			that.storage = that.storage.substring(0,that.storage.length-2) + "_" + pow(2,that.playerIndex-1);
//					setTimeout( function(){that.updateLocalStorage(that.p,that.n,that.s,that.v,that.isMuted,that.currentIndex,that.j,that.Confirm)}, that.d);
		});
	}
}
