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

function detectCollisions(bodies) {
    let collisions = [];
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
            let a = bodies[i];
            let b = bodies[j];

            let overlap = a.d/2 + b.d/2 - a.p.dist(b.p)
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

function getGroupsOfCollisions(collisions, bodies) {
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

// global debug vars
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
