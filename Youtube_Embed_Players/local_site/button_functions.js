function buttonFlexGroup(i,icons,buttonsLocation){
	var tempInteger = pow(2,i-1);
	if(i==0){tempInteger = 0;}
	var div = document.createElement("div");
	div.classList.add("buttons","YT".concat(tempInteger));
	var title = document.createElement("p");
	title.innerHTML = array[0] + "_" + tempInteger;
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
	buttonFlexSubgroup(1,["play",	"pause","stop",	"prev",	"back",	"skip",	"next",	"mute"],icons,div,tempInteger);
	
	const inputarray = ["delay","speed","vol","time"]
	var intInput = [];
	for(let j=0;j<inputarray.length;j++){ // adds numerical inputs
		intInput[j] = document.createElement("input");
		intInput[j].type = "number";
		intInput[j].classList.add("textInput",inputarray[j] + "Value");
		intInput[j].id = inputarray[j] + "-value-" + tempInteger;
		intInput[j].style.marginRight = "1px";
//		intInput[j].onchange = function(){newTimeoutLength(i,this);}
		intInput[j].min = 0;
		intInput[j].value = 0;
		intInput[j].placeholder = inputarray[j];
		if(j == 1){
			intInput[j].max = 2;
			intInput[j].min = 0.25;
			intInput[j].step = 0.05;
			intInput[j].value = 1;
		} 
		if(j == 3){
			intInput[j].max = 600;
			intInput[j].step = .2;
		}
		if(j == 2){
			intInput[j].max = 100;
			intInput[j].value = 20;
			intInput[j].step = 5;
			if(i==-1){intInput[j].value = "";}
			div.insertBefore(intInput[j],div.lastChild.previousSibling.previousSibling);
		} else {
			if(i==-1){intInput[j].value = "";}
//			div.insertBefore(intInput[j],div.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling);
			div.appendChild(intInput[j]);
		}
	}
	buttonFlexSubgroup(9,["time"],icons,div,tempInteger);

	var timeReadOnly = document.createElement("p");
	timeReadOnly.innerHTML = "0:00:00";
	timeReadOnly.id = "time-value-READ_ONLY-" + tempInteger;
	timeReadOnly.style.width = "80px";
	timeReadOnly.classList.add("textInput","timeValue");
	div.insertBefore(timeReadOnly,div.lastChild);
	
	// group buttons by category in seperate divs
	var newDiv = document.createElement("div");
	var tempDiv = document.createElement("div");
	tempDiv.classList.add("buttonSubgroup");
	newDiv.appendChild(div.childNodes[0]);
	for(let j=0;j<3;j++){ // groups buttons
		tempDiv.appendChild(div.childNodes[0]);
	}
	newDiv.appendChild(tempDiv);
	var tempDiv = document.createElement("div");
	tempDiv.classList.add("buttonSubgroup");
	for(let j=0;j<4;j++){ // groups buttons
		tempDiv.appendChild(div.childNodes[0]);
	}
	newDiv.appendChild(tempDiv);
	var tempDiv = document.createElement("div");
	tempDiv.classList.add("buttonSubgroup");
	for(let j=0;j<2;j++){ // groups buttons
//		console.log(j,div,tempDiv)
		tempDiv.appendChild(div.childNodes[0]);
	}
	newDiv.appendChild(tempDiv);
	var tempDiv = document.createElement("div");
	tempDiv.classList.add("buttonSubgroup");
	for(let j=0;j<2;j++){ // groups buttons
//		console.log(j,div,tempDiv)
		tempDiv.appendChild(div.childNodes[0]);
	}
	newDiv.appendChild(tempDiv);
	var tempDiv = document.createElement("div");
	tempDiv.classList.add("buttonSubgroup");
	for(let j=0;j<3;j++){ // groups buttons
//		console.log(j,div,tempDiv)
		tempDiv.appendChild(div.childNodes[0]);
	}
	newDiv.appendChild(tempDiv);
	var tempDiv = document.createElement("div");
	tempDiv.classList.add("buttonSubgroup");
	if(i==0){
		buttonFlexSubgroup(10,["up",	"down"],icons,div,tempInteger);
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
	else{	buttonsLocation.insertBefore(newDiv,div.firstChild);}
	return intInput;
}

function buttonFlexSubgroup(indexOne,typeArray,icons,div,tempInteger){
	for(let j=0;j<typeArray.length;j++){
		var button = document.createElement("button");
		var type = typeArray[j];
		var text;
		button.innerHTML = icons[indexOne+j-1];
		if(type=="mute"||type=="time"){button.style.padding = "8px 5px 10px 10px";}
		if(type=="down"){button.style.top="19px";}

		if(type!="up"&&type!="down"){
			button.style.marginRight = "1px";
		}
		button.classList.add("button",type);
		button.id = array[j+indexOne] + "-" + tempInteger;
		div.appendChild(button);
		if(text){div.appendChild(text);}
		if(type=="mute"){}
	}	
}

// =============================================================================================

function newTimeoutLength(index,that){
	console.log("input " + index + " changed into " + that.value);
}

let last_ls_titlecards;
function looper(){
	//	console.log(JSON.parse(localStorage.getItem('YT_Player_1')));
	//	console.log(JSON.parse(localStorage.getItem('YT_Player_1')).Expire);
	let tempInteger = 1;
	const ls_titlecards = JSON.parse(localStorage.getItem("buttons_titles"));
	if(ls_titlecards){
		last_ls_titlecards = ls_titlecards;
	}
	for(let i=0;i<4;i++){
		let thisDiv = document.getElementById("buttonHost").children[1].children[i];
		const itemName = array[0] + "_" + tempInteger;
		const ls = JSON.parse(localStorage.getItem(itemName));
		if(ls && Date.now()>ls.Expire){
			localStorage.removeItem(itemName);
		}
		// Update title cards
		if(ls_titlecards && ls_titlecards.Contents[i] && ls_titlecards.Contents[i].length >= 1 && ls_titlecards.Contents[i] != "YouTube video player"){
			thisDiv.children[0].innerHTML = " ID = " + (ls_titlecards.Contents[i][3]+1) + " | " + ls_titlecards.Contents[i][0] ;
		} else if (ls_titlecards || thisDiv.children[0].innerHTML == "undefined" || thisDiv.children[0].innerHTML == ""){
			thisDiv.children[0].innerHTML = array[0] + "_" + tempInteger;				
		}
		
		// Hide buttons not used in video.html instance (assumes only one instance per browser)
		const ls_hidePlayerBin = JSON.parse(localStorage.getItem("buttons_html"));
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
	if(last_ls_titlecards && last_ls_titlecards.Contents.length > YT[0].playerIndex && last_ls_titlecards.Contents[YT[0].playerIndex-1] ){
		document.title =  "[" + (YT[0].playerIndex) + "] " + last_ls_titlecards.Contents[YT[0].playerIndex-1][0] + " ";
	}
	let playerCount = 4;
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
	if(thisDiv2.children[0].innerHTML.charAt(5)==' '){
		thisDiv2.children[0].innerHTML = thisDiv2.children[0].innerHTML.substring(0,5) + " " + thisDiv2.children[0].innerHTML.substring(8,99) //substring
	}


	const videos_html_ls = ["buttons_html","buttons_titles"];
	for(let i=0;i<videos_html_ls.length;i++){
		const itemName = videos_html_ls[i];
		const ls = JSON.parse(localStorage.getItem(itemName));
		if(ls && Date.now()>ls.Expire){
			localStorage.removeItem(itemName);
		}
	}
	// console.log(array);
	timeUpdate();
}
