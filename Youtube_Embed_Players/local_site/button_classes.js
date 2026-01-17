class ButtonPanel { // IDs of buttons
	constructor(index, config = {}, settings = {}) {
        /**
         * config: { storage, play, pause, stop, prev, back, skip, next, ismute, timeConfirm, replay, hide }
         * settings: { delayId, speedId, volId, timeId }
         */
        this.index = index;
        
        // Mapping elements using IDs from the config object
		this.playButton    = document.getElementById(`${config.play}-${index}`);
		this.pauseButton   = document.getElementById(`${config.pause}-${index}`);
		this.stopButton    = document.getElementById(`${config.stop}-${index}`);
		this.backButton    = document.getElementById(`${config.back}-${index}`);
		this.skipButton    = document.getElementById(`${config.skip}-${index}`);
		this.prevButton    = document.getElementById(`${config.prev}-${index}`);
		this.nextButton    = document.getElementById(`${config.next}-${index}`);
		this.isMuteButton  = document.getElementById(`${config.ismute}-${index}`);
		this.timeButton    = document.getElementById(`${config.timeConfirm}-${index}`);
		this.replayButton  = document.getElementById(`${config.replay}-${index}`);
		this.hideButton    = document.getElementById(`${config.hide}-${index}`);

		this.volumeValue   = document.getElementById(settings.volId);
		this.delayValue    = document.getElementById(settings.delayId);
		this.speedValue    = document.getElementById(settings.speedId);
		this.timeValue     = document.getElementById(settings.timeId);
		
		this.qualityButton = document.getElementById(`quality-dropdown-${index}`);
		this.timeDisplay   = document.getElementById(`time-value-READ_ONLY-${index}`);

        // Internal State
		this.p = 2; 	// play state (running / paused / stopped)
		this.n = 0; 	// tells which direction to seek in +- (and scale) (temp acceleration)
		this.s = 1; 	// perm time acceleration
		this.d = 0; 	// decay value
		this.v = 20; 	// volume control
		this.j = 0; 	// time jump
		this.re = 0; 	// replay boolean - skips back to beginning of video a few seconds before end
		this.h = 0; 	// hidden boolean - hides player, but keeps player running in background
		this.q = 4; 	// quality of video, 0 = auto, last 2 digits omited for conciesness
		this.confirm = false;
		this.isMuted = 0;
		this.currentIndex = 0;
		this.storageKey = `${config.storage}_${index}`;
		
	//			console.log("May26Test", thisArray, index, this.isMuteButton,thisArray[9]	+ "-" + index);
	}
	setButtonLinks(){
		// bind events
		this.playButton.addEventListener("click", () => {
            this.p = 1;
//					player.playVideo(); // command sent to other URL
            this.queueUpdate();
        });
	
		this.pauseButton.addEventListener("click", () => {
			this.p = 2;
//					player.pauseVideo(); // command sent to other URL
			this.queueUpdate();
		});
	
		this.stopButton.addEventListener("click", () => {
			this.p = 0;
//					player.stopVideo(); // command sent to other URL
			this.queueUpdate();
		});
		
		this.backButton.addEventListener("mousedown", () => {
			this.n = this.n-.75
			this.queueUpdate();
		});
		
		this.backButton.addEventListener("mouseup", () => {
			this.n = 0
			if(this.nTime < Date.now()){
				console.log("Tapped instead of held, auto seeking 5 seconds.");
			}
			this.queueUpdate();
		});		
		
		this.skipButton.addEventListener("mousedown", () => {
			this.n = this.n+.75
			this.queueUpdate();
		});
		this.skipButton.addEventListener("mouseup", () => {
			this.n = 0
			if(this.nTime < Date.now()){
				console.log("Tapped instead of held, auto seeking 5 seconds.");
			}
			this.queueUpdate();
		});	
		
		this.prevButton.addEventListener("click", () => {
			this.currentIndex = -1; // NEEDS RESET AFTER FUNCTION CALL, reset IN function call
//					player.playVideo(); // command sent to other URL
			this.queueUpdate();
			//			});
//			.addEventListener("click", () => {
//				this.queueUpdate();
//				setTimeout( function(){this.updateLocalStorage(this.p,this.n,this.s,this.v,this.isMuted,this.currentIndex)}, this.d + 20);
		});		
		this.nextButton.addEventListener("click", () => {
			this.currentIndex = 1; // NEEDS RESET AFTER FUNCTION CALL, reset IN function call
			this.queueUpdate();
//				this.currentIndex = 0;
		});	
		this.isMuteButton.addEventListener("mousedown", () => {
			this.isMuted = (this.isMuted + 1) % 2;
			let delta = this.updateMuteStatus(this.v,parseInt(this.volumeValue.value),this.isMuted);
			this.isMuted = delta[1];
			this.isMuteButton.innerHTML = delta[0];
			console.log("Muted:",this.isMuted,Date.now())
			this.queueUpdate();
		});
		this.replayButton.addEventListener("click", () => {
			this.re = (this.re + 1) % 2;
			this.replayButton.innerHTML = "→";
			this.replayButton.style.paddingRight = "10px";
			if(this.re){
				this.replayButton.innerHTML = "⟳";
			this.replayButton.style.paddingRight = "11px";
			}
			//console.log("Replay:",this.re,Date.now())
			this.queueUpdate();
		});
		this.hideButton.addEventListener("click", () => {
			this.h = (this.h + 1) % 2;
			this.hideButton.innerHTML = "👁️";
			//this.hideButton.style.paddingRight = "0px";
			if(this.h){
				this.hideButton.innerHTML = "🚫";
			//this.hideButton.style.paddingRight = "0px";
			}
			//console.log("Hide:",this.h,Date.now())
			this.queueUpdate();
		});
		this.isMuteButton.addEventListener("mouseup", () => {
//				this.isMuted = 0
//				this.queueUpdate();
		});
		this.volumeValue.addEventListener("change", () => {
			let delta = this.updateMuteStatus(parseInt(this.volumeValue.value),this.v,this.isMuted);
			this.v = Math.min(100, Math.max(0, this.volumeValue.value));
			this.volumeValue.value = this.v;
			this.isMuted = delta[1];
			this.isMuteButton.innerHTML = delta[0];
			this.queueUpdate();
		});
		this.speedValue.addEventListener("change", () => {
			this.s = Math.min(2.5, Math.max(.25, this.speedValue.value));
			this.speedValue.value = this.s;
			this.queueUpdate();
		});
		this.timeValue.addEventListener("change", () => {
			this.j = this.timeValue.value * 60;
			this.timeDisplay.innerHTML = timeFormat(this.j)
			console.log(that)
		});
		this.timeButton.addEventListener("click", () => {
			var old_d = this.d;
			this.d=0;
			this.currentIndex = 0;
			this.confirm = true;
			this.queueUpdate();
			this.d = old_d;
		});
		this.delayValue.addEventListener("change", () => {
			this.d = this.delayValue.value * 1000 * 60;
			console.log("Delay value now " + this.d/1000 + " minute(s)", that);
		});
	}
	
	updateMuteStatus(newVol, oldVol, isMuted) {
		let icon = (isMuted === 0 || newVol > oldVol) ? "🔊" : "🔇";
		let muteState = (isMuted === 1 || newVol === 0) ? 1 : 0;
		if (newVol > oldVol) muteState = 0; 
		return [icon, muteState];
	}
	
	queueUpdate() {
		// Use an arrow function to keep 'this' context without needing 'let that = this'
		setTimeout(() => this.updateLocalStorage(), this.d);
    }
	
	updateLocalStorage() {
		const timeJumpValue = this.confirm ? this.j : -1;

		const buttons = {
			playState: this.p,
			skimState: this.n,
			playbackSpeedState: this.s,
			volState: this.v,
			isMuted: this.isMuted,
			skipState: this.currentIndex,
			timeJumpTo_sec: timeJumpValue,
			replayBool: this.re,
			hiddenBool: this.h
		};

//				const exp = (Date.now()+604800000); // Expire in a week
		const exp = Date.now() + 15000; // 15 second expiry
		localStorage.setItem(this.storageKey, JSON.stringify({ Buttons: buttons, Expire: exp }));

		// Reset temporary states
		this.currentIndex = 0;
		this.confirm = false;
		console.log("Storage Updated", buttons);
	}
	
} // exit class

