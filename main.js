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
                    new Body(toScreen(vec(0, D).rotate(p.PI/6-0.1)), vec(0, 0)),
                    new Body(toScreen(vec(0, -D).rotate(-p.PI/6+0.1)), vec(0, 0)),
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

    let drawDebug = [];

    function getN(collisions) {
        let N = m.zeros(2, collisions.length);
        for (let i = 0; i < collisions.length; i++) {
            let c = collisions[i];
            let n = subv(c.b.p, c.a.p).normalize();

            N.set([0, i], n.x);
            N.set([1, i], n.y);
        }
        return N;
    }

    function getK(collisions, n_bodies) {
        let Cm = m.zeros(n_bodies, collisions.length);
        collisions.forEach((c, i) => {
            Cm.set([c.a_group_id, i], -1);
            Cm.set([c.b_group_id, i], 1);
        });
        return Cm;
    }

    //rewrite using array of bodies in the group
    function getV(collisions, n_bodies) {
        let V = m.zeros(2, n_bodies);
        let filled_V = [];
        for (let i = 0; i < collisions.length; i++) {
            let c = collisions[i];
            if (!filled_V[c.a_group_id]) {
                V.set([0, c.a_group_id], c.a.v.x);
                V.set([1, c.a_group_id], c.a.v.y);
                filled_V[c.a_group_id] = true;
            }
            if (!filled_V[c.b_group_id]) {
                V.set([0, c.b_group_id], c.b.v.x);
                V.set([1, c.b_group_id], c.b.v.y);
                filled_V[c.b_group_id] = true;
            }
        }
        return V;
    }

    function getC(collisions) {
        let C = m.zeros(collisions.length, collisions.length);
        for (let i = 0; i < collisions.length; i++) {
            for (let j = i + 1; j < collisions.length; j++) {
                let c_r = collisions[i];
                let c_c = collisions[j];
                if (c_r.a_group_id == c_c.a_group_id) {
                    C.set([i, j], 1);
                } else if (c_r.b_group_id == c_c.b_group_id) {
                    C.set([i, j], 1);
                } else if (c_r.b_group_id == c_c.a_group_id) {
                    C.set([i, j], -1);
                }
            }
        }
        C = m.add(
            m.transpose(C),
            C,
            m.multiply(2, m.identity(collisions.length))
        );
        return C;
    }

    function g1(A, b, j) {
        return m.add(m.multiply(A, j), b);
    }

    function f1(A, b, j) {
        let g = g1(A, b, j);
        let r = m.multiply(m.transpose(j), g).get([0, 0]);
        return r;
    }

    function f(A, b, j, t) {
        let g = g1(A, b, j);
        let l = m.sum(m.add(m.log2(j), m.log2(g)));
        let r = m.multiply(m.transpose(j), g).get([0, 0]) - t * l;
        return r;
    }

    function f_alt(A, b, j, t) {
        let g = g1(A, b, j);
        let l = m.sum(m.log2(j));
        let r = m.multiply(m.transpose(j), g).get([0, 0]) - t * l;
        return r;
    }

    function df(A, b, j, t) {
        let r = m.subtract(
            g1(m.multiply(A, 2), b, j),
            m.multiply(
                t,
                m.add(
                    m.map(j, (e) => 1 / e),
                    m.multiply(
                        m.transpose(A),
                        m.map(g1(A, b, j), (e) => 1 / e)
                    )
                )
            )
        );
        return r;
    }

    
    function ddf(A, b, j, t) {
        let g = g1(A, b, j);

        let l = m.multiply(
            -1,
            m.add(
                m.diag(
                    m.diag(m.map(m.multiply(j, m.transpose(j)), (e) => 1 / e))
                ),
                m.multiply(
                    m.transpose(A),
                    m.diag(
                        m.diag(m.map(m.multiply(g, m.transpose(g)), (e) => 1 / e))
                    ),
                    A
                )
            )
        );
        let r = m.subtract(m.multiply(2, A), m.multiply(t, l));
        return r;
    }

    let t_iter = 0
    let jk_iter = 0


    const t_start = 1000
    const t_min = 0.000001
    const divisor = 2;

    function find_init_point(A, b) {
        let j_init = m.matrix(m.zeros(b.size()))
        let j = j_init

        while (true) {
            let g_max
            let g_i_max
            let g2_max
            let g2_i_max
            let s
            function calcS() {
                let g = m.multiply(g1(A, b, j), -1)
                //max element in g
                g_max = -Infinity
                g_i_max = 0
                g.forEach((e, i) => {
                    let row = i[0]
                    if (e > g_max) {
                        g_max = e
                        g_i_max = row
                    }
                });

                let g2 = m.multiply(j, -1)
                //max element if g2
                g2_max = -Infinity
                g2_i_max = 0
                g2.forEach((e, i) => {
                    let row = i[0]
                    if (e > g2_max) {
                        g2_max = e
                        g2_i_max = row
                    }
                });


                s = g_max > g2_max ? g_max : g2_max
                s += 0.1
            }
            calcS()
            if (s < 0) {
                return j
            }

            //decide whether to take the grad of g or g2
            let grad
            if (g_max > g2_max) {
                //find grad
                //g = -Aj - b
                //grad = row of A corresponding to the max element in g
                // grad = m.diag(m.multiply(A,-1)).reshape(b.size())
                let row = m.row(m.multiply(A, -1), g_i_max)
                //check if row is a matrix or just a number
                if (row.size) {
                    grad = row.reshape(b.size())
                } else {
                    grad = m.matrix([[row]])
                }
            } else {
                grad = m.matrix(m.zeros(j.size()))
                grad.set([g2_i_max, 0], -1)
            }
            let lambda = 1

            //to minimize s we should move against the gradient
            let step = m.multiply(grad, -lambda)

            j = m.add(j, step)
        }
    }

    function calcJ(A, b) {
        t_iter = 0
        jk_iter = 0
        let t = t_start
        let jk_start = find_init_point(A, b)
        let jk = jk_start;
        let t_too_small = false;
        let prevT = t;
        let result = { j: jk, t: t };
        while (!t_too_small && t > t_min) {
            while (true) {
                jk_iter += 1
                let jk1 = m.subtract(
                    jk,
                    m.multiply(m.inv(ddf(A, b, jk, t)), df(A, b, jk, t))
                );

                let collisionsN = m.size(b).get([0])

                m.reshape(jk1, [collisionsN]);
                m.reshape(jk, [collisionsN]);

                let j_diff = m.norm(m.subtract(jk1, jk));
                m.reshape(jk1, [collisionsN, 1]);
                m.reshape(jk, [collisionsN, 1]);
                let fv = f(A, b, jk1, t);
                if (isNaN(fv)) {
                    t_too_small = true;
                    result = { j: jk, t: prevT };
                    break;
                } else if (j_diff < 0.0001) {
                    result = { j: jk1, t: t };
                    break;
                }
                jk = jk1;
            }
            prevT = t;
            t = t / divisor;
            t_iter += 1
        }
        return result;
    }


    function detectCollisions() {
        let collisions = [];
        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                let a = bodies[i];
                let b = bodies[j];

                let overlap = D - a.p.dist(b.p)
                let epsilon = -0.00000000001
                if (overlap >= epsilon) {
                    collisions.push({
                        name: `${a.id}${b.id}`,
                        overlap: overlap,
                        a: a,
                        b: b,
                    });
                }
            }
        }
        return collisions;
    }


    function traverseSubgraph(node, neighbours_by_node, visited, edges, bodies_in_group) {
        visited[node] = true;
        let neighbours = neighbours_by_node[node];

        for (let j = 0; neighbours && j < neighbours.length; j++) {
            let n = neighbours[j];
            bodies_in_group[node] = true
            bodies_in_group[n] = true

            edges[node][n] = true
            edges[n][node] = true
            if (!visited[n]) {
                traverseSubgraph(n, neighbours_by_node, visited, edges, bodies_in_group);
            }
        }
    }

    class Collision {
        constructor(a_group_id, a, b_group_id, b) {
            this.name = a.id.toString() + b.id.toString()
            this.a_group_id = a_group_id
            this.a = a
            this.b_group_id = b_group_id
            this.b = b
        }
    }

    class CollisionGroup {
        constructor(collisions, n_bodies) {
            this.collisions = collisions
            this.n_bodies = n_bodies
        }

        toString = () => {
            return '[' + this.collisions.reduce((acc, x) => acc + x.name + ', ', '') + '] ' + this.n_bodies
        }
    }

    function getGroupsOfCollisions(collisions) {
        let neighbours_by_node = []
        bodies.forEach((_, i) => {
            neighbours_by_node[i] = [];
        })
        collisions.forEach((c, i) => {
            neighbours_by_node[c.a.id].push(c.b.id);
            neighbours_by_node[c.b.id].push(c.a.id);
        })


        let groups = [];
        let visited = [];
        for (let i = 0; i < bodies.length; i++) {
            if (!visited[i]) {
                let edges = []
                bodies.forEach((_, i) => edges[i] = [])

                let bodies_in_group = [];
                traverseSubgraph(i, neighbours_by_node, visited, edges, bodies_in_group);

                let edgesSorted = []
                bodies.forEach((_, i) => {
                    for (let j = i + 1; j < bodies.length; j++) {
                        if (edges[i][j]) {
                            edgesSorted.push({ a: i, b: j })
                        }
                    }
                })

                if (bodies_in_group.length > 0) {
                    let vacant_group_id = 0
                    let group_id_by_id = []
                    bodies_in_group.forEach((x, i) => {
                        if (x) {
                            group_id_by_id[i] = vacant_group_id
                            vacant_group_id += 1
                        }
                    })
                    let collisions = edgesSorted.map((e) => {
                        return new Collision(
                            group_id_by_id[e.a],
                            bodies[e.a],
                            group_id_by_id[e.b],
                            bodies[e.b]
                        )
                    });
                    groups.push(new CollisionGroup(
                        collisions,
                        bodies_in_group.filter(x => x).length));
                }
            }
        }
        return groups;
    }

    let _t
    let _A
    let _b
    let _j

    function resolveGroupOfCollisions(g) {
        const { collisions, n_bodies } = g;
        let N = getN(collisions);
        let V = getV(collisions, n_bodies);
        let K = getK(collisions, n_bodies);
        let C = getC(collisions, n_bodies);

        let Vrel = m.dotMultiply(N, m.multiply(V, K));

        let A = m.dotMultiply(m.multiply(m.transpose(N), N), C);
        _A = A
        let b = m.multiply(m.reshape(m.apply(Vrel, 0, m.sum), [collisions.length, 1]), 2);
        _b = b

        let { j, t } = calcJ(A, b)
        _t = t
        _j = j

        let newV = m.add(V, m.multiply(m.dotMultiply(m.transpose(m.concat(j, j)), N), m.transpose(K)))
        collisions.forEach(c => {
            let newVa_x = newV.get([0, c.a_group_id])
            let newVa_y = newV.get([1, c.a_group_id])
            c.a.v = vec(newVa_x, newVa_y)

            let newVb_x = newV.get([0, c.b_group_id])
            let newVb_y = newV.get([1, c.b_group_id])
            c.b.v = vec(newVb_x, newVb_y)
        })
    }


    function resolveCollisions() {
        let collisions = detectCollisions();
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

            let groups = getGroupsOfCollisions(collisions);
            showGroupsOfCollisions(groups)
            for (let i = 0; i < groups.length; i++) {
                let g = groups[i];
                resolveGroupOfCollisions(g);

                let text = t_iter.toString()
                    + ' ' + jk_iter
                    + ' t: ' + p.round(_t, 7)
                    + ' f: ' + p.round(f(_A, _b, _j, _t), 5)
                    + ' f1: ' + p.round(f1(_A, _b, _j), 5)
                    + '  >  ' + t_start
                    + '  ' + t_min
                    + '  /' + divisor
                    + '\n'
                document.getElementById('method').innerHTML = text
            }

            updateBodies(stepback);
        }
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
            // p.text(b.p.x + ', '+ b.p.y, b.p.x+D/2, b.p.y-D/2)
            p.textSize(18)
            // p.text(b.v.x + ', '+ b.v.y, b.p.x+D/2, b.p.y)
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
    clear_button.onclick = () => {bodies = []}

    let show_history = false

    let show_history_check = document.getElementById("show_history")
    show_history_check.onchange = function () {
        if(show_history_check.checked){
            show_history = true
        }else{
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

            let collisions = detectCollisions().reduce((acc, c) => acc.concat([c.a, c.b]), [])
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

            if(show_history){
                drawHistory()
            }
            let collisions = detectCollisions()
            let groups = getGroupsOfCollisions(collisions)
            showGroupsOfCollisions(groups)
        }

        for (let i = 0; i < bodies.length; i++) {
            drawBody(bodies[i]);
        }
        drawMeta()
        drawDebug.forEach((d) => d());
    }

    let toScreen = (v) => p.createVector(W / 2, H / 2).add(v);

    let vec = (x, y) => {
        return new p5.Vector(x, y);
    };
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
