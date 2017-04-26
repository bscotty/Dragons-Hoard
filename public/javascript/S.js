const S = (function () {
    const my = {};

    function quad(f, u0, v0, u1, v1) { // Local to this class.
        const q = [];
        q.push(f(u0, v0));
        q.push(f(u1, v0));
        q.push(f(u1, v1));
        q.push(f(u0, v1));
        q.push(f(u0, v0));
        return q;
    }

    my.parametricMesh = function (f, nu, nv) {
        let i, j, u, v;
        const C = [];
        for (j = 0; j < nv; j++) {
            v = j / nv;
            for (i = 0; i < nu; i++) {
                u = i / nu;
                C.push(quad(f, u, v, u + 1 / nu, v + 1 / nv));
            }
        }
        return C;
    };

    my.sphere = function (u, v) {
        const theta = 2 * Math.PI * u;
        const phi = Math.PI * (v - .5);
        return [Math.cos(theta) * Math.cos(phi),
            Math.sin(theta) * Math.cos(phi),
            Math.sin(phi)];
    };

    my.tube = function (u, v) {
        const theta = 2 * Math.PI * u;
        return [Math.cos(theta),
            Math.sin(theta),
            2 * v - 1];
    };

    return my;
})();

