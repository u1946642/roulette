var socket = io.connect("http://localhost:3000", { forceNew: true });

const hostname =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    window.location.port;

let tirada = 1;
let aposta = true;
const saldoEl = document.getElementById("balance");
const rouletteNumbers = document.getElementsByClassName("roulette-number");
var timeleft = 0;
var roundTimer;

//Rebem el nou número guanyador i actualizem l'estat de la partida
socket.on("state", function(data) {
    console.log(data);
    var state = JSON.parse(data);
    const numberCont = document.getElementById("winning-number");
    tirada = state.tirada;
    aposta = false;
    timeleft = parseInt(state.temps);
    if (roundTimer) clearInterval(roundTimer);
    roundTimer = setInterval(() => {
        timer();
    }, 1000);
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
        getMyBalance(false);
        aposta = true;
    }, 5000);
});

//Funció que actualitza la llista d'usuaris per tal de mostrar nous usuaris que han entrat a la partida
const refreshUsersList = () => {
    var request = new XMLHttpRequest();
    const apiPath = "/api/users";
    request.open("GET", hostname + apiPath, true);
    request.onload = () => {
        if (request.readyState === 4) {
            var data = JSON.parse(request.response);
            if (request.status >= 200 && request.status < 400) {
                //Si tot va bé recarregar llista d'usuaris
                const ul = document.getElementById("usersList");
                ul.innerHTML = "";
                data.users.forEach(element => {
                    var li = document.createElement("li");
                    if (element.id == sessionStorage.getItem("userId")) {
                        li.className = "actual";
                    }
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

//Funció que envia la aposta feta al servidor
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
                    getMyBalance(true);
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

//Obté la informació del saldo de l'usuari
const getMyBalance = isGrowing => {
    var request = new XMLHttpRequest();
    const apiPath = "/api/users/" + sessionStorage.getItem("userId") + "/saldo";
    request.open("GET", hostname + apiPath, true);
    request.onload = () => {
        if (request.readyState === 4) {
            var data = JSON.parse(request.response);
            if (request.status >= 200 && request.status < 400) {
                const saldoBef = parseInt(saldoEl.innerHTML);
                if (!isGrowing && saldoBef < parseInt(data.saldo)) {
                    $(saldoEl).addClass("win-balance");
                    setTimeout(() => {
                        $(saldoEl).removeClass("win-balance");
                        saldoEl.innerHTML = data.saldo;
                    }, 2000);
                } else {
                    saldoEl.innerHTML = data.saldo;
                }
            } else {
                alert("Error: " + request.status);
            }
        }
    };
    request.send();
};

//Obté el primer temporitzador, abans no s'ha rebut cap estat de la partida per part del servidor
const getFirstTime = () => {
    var request = new XMLHttpRequest();
    const apiPath = "/api/timer";
    request.open("GET", hostname + apiPath, true);
    request.onload = () => {
        if (request.readyState === 4) {
            var data = JSON.parse(request.response);
            if (request.status >= 200 && request.status < 400) {
                timeleft = parseInt(request.responseText);
                roundTimer = setInterval(() => {
                    timer();
                }, 1000);
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
        autoplaySpeed: 800,
        autoplay: true,
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true
                }
            }
        ]
    });
    refreshUsersList();
    window.setInterval(() => refreshUsersList(), 5000);
    getMyBalance(true);
});
