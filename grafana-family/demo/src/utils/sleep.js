const sleep = (t) =>
    new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, t);
    });

module.exports = sleep;
