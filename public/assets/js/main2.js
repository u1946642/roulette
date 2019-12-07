var socket = io.connect("http://localhost:3000", { forceNew: true });

socket.on("state", function(data) {
  console.log(JSON.parse(data));
  var state = JSON.parse(data);
  const numberCont = document.getElementById("winning-number");
  var randomInterval = setInterval(()=>{
    const n = Math.round(Math.random() * 36);
    numberCont.innerHTML =  n;
    numberCont.classList.remove("black");
    numberCont.classList.remove("green");
    numberCont.classList.remove("red");
    numberCont.classList.add(n==0?"green":(n%2==0)?"red":"black");
  },80);
  setTimeout(()=>{
    clearInterval(randomInterval);
    numberCont.innerHTML = state.number.number;
    numberCont.classList.remove("black");
    numberCont.classList.remove("green");
    numberCont.classList.remove("red");
    numberCont.classList.add(state.number.color);
  },5000);
  
});

window.setInterval(() => {
  var request = new XMLHttpRequest();
  const hostname =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;
  const apiPath = "/api/users";
  request.open("GET", hostname + apiPath, true);
  request.onload = () => {
    if (request.readyState === 4) {
      var data = JSON.parse(request.response);
      if (request.status >= 200 && request.status < 400) {
        console.log(data);
        //Si tot va bé recarregar llista d'usuaris
        const ul = document.getElementById("usersList");
        ul.innerHTML = "";
        data.users.forEach(element => {
          var li = document.createElement("li");
          li.appendChild(document.createTextNode(element.name));
          ul.appendChild(li);
        });
      } else {
        alert("Error: " + request.status);
      }
    }
  };
  request.send();
}, 8000);
