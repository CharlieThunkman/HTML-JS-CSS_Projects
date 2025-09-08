
//document.getElementById('ct1').innerHTML = "hello";
var data = []
table();
let index = 0;
var result;
var url = window.location.href;
if(getAllUrlParams(url)["index"]){
//	console.log(url)
//	var captured = /index=([^&]+)/.exec(url)[1]; // Value is in [1] ('384' in our case)
//	console.log(captured)
//	result = captured ? captured : 'index';
	index = (getAllUrlParams(url)["index"]);
//	console.log(getAllUrlParams(url),index)
} 
var indexC = document.getElementById("labelC");
indexC.value = index;
setInitialTime(indexC.value)
var stopPrev = 0

if(getAllUrlParams(url)["hideinput"]){
	indexC.remove();
} else {console.log(presets);}


function stopClock(){
	stopPrev=1;
}

function setInitialTime(lp){
	presets.sort(compareDates);
	while(new Date(new Date(presets[0][0]) - new Date()).getUTCFullYear()<1970){
		if(presets[0][2]){
			let temp = presets[0][2].shift();
			presets[0][2].push(temp);
			let newDate = moment(presets[0][0],"MMMM DD, YYYY HH:mm:ss").add(temp, 'days').format("MMMM DD, YYYY HH:mm:ss");
			console.log("Adjusting date to "+presets[0][1]+" by "+temp,newDate);
			presets[0][0] = newDate;
			presets.sort(compareDates);
			console.log(presets);
		} else {
			presets.shift();
		}
	}
	var now = new Date();
	var rem = new Date(new Date(presets[lp][0]) - now);
	var orig = new Date(presets[lp][0]);
	indexC.max = presets.length - 1;
//	console.log(rem.getUTCFullYear(),now,presets[lp][1],rem,rem.getUTCDate(),rem.getUTCHours(),rem.getMinutes(),rem.getSeconds());
	resetTime(rem.getUTCFullYear(),rem.getUTCMonth(),rem.getUTCDate()-1,rem.getUTCHours(),rem.getMinutes(),index,presets[lp][1],rem.getSeconds(),orig);
}

function newTimer(){
	stopClock()
	setInitialTime(indexC.value);
	console.log(indexC.value)
}

function getChildren(host,loop,label,timer){
	for(var i=0;i<host.children.length;i++){
		var space = "";
		for(var j=0;loop>j;j++){
			space = space + " ";
		}
		console.log(space,host.children[i],i)
		getChildren(host.children[i],loop+1,label,timer)
	}
	if (label.value==host.innerHTML&&host.id=="label"){
		console.log(host.parentNode.id,host.id,host.innerHTML,"-",host.value)
		host.parentNode.children[1].innerHTML = timer.value
		appendTable = false
	///} else {
	//	console.log(label,host.innerHTML)
	}
}

function resetTime(year,month,day, hour, minute,thisIndex,label,second=0,next=moment()){
	//var date = moment().add(day, "d").add(hour, "h").add(minute, "m").add(second, "s");
	var date = moment(next);
	
	// Update the count down every 1 second
	var x2 = "Welp... this failed";
	var lastDist;
	var x = setInterval(function() {
		// Get today's date and time
		var now = moment()
		var days = moment(next).diff(now,'days')
//		console.log(next,moment(next),now)
		var thisYear = now.year(),thisMillis = now.millisecond()
		date.subtract(thisYear, "y")
		now.subtract(thisYear, "y").subtract(thisMillis, "ms")
		// Find the distance between now and the count down date
		var distance = date - now;
		//var ddistance = moment(distance);if (lastDist!=Math.floor(distance/1000)){console.log(lastDist = Math.floor(distance/1000),ddistance.year());}
		date.add(thisYear,"y")
		// Time calculations for days, hours, minutes and seconds
		//var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000 );
		
		var timerID = 'timer0'
		var labelID = 'label0'
		let doctimer = document.getElementById(timerID);
		let doclabel = document.getElementById(labelID);
		// Output the result in an element with id="demo"
		// document.getElementById("ct1").innerHTML = days + "d " + hours + "h "  + minutes + "m " + seconds + "s ";
			
		doctimer.className = "ct1";
		doclabel.className = "ct2";
		// If the count down is over, write some text 
		if ((year<1970 || distance <= 0) && stopPrev == 1) { //1970 is moment.js first year, 
			stopPrev=0;
		}
		else if (year<1970 || distance <= 0 || stopPrev == 1) {
			clearInterval(x);
			console.log(date,now);
			doctimer.innerHTML = "Finished";
			//doctimer.className = "ct0";
			stopPrev=0;
		} else {
			//display the date
			x2 = days + "d " + hours + "h " +  minutes + "m " +  seconds + "s " //+ " " + ampm;
			doctimer.innerHTML = x2;
			doclabel.innerHTML = label;
			var array = [label,x2,thisIndex]
		}
	}, 200);
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
		
	// Creating and adding data to third row of the table
	let row_3 = document.createElement('tr');
	let row_3_data_1 = document.createElement('td');
	row_3_data_1.innerHTML = "2.";
	let row_3_data_2 = document.createElement('td');
	row_3_data_2.innerHTML = "Adam White";
	let row_3_data_3 = document.createElement('td');
	row_3_data_3.innerHTML = "Microsoft";
	
	row_3.appendChild(row_3_data_1);
	row_3.appendChild(row_3_data_2);
	row_3.appendChild(row_3_data_3);
	tbody.appendChild(row_3);
	
	table.appendChild(thead);
	table.appendChild(tbody);
	
	// Adding the entire table to the body tag
//	document.getElementById('body').appendChild(table);
}

function compareDates(a,b){
//	console.log(a[0],b[0])
	return (moment(a[0],"MMMM DD, YYYY HH:mm:ss")-moment(b[0],"MMMM DD, YYYY HH:mm:ss"))
}

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
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
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

