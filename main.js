"use strict";

let m = math

const sketch = function (p) {
    const W = 850;
    const H = 950;

    const D = 50;

    const Vmax = 5;

    const ARROW_UNIT = 10

    let dt = 1

    class Body {
        constructor(p, v) {
            this.p = p;
            this.d = D
            this.v = v;
        }

        toString = () => {
            return `${this.id}, p:${this.p}, v:${this.v}`
        }
    }

    let bodies = [];
    let config = 20;

    p.setup = () => {
        p.createCanvas(W, H);
        let d = 150;
        let diagDist = vec(D, 0)
        let down = vec(D, 0).rotate(p.PI / 6)
        let up = vec(D, 0).rotate(-p.PI / 6)

        switch (config) {
            case 1:
                //two hit one from both sides
                bodies = [
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(vec(-300 - D, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(2 * (300) + D, 0)), vec(-Vmax * 2, 0)),
                ]
                break;
            case 2:
                //two hit one from one side
                bodies = [
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(vec(-300, -D / 2)), vec(Vmax, 0)),
                    new Body(toScreen(vec(-300, D / 2)), vec(Vmax, 0)),
                ]
                break;
            case 3:
                // several groups
                bodies = [
                    new Body(
                        toScreen(multv(vec(-1, 1), d)),
                        vec(1, -1).normalize().mult(Vmax),
                    ),
                    new Body(
                        toScreen(multv(vec(-1, -1), d)),
                        vec(1, 1).normalize().mult(Vmax),
                    ),
                    new Body(
                        toScreen(multv(vec(1, -1), d)),
                        vec(-1, 1).normalize().mult(Vmax),
                    ),
                    new Body(
                        toScreen(multv(vec(1, 1), d)),
                        vec(-1, -1).normalize().mult(Vmax),
                    ),

                    new Body(
                        toScreen(multv(vec(-1, 2), d)),
                        vec(1 / p.sqrt(2), 0).mult(Vmax),
                    ),
                    new Body(
                        toScreen(multv(vec(1, 2), d)),
                        vec(-1 / p.sqrt(2), 0).mult(Vmax),
                    ),
                ];
                break;
            case 4:
                //one hits two static sequentially 
                bodies = [
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(vec(D, 0)), vec(0, 0)),
                    new Body(toScreen(vec(-D * 2, 0)), vec(Vmax, 0))
                ]
                break;
            case 5:
                //one hits one 
                bodies = [
                    new Body(toScreen(vec(-D * 5, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                ]
                break;
            case 6:
                //three collide in the center
                bodies = [
                    new Body(toScreen(vec(-200, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(200, 0)), vec(-Vmax, 0)),
                    new Body(toScreen(vec(-400 - D / 2, 0)), vec(Vmax * 2, 0))
                ]
                break;
            case 7:
                //one hits three static 
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, 0)), vec(0, 0).rotate(-p.PI / 3)),
                    new Body(toScreen(vec(0, D).rotate(p.PI / 6)), vec(0, 0)),
                    new Body(toScreen(vec(0, -D).rotate(-p.PI / 6)), vec(0, 0)),
                ]
                break;
            case 8:
                // symmetric towards center
                const N = 10;
                for (let i = 0; i < N; i++) {
                    let angle = p.TWO_PI / N * i
                    bodies.push(new Body(toScreen(vec(300, 0).rotate(angle)), vec(-Vmax, 0).rotate(angle)))
                }
                break;

            case 9:
                //three collide in the center
                bodies = [
                    new Body(toScreen(vec(0, -200)), vec(0, Vmax)),
                    new Body(toScreen(vec(200 + D, 0)), vec(-Vmax, 0)),
                    new Body(toScreen(vec(-400 - D, 0)), vec(Vmax * 2, 0))
                ]
                break;

            case 10:
                //assymetric
                bodies = [
                    new Body(toScreen(vec(-1.5 * d - D + 1, -5)), vec(1.5 * Vmax, 0)),
                    new Body(toScreen(vec(d + D, 0).rotate(-p.PI / 6).add(vec(0, 0))), vec(-Vmax, 0).rotate(-p.PI / 6)),
                    new Body(toScreen(vec(D + D / 2, 2 * d + D)), vec(0, -2.3 * Vmax)),
                    new Body(toScreen(vec(0, -d - D)), vec(0, Vmax)),
                    new Body(toScreen(vec(0, 1.3 * d).rotate(-p.PI / 6)), vec(0, -1.3 * Vmax).rotate(-p.PI / 6)),

                ]
                bodies = [
                    new Body(vec(372.5, 472), vec(7.5, 0)),
                    new Body(vec(472.63139720814365, 447.5), vec(-4.330127018922194, 2.4999999999999996)),
                    new Body(vec(500, 491.5), vec(0, -11.5)),
                    new Body(vec(425, 420), vec(0, 5)),
                    new Body(vec(426.25, 473.6291651245979), vec(-3.2499999999999987, -5.629165124598852)),
                ]
                break;

            case 11:
                //complicated
                bodies = [
                    new Body(vec(235, 577), vec(-0.5, 5)),
                    new Body(vec(288, 643), vec(-10.1, 10.5)),
                    new Body(vec(245, 668), vec(4, -0.6)),
                    new Body(vec(470, 270), vec(6.9, -13.7)),
                    new Body(vec(426, 252), vec(6.3, 3.6)),
                    new Body(vec(432, 204), vec(-0.8, 2.9)),
                    new Body(vec(478, 222), vec(-6.3, -5.7)),
                    new Body(vec(221, 625), vec(2.7, 5.9)),
                    new Body(vec(282, 594), vec(-3.6, 14.5)),
                    new Body(vec(328, 673), vec(-5.5, -1.9)),
                    new Body(vec(285, 698), vec(-1.3, -5.2)),
                    new Body(vec(505, 305), vec(-1.2, -8.2)),
                ]
                break;
            case 12:
                // 10-ball break
                let centralDist = rotv(diagDist, p.PI / 6).add(rotv(diagDist, -p.PI / 6))
                bodies = [
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(vec(D, 0).rotate(p.PI / 6)), vec(0, 0)),
                    new Body(toScreen(vec(D, 0).rotate(-p.PI / 6)), vec(0, 0)),
                    new Body(toScreen(vec(2 * D, 0).rotate(p.PI / 6)), vec(0, 0)),
                    new Body(toScreen(centralDist), vec(0, 0)),
                    new Body(toScreen(vec(2 * D, 0).rotate(-p.PI / 6)), vec(0, 0)),
                    new Body(toScreen(vec(3 * D, 0).rotate(-p.PI / 6)), vec(0, 0)),
                    new Body(toScreen(addv(centralDist, vec(D, 0).rotate(p.PI / 6))), vec(0, 0)),
                    new Body(toScreen(addv(centralDist, vec(D, 0).rotate(-p.PI / 6))), vec(0, 0)),
                    new Body(toScreen(vec(3 * D, 0).rotate(p.PI / 6)), vec(0, 0)),

                    new Body(vec(D, H / 2), vec(2 * Vmax, 0))

                ]
                break;

            case 13:
                //one hits two static in the middle
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, D).rotate(p.PI / 3)), vec(0, 0)),
                    new Body(toScreen(vec(0, -D).rotate(-p.PI / 3)), vec(0, 0)),
                ]
                break;

            case 14:
                //one hits two static asymmetric
                bodies = [
                    new Body(toScreen(vec(-2 * d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, D).rotate(p.PI / 3)), vec(0, 0)),
                    new Body(vec(352, 427), vec(0, 0)),
                ]
                break;

            case 15:
                //diamond
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(up), vec(0, 0)),
                    new Body(toScreen(down), vec(0, 0)),
                    new Body(toScreen(addv(down, up)), vec(0, 0)),
                ]
                break;
            case 16:
                // 9-ball break
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(up), vec(0, 0)),
                    new Body(toScreen(down), vec(0, 0)),
                    new Body(toScreen(addv(down, up)), vec(0, 0)),
                    new Body(toScreen(addv(up, up)), vec(0, 0)),
                    new Body(toScreen(addv(down, down)), vec(0, 0)),
                    new Body(toScreen(addv(up, up, down)), vec(0, 0)),
                    new Body(toScreen(addv(down, down, up)), vec(0, 0)),
                    new Body(toScreen(addv(down, down, up, up)), vec(0, 0)),
                ]
                break;
            case 17:
                // 6-ball break
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(up), vec(0, 0)),
                    new Body(toScreen(down), vec(0, 0)),
                    new Body(toScreen(addv(down, up)), vec(0, 0)),
                    new Body(toScreen(addv(up, up)), vec(0, 0)),
                    new Body(toScreen(addv(down, down)), vec(0, 0)),
                    new Body(toScreen(addv(up, up, up)), vec(0, 0)),
                    new Body(toScreen(addv(up, up, down)), vec(0, 0)),
                    new Body(toScreen(addv(down, down, down)), vec(0, 0)),
                    new Body(toScreen(addv(down, down, up)), vec(0, 0)),
                    new Body(toScreen(addv(up, up, up, up)), vec(0, 0)),
                    new Body(toScreen(addv(up, up, up, down)), vec(0, 0)),
                    new Body(toScreen(addv(up, up, down, down)), vec(0, 0)),
                    new Body(toScreen(addv(down, down, down, down)), vec(0, 0)),
                    new Body(toScreen(addv(down, down, down, up)), vec(0, 0)),

                ]
                break;
            case 18:
                // strange
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(vec(D, 0).rotate(-m.PI / 4)), vec(0, 0)),
                    new Body(toScreen(vec(D, 0).rotate(m.PI / 4)), vec(0, 0)),
                ]
                break;

            case 19:
                // simplified trange
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(D, 0).rotate(-m.PI / 4)), vec(0, 0)),
                    new Body(toScreen(vec(D, 0).rotate(m.PI / 4)), vec(0, 0)),
                ]
                break;

            case 20:
                // rel velocity after is greater than before
                bodies = [
                    new Body(toScreen(vec(-d, 0)), vec(Vmax, 0)),
                    new Body(toScreen(vec(0, 0)), vec(0, 0)),
                    new Body(toScreen(vec(0, D).rotate(p.PI / 6 - 0.1)), vec(0, 0)),
                    new Body(toScreen(vec(0, -D).rotate(-p.PI / 6 + 0.1)), vec(0, 0)),
                ]
                break;

            case 21:
                bodies = [
                    new Body(vec(275, 475), vec(5, 0)),
                    new Body(vec(425, 475), vec(0, 0)),
                    new Body(vec(474.30127018922195, 479), vec(0, 0)),
                    new Body(vec(512.3012701892219, 454), vec(0, 0)),
                    new Body(vec(513.6025403784439, 504), vec(0, 0)),
                    new Body(vec(554.6025403784439, 479), vec(0, 0)),
                    new Body(vec(602.6025403784439, 480), vec(0, 0)),

                ]
                break;

            default: break;
        }
        for (let i = 0; i < bodies.length; i++) {
            bodies[i].id = i;
        }
    }

    function resolveCollisions() {
        let collisions = detectCollisions(bodies);
        let choise = null
        for (let i = 0; i < collisions.length; i++) {
            let cur = collisions[i]
            let relv = cur.a.v.dist(cur.b.v);
            if (choise) {
                if (relv > 0 && cur.overlap > choise.overlap) {
                    choise = cur
                }
            } else {
                if (relv > 0)
                    choise = cur
            }
        }

        if (choise) {
            const { a, b, overlap } = choise
            let relv = a.v.dist(b.v);

            let stepback = overlap / relv;
            updateBodies(-stepback);

            let groups = getGroupsOfCollisions(collisions, bodies);
            showGroupsOfCollisions(groups)
            for (let i = 0; i < groups.length; i++) {
                let g = groups[i];
                resolveGroupOfCollisions(g);

                updateDebugInfo()
            }

            updateBodies(stepback);
        }
    }

    function updateDebugInfo(){
        let text = t_iter.toString()
        + ' ' + jk_iter
        + ' t: ' + p.round(_t, 7)
        + ' f: ' + p.round(f(_A, _b, _j, _t), 5)
        + ' f1: ' + p.round(f1(_A, _b, _j), 5)
        + '  >  ' + T_START
        + '  ' + T_MIN
        + '  /' + DIVISOR
        + '\n'
        document.getElementById('method').innerHTML = text
    }

    function showGroupsOfCollisions(groups) {
        if (groups.length > 0) {
            let text = ''
            groups.forEach((g, i) => {
                text += g.toString() + '\n'
            })
            document.getElementById('collisions').innerHTML = text
        }
    }

    function updateBodies(dt) {
        for (let i = 0; i < bodies.length; i++) {
            updateBody(bodies[i], dt);
        }
    }

    function updateBody(b, dt) {
        b.p = addv(b.p, multv(b.v, dt));
    }

    function drawMeta() {
        for (let i = 0; i < bodies.length; i++) {
            let b = bodies[i]
            drawArrow(b.p, multv(b.v, ARROW_UNIT), 'red', '', true)
            p.strokeWeight(1)
            p.stroke('black')
            p.textSize(18)
        }
    }

    function drawBody(b) {
        p.fill("black");
        p.noStroke();
        p.circle(b.p.x, b.p.y, D);
        p.fill("white");
        p.textSize(20);
        p.text(b.id, b.p.x, b.p.y);
    }

    function step() {
        updateBodies(dt);
        resolveCollisions();
    }

    let pause = true

    p.keyPressed = () => {
        if (p.keyCode === 80) {
            pause = !pause
        }
        if (p.keyCode === p.RIGHT_ARROW) {
            step()
        }
    }

    let isMovingBody = false
    let isMovingVelocity = false
    let mousePrevPos
    let affectedBody

    p.mousePressed = () => {
        for (let i = 0; i < bodies.length; i++) {
            let b = bodies[i]
            let mouse = vec(p.mouseX, p.mouseY)
            mousePrevPos = mouse
            if (mouse.dist(addv(b.p, multv(b.v, ARROW_UNIT))) < 10) {
                isMovingVelocity = true
                affectedBody = i
                break;
            } else if (mouse.dist(b.p) < D / 2) {
                isMovingBody = true
                affectedBody = i
                break;
            }
        }
    }

    p.mouseReleased = () => {
        isMovingBody = false
        isMovingVelocity = false
    }

    function updateTextarea() {
        let textarea = document.getElementById('bodies')
        let text = 'bodies = [\n'
        text = bodies.reduce((acc, b) => acc + `\tnew Body(vec(${b.p.x}, ${b.p.y}), vec(${b.v.x}, ${b.v.y})),\n`, text)
        text += ']'

        textarea.innerHTML = text
    }

    function rewind() {
        updateBodies(-40)
    }

    function reset() {
        p.setup()
    }

    let pause_button = document.getElementById("pause")
    pause_button.onclick = () => { pause = !pause }

    let step_button = document.getElementById("step")
    step_button.onclick = () => { step() }

    let rewind_button = document.getElementById("rewind")
    rewind_button.onclick = () => { rewind() }

    let reset_button = document.getElementById("reset")
    reset_button.onclick = function () { reset() }

    let reset_rewind_button = document.getElementById("reset_rewind")
    reset_rewind_button.onclick = function () { reset(); rewind() }

    let delta_t_input = document.getElementById("delta_t")
    delta_t_input.oninput = function () {
        let n = Number(delta_t_input.value)
        if (n) {
            dt = Number(delta_t_input.value)
        }
    }

    let config_input = document.getElementById("config")
    config_input.oninput = function () {
        let n = Number(config_input.value)
        if (n) {
            config = Number(config_input.value)
            p.setup()
        }
    }

    let clear_button = document.getElementById("clear")
    clear_button.onclick = () => { bodies = [] }

    let show_history = true

    let show_history_check = document.getElementById("show_history")
    show_history_check.onchange = function () {
        if (show_history_check.checked) {
            show_history = true
        } else {
            show_history = false
        }
    }

    function drawHistory() {
        let bodies_copy = []
        bodies.forEach(b => {
            let newBody = new Body(b.p, b.v)
            newBody.id = b.id
            bodies_copy.push(newBody)
        })

        for (let t = 0; t < 20; t++) {
            updateBodies(-2)

            p.stroke('black')
            p.strokeWeight(1)
            p.noFill()
            bodies.forEach(b => {
                p.circle(b.p.x, b.p.y, D);
            })

            let collisions = detectCollisions(bodies).reduce((acc, c) => acc.concat([c.a, c.b]), [])
            p.stroke('red')
            collisions.forEach(c => {
                p.circle(c.p.x, c.p.y, D);
            })
        }
        bodies = bodies_copy
    }

    p.draw = () => {
        p.background(220);
        if (!pause) {
            step()
        } else {
            let mouse = vec(p.mouseX, p.mouseY)
            if (isMovingVelocity) {
                let b = bodies[affectedBody]
                b.v = mouse.sub(b.p).div(ARROW_UNIT)
                updateTextarea()

            } else if (isMovingBody) {
                let mouseDiff = subv(mouse, mousePrevPos)
                bodies[affectedBody].p.add(mouseDiff)
                mousePrevPos = mouse
                updateTextarea()
            }

            if (show_history) {
                drawHistory()
            }
            let collisions = detectCollisions(bodies)
            let groups = getGroupsOfCollisions(collisions, bodies)
            showGroupsOfCollisions(groups)
        }

        for (let i = 0; i < bodies.length; i++) {
            drawBody(bodies[i]);
        }
        drawMeta()
    }

    let toScreen = (v) => p.createVector(W / 2, H / 2).add(v);

    function drawArrow(base, vec, myColor, name, drawMag = false) {
        p.push();
        p.stroke(myColor);
        p.strokeWeight(2);
        p.fill(myColor);
        p.translate(base.x, base.y);
        p.line(0, 0, vec.x, vec.y);
        p.rotate(vec.heading());
        let arrowSize = 7;
        p.translate(vec.mag() - arrowSize, 0);
        p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
        p.textSize(15);
        p.noStroke();
        p.rotate(-vec.heading());
        p.text(name, 0, -8);
        p.fill("white");
        if (drawMag) {
            p.text(p.round(vec.mag(), 2), 20, -8);
        }
        p.pop();
    }

};


const instance = new p5(sketch, 'canvas')
