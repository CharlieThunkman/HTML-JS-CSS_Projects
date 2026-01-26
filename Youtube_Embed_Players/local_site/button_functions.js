function buttonFlexGroup(i,icons,buttonsLocation){
	var tempInteger = Math.pow(2,i-1);
	if(i==0){tempInteger = 0;}
	var div = document.createElement("div");
	div.classList.add("buttons","YT".concat(tempInteger));
	var title = document.createElement("p");
	title.innerHTML = buttonConfig.storage + "_" + tempInteger;
	if(i==-1){
		title.innerHTML = "OPTIONS TEMPLATE";
	}
	title.style.display = "flex";
	title.style.justifyContent = "center";
	title.style.margin = "0px";
	title.style.minWidth = "255px";
	div.appendChild(title);
	let tempVar00998642 = 0;
	if(tempInteger){tempVar00998642 = 2}
	
	// button Inputs (function)
	buttonFlexSubgroup(1,["play",	"pause","stop",	"prev",	"back",	"skip",	"next",	"mute"],div,tempInteger);
	
const inputarray = ["delay", "speed", "vol", "time"];
const settings = {}; // This is the object our Class will use

for (let j = 0; j < inputarray.length; j++) {
    const inputName = inputarray[j];
    const inputElement = document.createElement("input");
    const fullId = `${inputName}-value-${tempInteger}`;

    // 1. Set standard attributes
    inputElement.type = "number";
    inputElement.classList.add("textInput", `${inputName}Value`);
    inputElement.id = fullId;
    inputElement.style.marginRight = "1px";
    inputElement.min = 0;
    inputElement.value = 0;
    inputElement.placeholder = inputName;
    inputElement.step = 0.05;

    // 2. Add to our Settings Object
    // This maps 'delay' to 'delayId', 'speed' to 'speedId', etc.
    settings[`${inputName}Id`] = fullId;

    // 3. Specific Logic for Speed
    if (inputName === "speed") {
        inputElement.max = 2;
        inputElement.min = 0.25;
        inputElement.value = 1;
    } 

    // 4. Specific Logic for Jump To Time
    if (inputName === "time") {
        inputElement.max = 600;
        inputElement.step = 0.2;
    }

    // 5. Specific Logic for Volume
    if (inputName === "vol") {
        inputElement.max = 100;
        inputElement.value = 20;
        inputElement.step = 5;
        
        if (i === -1) inputElement.value = "";
        
        // Insert at specific position if volume
        div.insertBefore(inputElement, div.lastChild.previousSibling.previousSibling);
    } else {
        if (i === -1) inputElement.value = "";
        div.appendChild(inputElement);
    }
}

// Now you can pass 'settings' into your class!
// const panel = new ButtonPanel(tempInteger, buttonConfig, settings);
/*	// video Quality levels // THEORETICAL, broken since 2019
	var dropdown = document.createElement("select");
	dropdown.id = "quality-dropdown-" + tempInteger;
	dropdown.innerHTML = "";
	var ddoption = document.createElement("option")
	if(i!=-1){
		ddoption.textContent = "NULL";
	} else {
		ddoption.textContent = "Resolution";
	}
	ddoption.value = -1;
	dropdown.appendChild(ddoption)
	dropdown.classList.add("dropdown")
	dropdown.style.minWidth = 50
	div.insertBefore(dropdown,div.lastChild.previousSibling.previousSibling);
	*/

	buttonFlexSubgroup(9,["time","replay","hidden-player"],div,tempInteger);

	var timeReadOnly = document.createElement("p");
	timeReadOnly.innerHTML = "0:00:00";
	timeReadOnly.id = "time-value-READ_ONLY-" + tempInteger;
	timeReadOnly.style.width = "80px";
	timeReadOnly.classList.add("textInput","timeValue");
	div.insertBefore(timeReadOnly,div.lastChild.previousSibling);
	
	// group buttons by category in seperate divs
	var newDiv = document.createElement("div");
	newDiv.appendChild(div.childNodes[0]);
	let jGroups = [3,4,2,1,1,3,2];
	for(let k=0;k<jGroups.length;k++){
		var tempDiv = document.createElement("div");
		tempDiv.classList.add("buttonSubgroup");
		for(let j=0;j<jGroups[k];j++){ // groups buttons
	//		console.log(j,div,tempDiv)
			tempDiv.appendChild(div.childNodes[0]);
		}
		newDiv.appendChild(tempDiv);
	}
	if(i==0){
		buttonFlexSubgroup(12,["up",	"down"],div,tempInteger);
		text = document.createElement("p");
		text.style.margin = "5px 5px 12px 5px";
		text.innerHTML = "|";  
		div.appendChild(text);
		//text.classList.add("button");
	for(let j=0;j<3 && i==0;j++){ // groups buttons
//		console.log(j,div,tempDiv)
		tempDiv.appendChild(div.childNodes[0]);
	}
	newDiv.appendChild(tempDiv);
	}
	newDiv.classList.add("buttons","YT".concat(i));
	if(i){	buttonsLocation.appendChild(newDiv);}
	else{	buttonsLocation.insertBefore(newDiv,div.firstChildElement);}
	return settings;
}

