const timer = () => {
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
