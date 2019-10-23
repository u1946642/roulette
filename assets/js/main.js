//Constants
var MIN_TIME = 10000;
var MAX_RANDOM = 10000;

//Variables
var velocity;
var nPeriod;
var stop = 0;
var i = 0;
var number = 0;
var color = "green";


function startRoulette(){
stop = 0;
var numbers = document.querySelectorAll('.roulette-number');
var endTime = Math.random()*MAX_RANDOM+MIN_TIME;
nPeriod = 5;
velocity = 50;
//Reduir la velocitat a mesura que s'acosta al final
var reduce = setInterval(function(){reduceVelocity();},endTime/7);
//Aturar la ruleta
setTimeout(function(){
	stop=1;
	var shakeEl = numbers[i];
	shakeEl.classList.add("shake");
	shakeEl.classList.add("grow");
	setTimeout(function(){
		shakeEl.classList.remove("shake");
		shakeEl.classList.remove("grow");
	},1500);
	var chosenN = document.getElementById('chosenNumber');
	var chosenC = document.getElementById('chosenColor');
	chosenN.innerHTML = number;
	chosenC.innerHTML = color;
	clearInterval(reduce);
},endTime);
setTimeout(function(){spin(numbers)},200);
}
function spin(numbers){
	if(stop==0){
		numbers[i].classList.remove("active");
		numbers[(i+1)%numbers.length].classList.add("active");
		i=(i+1)%numbers.length;
		number = numbers[i].children[0].innerHTML;
		
		var colorList = numbers[i].className;
		if(colorList.indexOf('red')!=-1){
			color = "red";
		}else if(colorList.indexOf('black')!= -1){
			color = "black";
		}else{
			color = "green";
		}
	}
	setTimeout(function(){spin(numbers)},velocity);
}

function reduceVelocity(){
	velocity += 120/nPeriod;
	if(nPeriod > 1)nPeriod--;
	console.log(velocity);
}