/**
 * Generates button elements dynamically and appends them to a container.
 * * @param {number} startIndex - The starting index in CONTROLS_METADATA.
 * @param {Array} typeArray - CSS class types (e.g., ["mute", "time"]).
 * @param {HTMLElement} parentDiv - The container for the buttons.
 * @param {number} playerIndex - The index of the specific player instance.
 */
function buttonFlexSubgroup(startIndex, typeArray, parentDiv, playerIndex) {
    for (let j = 0; j < typeArray.length; j++) {
        // 1. Get the relevant metadata for this specific button
        const metadataIndex = startIndex + j;
        const metadata = CONTROLS_METADATA[metadataIndex];
        
        if (!metadata) {
            console.error(`No metadata found for index: ${metadataIndex}`);
            continue;
        }

        // 2. Create the button element
        const button = document.createElement("button");
        const type = typeArray[j];
        
        // 3. Use metadata for the icon
        button.innerHTML = metadata.icon;

        // 4. Use buttonConfig and metadata.name for the ID
        const baseId = buttonConfig[metadata.name];
        button.id = `${baseId}-${playerIndex}`;

        // 5. Styling Logic (keeping your existing layout logic)
        button.classList.add("button", type);

        // 6. Append to the DOM
        parentDiv.appendChild(button);
    }
}

// =============================================================================================

function newTimeoutLength(index,that){
	console.log("input " + index + " changed into " + that.value);
}

let last_ls_titlecards;
let ls_playerCount;
function looper(){
	//	console.log(JSON.parse(localStorage.getItem('YT_Player_1')));
	//	console.log(JSON.parse(localStorage.getItem('YT_Player_1')).Expire);
	let tempInteger = 1;
	let playerCount = 4;
	const ls_titlecards = JSON.parse(localStorage.getItem("buttons_titles"));
	const ls_hidePlayerBin = JSON.parse(localStorage.getItem("buttons_html"));
	if(ls_hidePlayerBin){	
		ls_playerCount = 0;
		for(let i=0; i<playerCount;i++){
			ls_playerCount += parseInt(ls_hidePlayerBin.Contents.charAt(4 - i - 1));
		}
	}
	if(ls_titlecards){
		last_ls_titlecards = ls_titlecards;
	}
	for(let i=0;i<playerCount;i++){
		let thisDiv = document.getElementById("buttonHost").children[1].children[i];
		const itemName = buttonConfig.storage + "_" + tempInteger;
		const ls = JSON.parse(localStorage.getItem(itemName));
		if(ls && Date.now()>ls.Expire){
			localStorage.removeItem(itemName);
		}
		// Update title cards
		if(last_ls_titlecards && last_ls_titlecards.Contents[i] && last_ls_titlecards.Contents[i].thisIndex && last_ls_titlecards.Contents[i].title != "YouTube video player"){
			thisDiv.children[0].innerHTML = timeFormat(last_ls_titlecards.Contents[i].playerTime,0) + " ID = " + (last_ls_titlecards.Contents[i].indexValue+1) + " | " + last_ls_titlecards.Contents[i].title ;
		} else if (ls_titlecards || thisDiv.children[0].innerHTML == "undefined" || thisDiv.children[0].innerHTML == ""){
			thisDiv.children[0].innerHTML = buttonConfig.storage + "_" + tempInteger;				
		}
		
		// Hide buttons not used in video.html instance (assumes only one instance per browser)
		if(ls_hidePlayerBin && ls_hidePlayerBin.Contents.charAt(4 - i - 1) == "1"){ // if 1 is showing, indicated by EVEN number
			thisDiv.style.display = "block";
		} else if(ls_hidePlayerBin){
			thisDiv.style.display = "none";
		}

		tempInteger *= 2;
	}
	
	// Update compound player info
	if(YT[0]){
		let thisDiv = document.getElementById("buttonHost").children[0],
			clonDiv = document.getElementById("buttonHost").children[1].children[YT[0].playerIndex-1];
		thisDiv.children[0].innerHTML = "[" + (YT[0].playerIndex) + "] " + clonDiv.children[0].innerHTML + " ";
	}
	if(last_ls_titlecards && last_ls_titlecards.Contents.length >= YT[0].playerIndex && last_ls_titlecards.Contents[YT[0].playerIndex-1] ){
		document.title =  "[" + (YT[0].playerIndex) + "] " + last_ls_titlecards.Contents[YT[0].playerIndex-1].title + " ";
	} 
	for(let i=0;i<playerCount;i++){
		let thisDiv = document.getElementById("buttonHost").children[1].children[i];
		if(thisDiv.children[0].innerHTML.charAt(0)!=" "){
			thisDiv.children[0].innerHTML = "  " + thisDiv.children[0].innerHTML
		}
	}
	let thisDiv2 = document.getElementById("buttonHost").children[0];
	if(thisDiv2.children[0].innerHTML.charAt(0)!=" "){
			thisDiv2.children[0].innerHTML = "  " + thisDiv2.children[0].innerHTML
		
	}
//	if(thisDiv2.children[0].innerHTML.charAt(5)==' '){
//		thisDiv2.children[0].innerHTML = thisDiv2.children[0].innerHTML.substring(0,5) + " " + thisDiv2.children[0].innerHTML.substring(8,99) //substring
//	}


	const videos_html_ls = ["buttons_html","buttons_titles"];
	for(let i=0;i<videos_html_ls.length;i++){
		const itemName = videos_html_ls[i];
		const ls = JSON.parse(localStorage.getItem(itemName));
		if(ls && Date.now()>ls.Expire){
			localStorage.removeItem(itemName);
		}
	}
	
	// Resise Button elements
	
	const buttonClassElements = document.getElementsByClassName('buttons'); 
    for (let i = 0; i < buttonClassElements.length; i++) {
		if(document.body.clientWidth > 800 && ls_playerCount>1){
			buttonClassElements[i].classList.add('buttonsMaxWidth'); // Adds the new styles
			var maxWide = 3,
				minWidth = 290;
			if(document.body.clientWidth > maxWide*minWidth && (ls_playerCount-1)%maxWide > maxWide*(maxWide-1)/(1+ls_playerCount)){
				document.documentElement.style.setProperty('--buttonsMaxWidth', 'calc(33.3333% - 11px)'); // Changes the variable's value
			} else {
				document.documentElement.style.setProperty('--buttonsMaxWidth', 'calc(50% - 11px)'); // Changes the variable's value
			}
        } else {buttonClassElements[i].classList.remove('buttonsMaxWidth'); // Removes an old class
		}
        // buttonClassElements[i].classList.toggle('active'); // Toggles a class
	}
	// Check if exactly one player is active
	if (ls_hidePlayerBin && ls_playerCount === 1) {
		let activeIndex = -1;
		
		// Find the index of the '1' in the binary string
		// charAt(4 - i - 1) logic suggests 4 is the total possible players
		for (let i = 0; i < playerCount; i++) {
			if (ls_hidePlayerBin.Contents.charAt(4 - i - 1) === "1") {
				activeIndex = i; // This matches the 0-based index of your ls_titlecards.Contents
				break;
			}
		}
	
		// Overwrite the title and the YT[0] index to point to this single active player
		if (activeIndex !== -1 && last_ls_titlecards && last_ls_titlecards.Contents[activeIndex]) {
			const singleTitle = last_ls_titlecards.Contents[activeIndex].title;
			
			// Update the document title
			//document.title = "{" + (activeIndex + 1) + "} " + singleTitle + " ";
			
			// Sync YT[0] index so other functions know which player is the "primary"
			if (YT[0]) {
				YT[0].playerIndex = activeIndex + 1;
			}
		}
	}

	if(ls_playerCount == 1){
		let thisDiv = document.getElementById("buttonHost").children[0];
		thisDiv.classList.add('hide-button-panel');
	} else {
		let thisDiv = document.getElementById("buttonHost").children[0];
		thisDiv.classList.remove('hide-button-panel');
		
	}
	// console.log(array);
	timeUpdate();
}


