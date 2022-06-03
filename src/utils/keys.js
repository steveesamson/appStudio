


const Keys = {
    Enter: 13,
    Shift: 16,
    Tab: 9,
    Delete: 46,
    Escape: 27,
    LeftArrow: 37,
};

for (let i in Keys) {
    Keys['is' + i] = (function (compare) {
        return function (e) {
            return (e.keyCode || e.which) === compare;
        };
    })(Keys[i]);
}

export {Keys};