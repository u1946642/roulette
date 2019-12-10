let timer = 0;

const setTime = time => {
    timer = time;
    const interval = setInterval(() => {
        timer--;
        if (timer < 0) clearInterval(interval);
    }, 1000);
};
module.exports = {
    getTime: () => timer,
    setTimer: time => setTime(time)
};
