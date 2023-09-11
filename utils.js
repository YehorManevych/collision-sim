let vec = (x, y) => {
    return new p5.Vector(x, y);
}

let addv = function () {
    let sum = vec(0, 0)
    for (let i = 0; i < arguments.length; i++) {
        sum.add(arguments[i])
    }
    return sum
}

let rotv = p5.Vector.rotate;

let subv = p5.Vector.sub;

let multv = p5.Vector.mult;

p5.Vector.prototype.toString = function () {
    return `[${p.round(this.x)}, ${p.round(this.y)}]`
}

Array.prototype.max = function (f) {
    let r = null;
    this.forEach((x) => {
        if (r == null || f(x) > r) {
            r = x;
        }
    });
    return r;
};

Array.prototype.empty = function (f) {
    return this.length == 0;
};
