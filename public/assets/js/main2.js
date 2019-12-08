var socket = io.connect("http://localhost:3000", { forceNew: true });

const hostname =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;

let tirada = 0;
let aposta = true;
const saldoEl = document.getElementById("balance");
const rouletteNumbers = document.getElementsByClassName("roulette-number");
var timeleft = 0;
var roundTimer;

socket.on("state", function(data) {
    console.log(JSON.parse(data));
    var state = JSON.parse(data);
    const numberCont = document.getElementById("winning-number");
    tirada = state.tirada;
    aposta = false;
    timeleft = parseInt(state.temps);
    if(roundTimer)clearInterval(roundTimer);
    roundTimer = setInterval(()=>{timer()}, 1000);
    var randomInterval = setInterval(() => {
        const n = Math.round(Math.random() * 36);
        numberCont.innerHTML = n;
        numberCont.classList.remove("black");
        numberCont.classList.remove("green");
        numberCont.classList.remove("red");
        numberCont.classList.add(
            n == 0 ? "green" : n % 2 == 0 ? "red" : "black"
        );
    }, 80);
    setTimeout(() => {
        clearInterval(randomInterval);
        numberCont.innerHTML = state.number.number;
        numberCont.classList.remove("black");
        numberCont.classList.remove("green");
        numberCont.classList.remove("red");
        numberCont.classList.add(state.number.color);
        eliminarApostes();
        aposta = true;
    }, 5000);
});

const refreshUsersList = () => {
    var request = new XMLHttpRequest();
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
};

Array.from(rouletteNumbers).forEach(element => {
    element.onclick = () => {
        if (aposta) {
            var quantity = document.getElementById("quantity").value;
            var request = new XMLHttpRequest();
            const apiPath =
                "/api/users/" + sessionStorage.getItem("userId") + "/aposta";
            request.open("POST", hostname + apiPath, true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.status === 201) {
                    getMyBalance();
                    afegirAposta(element.innerText, quantity);
                } else if (request.readyState === 4 && request.status === 400) {
                    alert(request.responseText);
                }
            };
            var data = JSON.stringify({
                tirada: tirada,
                number: element.innerText,
                quantity: quantity
            });
            request.send(data);
        }
    };
});

const getMyBalance = () => {
    var request = new XMLHttpRequest();
    const apiPath = "/api/users/" + sessionStorage.getItem("userId") + "/saldo";
    request.open("GET", hostname + apiPath, true);
    request.onload = () => {
        if (request.readyState === 4) {
            var data = JSON.parse(request.response);
            if (request.status >= 200 && request.status < 400) {
                saldoEl.innerHTML = data.saldo;
            } else {
                alert("Error: " + request.status);
            }
        }
    };
    request.send();
};

$(document).ready(function() {
    getFirstTime();
    $(".carousel-bets").slick({
        infinite: true,
        slidesToShow: 5,
        autoplay: true,
        arrows: false
    });
    refreshUsersList();
    window.setInterval(() => refreshUsersList(), 5000);
    getMyBalance();
});

const getFirstTime = () => {
    var request = new XMLHttpRequest();
    const apiPath = "/api/timer";
    request.open("GET", hostname + apiPath, true);
    request.onload = () => {
        if (request.readyState === 4) {
            var data = JSON.parse(request.response);
            if (request.status >= 200 && request.status < 400) {
                timeleft = parseInt(request.responseText);
                roundTimer = setInterval(()=>{timer()}, 1000);
            } else {
                alert("Error: " + request.status);
            }
        }
    };
    request.send();
};

const timer = () => {
    console.log(timeleft);
    if (aposta) {
        document.getElementById("countdown").innerHTML = timeleft;
    }
    timeleft -= 1;
    if (timeleft < 0) {
        clearInterval(roundTimer);
        document.getElementById("countdown").innerHTML = "0";
    }
};

const afegirAposta = (number, quantity) => {
    $(".carousel-bets").slick(
        "slickAdd",
        '<div class="bet"><h3>' +
            number +
            "</h3><p>Qty:<span>" +
            quantity +
            '</span></p><div class="icon"></div></div>'
    );
};

const eliminarApostes = () => {
    let i = $(".carousel-bets .bet").length;
    while (i > 0) {
        $(".carousel-bets").slick("slickRemove", i - 1);
        i--;
    }
};
