/*
 * Icosahedron coordinate generation is loosely based on superwills' C++ code available at the address below.
 * https://github.com/superwills/gtp/blob/master/gtp/geometry/Icosahedron.cpp
 */
UnitIcosahedron = function () {
    const phi = (1 + Math.sqrt(5)) / 2;

    const vertices = [
        /*  0 */[0, 1, phi],
        /*  1 */[0, 1, -phi],
        /*  2 */[0, -1, phi],
        /*  3 */[0, -1, -phi],

        /*  4 */[1, phi, 0],
        /*  5 */[1, -phi, 0],
        /*  6 */[-1, phi, 0],
        /*  7 */[-1, -phi, 0],

        /*  8 */[phi, 0, 1],
        /*  9 */[-phi, 0, 1],
        /* 10 */[phi, 0, -1],
        /* 11 */[-phi, 0, -1]

    ];
    return [
        [vertices[0], vertices[2], vertices[8]],  // Face 1
        [vertices[0], vertices[8], vertices[4]],  // Face 2
        [vertices[0], vertices[4], vertices[6]],  // Face 3
        [vertices[0], vertices[6], vertices[9]],  // Face 4
        [vertices[0], vertices[9], vertices[2]],  // Face 5
        [vertices[2], vertices[7], vertices[5]],  // Face 6
        [vertices[2], vertices[5], vertices[8]],  // Face 7
        [vertices[2], vertices[9], vertices[7]],  // Face 8
        [vertices[8], vertices[5], vertices[10]], // Face 9
        [vertices[8], vertices[10], vertices[4]], // Face 10
        [vertices[10], vertices[5], vertices[3]], // Face 11
        [vertices[10], vertices[3], vertices[1]], // Face 12
        [vertices[10], vertices[1], vertices[4]], // Face 13
        [vertices[1], vertices[6], vertices[4]],  // Face 14
        [vertices[1], vertices[3], vertices[11]], // Face 15
        [vertices[1], vertices[11], vertices[6]], // Face 16
        [vertices[6], vertices[11], vertices[9]], // Face 17
        [vertices[11], vertices[3], vertices[7]], // Face 18
        [vertices[11], vertices[7], vertices[9]], // Face 19
        [vertices[3], vertices[5], vertices[7]]   // Face 20
    ];
};

