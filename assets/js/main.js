var stop = 0;
var i = 0;
var number = 0;
var color = "green";
function startRoulette(){
stop = 0;
var numbers = document.querySelectorAll('.roulette-number');
var endTime = Math.random()*7000+10000;
numbers[i].style.border = "5px solid gold";
setTimeout(function(){
	stop=1;
	var chosenN = document.getElementById('chosenNumber');
	// var chosenC = document.getElementById('chosenColor');
	chosenN.innerHTML = number;
	// chosenC.innerHTML = color;
},endTime);
setTimeout(function(){spin(numbers)},500);
}
function spin(numbers){
	if(stop==0){
		numbers[i].style.border = "none";
		numbers[(i+1)%numbers.length].style.border = "5px solid gold";
		i=(i+1)%numbers.length;
		number = numbers[i].children[0].innerHTML;
		// console.log(numbers.item(i));
		// color = numbers[i].style.backgroundColor;
		
		setTimeout(function(){spin(numbers)},80);
	}
}