class compoundButtonPanel extends ButtonPanel {
    constructor(index, config = {}, settings = {}) {
        // Pass the index, config object, and settings object to the parent ButtonPanel
        // Note: Your original code passed '0' as the index to super
        super(0, config, settings);

        // Map the specific 'player' navigation buttons using the object keys
        this.prevPlayer = document.getElementById(`${config.prevPlayer}-0`);
        this.nextPlayer = document.getElementById(`${config.nextPlayer}-0`);
        
        this.playerIndex = 1;
        this.baseStorageName = config.storage; // Keep base name for easy updates
        
        // Initialize the unique storage key
        this.updateCompoundStorageKey();
    }

    /**
     * Updates the storage key based on the current playerIndex calculation.
     * Uses the pattern: baseName_2^(index-1)
     */
    updateCompoundStorageKey() {
        const calculatedIndex = Math.pow(2, this.playerIndex - 1);
        this.storageKey = `${this.baseStorageName}_${calculatedIndex}`;
        console.log("Storage Key Updated:", this.storageKey);
    }

    setButtonLinksCompound() {
        // Initialize the standard button listeners from the parent class
        this.setButtonLinks();

        // Previous Player Listener
        this.prevPlayer.addEventListener("click", () => {
            this.playerIndex -= 1;
            if (this.playerIndex < 1) {
                this.playerIndex = 4;
            }
            this.updateCompoundStorageKey();
            // If you want to trigger a save immediately after switching players:
            // this.queueUpdate(); 
        });

        // Next Player Listener
        this.nextPlayer.addEventListener("click", () => {
            this.playerIndex += 1;
            if (this.playerIndex > 4) {
                this.playerIndex = 1;
            }
            this.updateCompoundStorageKey();
            // this.queueUpdate();
        });
    }
}
