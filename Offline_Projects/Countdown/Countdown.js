
//document.getElementById('ct1').innerHTML = "hello";
var data = [[0,1],[2,3,4],[5,6]]
table();
var appendTable = true
let index = 0;
var url = window.location.href
console.log(url,presets)
var captured = /index=([^&]+)/.exec(url); // Value is in [1] ('384' in our case)
var result = captured[1] ? captured[1] : '0';
console.log(captured)
var indexC = document.getElementById("labelC");
indexC.value = result;
setInitialTime(indexC.value)
var stopPrev = 0

function setInitialTime(lp){
	presets.sort(compareDates);
	while(new Date(new Date(presets[0][0]) - new Date()).getUTCFullYear()<1970){
		presets.shift();
	}
	var now = new Date()
	var rem = new Date(new Date(presets[lp][0]) - now)
	console.log(presets)
	indexC.max = presets.length - 1
	console.log(rem.getUTCFullYear(),now,presets[lp][1],rem,rem.getUTCDate(),rem.getUTCHours(),rem.getMinutes(),rem.getSeconds())
	resetTime(rem.getUTCFullYear(),rem.getUTCMonth(),rem.getUTCDate()-1,rem.getUTCHours(),rem.getMinutes(),index,presets[lp][1],rem.getSeconds())
}

function newTimer(){
	stopClock()
	setInitialTime(indexC.value);
	console.log(indexC.value)
}

function activeTimer(newTimerVal = document.getElementById("timer"),newLabel = document.getElementById("label")){ // button or update old timer
	if(newLabel.value==""){newLabel.value="`~nULL~`";}
	console.log(newLabel.value)
	let newTable = document.getElementById("countdownTable")
	console.log(newTable)
	appendTable = true;
	var parentNode = []
	getChildren(newTable,1,newLabel,returned); // Can change appendTable bool
	if(appendTable){
		var secret = document.getElementById('secretValue').max
		secret = secret+1
		console.log(newLabel,newTimerVal)
		var datas = [newLabel.value,newTimerVal.value]
		console.log(datas)
		tableRow(secret,datas,newTable.children[1]) // index, input array, table body output
		newTable.appendChild(newTable.children[1]);
	}
	if(newLabel.value=="`~nULL~'"){newLabel.value="";}
}

function getChildren(host,loop,label,returner){
	for(var i=0;i<host.children.length;i++){
		var space = "";for(var j=0;loop>j;j++){space = space + " ";}console.log(space,host.children[i],i,"       - ",host)
		getChildren(host.children[i],loop+1,label,returner)
	}
	if (label==host.innerHTML&&host.id=="label"){
		console.log(host.parentNode.id,host.id,host.innerHTML,"-",host.value)
		//host.parentNode.children[1].innerHTML = returner.value // push input into the other sibling of host
		parentNode = host.parentNode
		appendTable = false
	///} else {
	//	console.log(label,host.innerHTML)
	}
}

function resetTime(year,month,day, hour, minute,thisIndex,label,second=0){
	var date = moment().add(day, "d").add(hour, "h").add(minute, "m").add(second, "s");
	// Update the count down every 1 second
	var x2 = "Welp... this failed";
	var lastDist;
	//getChildren(inputTable,1,label,returnLocation)
	var x = setInterval(function() {
		// Get today's date and time
		var now = moment()
		var thisYear = now.year(),thisMillis = now.millisecond()
		date.subtract(thisYear, "y")
		now.subtract(thisYear, "y").subtract(thisMillis, "ms")
		// Find the distance between now and the count down date
		var distance = date - now;
		var ddistance = moment(distance)
		if (lastDist!=Math.floor(distance/1000)){
			//console.log(lastDist = Math.floor(distance/1000),ddistance.year())
		}
		date.add(thisYear,"y")
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000 );
		appendTable = true;
		var parentNode = document.getElementById('countdownTable');
		console.log("---------------------------------------------")
		getChildren(parentNode,1,label,'null')
		//var data = []
		if(appendTable){
			var secret = document.getElementById('secretValue').max
			secret = parseInt(secret)+1
			var newTimerVal = document.getElementById("timer")
			console.log(secret,label,newTimerVal)
			let newTable = document.getElementById("countdownTable")
			datas = [label,newTimerVal.value]
			console.log(datas)
			tableRow(secret,datas,newTable.children[1]) // index, input array, table body output
			newTable.appendChild(newTable.children[1]);
			console.log(parentNode,parentNode.children[1],secret-1)
			parentNode = parentNode.children[1].children[secret-1]
		}
		console.log(appendTable) 	
		let doctimer = parentNode.children[1];
		let doclabel = parentNode.children[0];
		console.log(doctimer,doclabel)
		// Output the result in an element with id="demo"
		// document.getElementById("ct1").innerHTML = days + "d " + hours + "h "  + minutes + "m " + seconds + "s ";
			
		// If the count down is over, write some text 
		doctimer.className = "ct1";
		doclabel.className = "ct2";
		var success = false
		if ((year<1970 || distance <= 0) && stopPrev == 1) {
			stopPrev=0;
		}
		else if (year<1970 || distance <= 0 || stopPrev == 1) {
			clearInterval(x);
			console.log(date,now);
			doctimer.innerHTML = "Finished";
			//doctimer.className = "ct0";
			stopPrev=0;
		} else {
			x2 = days + "d " + hours + "h " +  minutes + "m " +  seconds + "s " //+ " " + ampm;
			doctimer.innerHTML = x2;
			doclabel.innerHTML = label;
			var array = [label,x2,thisIndex]
		//	for(var i=0;i<array.length;i++){
		//		if(array[i][1]==label&& success==false){
		//			data[i] = array;
		//		}
		//	}
			if(success==false){
				data.push(array);
			}
		}
	}, 5000);

}

function table(){
	let table = document.createElement('table');
	let thead = document.createElement('thead');
	let tbody = document.createElement('tbody');
	table.id = "countdownTable"
	
	// Creating and adding data to first row of the table
	let row_1 = document.createElement('tr');
	var heading = ["Sr. No.","Name","Company"]
	for(var i=0;i<heading.length;i++){
		let heading_1 = document.createElement('th');
		heading_1.innerHTML = heading[i];
		row_1.appendChild(heading_1);
	}
	thead.appendChild(row_1);
	for(var j=0;j<data.length;j++){ //How many sub-arrays
		tableRow(j,data[j],tbody)
		var secret = document.getElementById('secretValue')
		secret.max = j
		console.log(data,secret,secret.max)
	}
	
	table.appendChild(thead);
	table.appendChild(tbody);
	document.getElementById('table').appendChild(table);
}

function tableRow(j,datas,tbody){
	var row_2 = document.createElement('tr');
	//var data_1 = ["1.","James Clerk","Netflix"]
	for(var i=0;i<2;i++){ //	for(var i=0;i<data[j].length;i++){ // How many elements in sub-array
		row_2.id = j
		let row_2_data_1 = document.createElement('tr');
		if (datas.length>i){
			row_2_data_1.innerHTML = datas[i];
			var labelType = ['label','timer']
			row_2_data_1.id = labelType[Math.sign(i)]
		} else { row_2_data_1.innerHTML = "";}
		var format = ["ct2","ct1"]
		row_2_data_1.className = format[Math.sign(i)];
		row_2.appendChild(row_2_data_1);
	}
	tbody.appendChild(row_2);
}

function stopClock(){
	stopPrev=1;
}

function compareDates(a,b){
	console.log(a[0],b[0])
	return (moment(a[0])-moment(b[0]))
}