(function() {
  // 1. Define your features here
  const features = [
    {
      label: 'BG Color',
      // Internal state specific to this feature
      colors: ['#ffffff', '#00000000', '#f0f0f0', '#222222', '#ffeb3b', '#2B2E38'],
      index: 0,
      action: function(btn) {
        const newColor = this.colors[this.index];
        console.log("Background is now", newColor);
        this.index = (this.index + 1) % this.colors.length;
        document.body.style.backgroundColor = newColor;
      }
    },
    {
      label: 'Opacity',
      opacity: 1,
      action: function(btn) {
        this.opacity = this.opacity === 1 ? 0.5 : 1;
        document.body.style.opacity = this.opacity;
      }
    },
    {
      label: 'Enable Scroll',
      isScrollEnabled: false,
      action: function(btn) {
        this.isScrollEnabled = !this.isScrollEnabled;
        document.body.style.overflow = this.isScrollEnabled ? 'auto' : 'hidden';
        btn.innerText = this.isScrollEnabled ? 'Disable Scroll' : 'Enable Scroll';
      }
    }
  ];

  // 2. Create the control panel
  const controls = document.createElement('div');
  controls.style.cssText = `
    position: fixed; top: -4px; right: -4px; z-index: 99999;
    display: flex; flex-direction: column; gap: 6px;
    background: rgba(0, 0, 0, 0.7); padding: 10px; border-radius: 25%;
  `;

  // 3. The Loop
  features.forEach(feature => {
    const btn = document.createElement('button');
    btn.innerText = feature.label;
    btn.style.cssText = 'padding: 2px; cursor: pointer; border: none; border-radius: 14px; font-weight: bold; font-size: xx-small;' ;
    
    // Bind the action to the feature object so 'this' works correctly
    btn.onclick = () => feature.action(btn);
    
    controls.appendChild(btn);
  });

  document.body.appendChild(controls);
})();
