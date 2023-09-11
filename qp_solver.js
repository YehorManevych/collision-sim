const T_START = 1000
const T_MIN = 0.000001
const DIVISOR = 2;

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

// global vars for debug
let t_iter = 0
let jk_iter = 0

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
    let t = T_START
    let jk_start = find_init_point(A, b)
    let jk = jk_start;
    let t_too_small = false;
    let prevT = t;
    let result = { j: jk, t: t };
    while (!t_too_small && t > T_MIN) {
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
        t = t / DIVISOR;
        t_iter += 1
    }
    return result;
}

