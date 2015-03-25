var testPoints = [280.35714, 648.79075, 286.78571, 662.8979, 263.28607, 661.17871, 262.31092, 671.41548, 250.53571, 677.00504, 250.53571, 683.43361, 256.42857, 685.21933, 297.14286, 669.50504, 289.28571, 649.50504, 285, 631.6479, 285, 608.79075, 292.85714, 585.21932, 306.42857, 563.79075, 323.57143, 548.79075, 339.28571, 545.21932, 357.85714, 547.36218, 375, 550.21932, 391.42857, 568.07647, 404.28571, 588.79075, 413.57143, 612.36218, 417.14286, 628.07647, 438.57143, 619.1479, 438.03572, 618.96932, 437.5, 609.50504, 426.96429, 609.86218, 424.64286, 615.57647, 419.82143, 615.04075, 420.35714, 605.04075, 428.39286, 598.43361, 437.85714, 599.68361, 443.57143, 613.79075, 450.71429, 610.21933, 431.42857, 575.21932, 405.71429, 550.21932, 372.85714, 534.50504, 349.28571, 531.6479, 346.42857, 521.6479, 346.42857, 511.6479, 350.71429, 496.6479, 367.85714, 476.6479, 377.14286, 460.93361, 385.71429, 445.21932, 388.57143, 404.50504, 360, 352.36218, 337.14286, 325.93361, 330.71429, 334.50504, 347.14286, 354.50504, 337.85714, 370.21932, 333.57143, 359.50504, 319.28571, 353.07647, 312.85714, 366.6479, 350.71429, 387.36218, 368.57143, 408.07647, 375.71429, 431.6479, 372.14286, 454.50504, 366.42857, 462.36218, 352.85714, 462.36218, 336.42857, 456.6479, 332.85714, 438.79075, 338.57143, 423.79075, 338.57143, 411.6479, 327.85714, 405.93361, 320.71429, 407.36218, 315.71429, 423.07647, 314.28571, 440.21932, 325, 447.71932, 324.82143, 460.93361, 317.85714, 470.57647, 304.28571, 483.79075, 287.14286, 491.29075, 263.03571, 498.61218, 251.60714, 503.07647, 251.25, 533.61218, 260.71429, 533.61218, 272.85714, 528.43361, 286.07143, 518.61218, 297.32143, 508.25504, 297.85714, 507.36218, 298.39286, 506.46932, 307.14286, 496.6479, 312.67857, 491.6479, 317.32143, 503.07647, 322.5, 514.1479, 325.53571, 521.11218, 327.14286, 525.75504, 326.96429, 535.04075, 311.78571, 540.04075, 291.07143, 552.71932, 274.82143, 568.43361, 259.10714, 592.8979, 254.28571, 604.50504, 251.07143, 621.11218, 250.53571, 649.1479, 268.1955, 654.36208];

var triangles;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

for (var i = 0; i < testPoints.length; i += 2) {
    minX = Math.min(minX, testPoints[i]);
    maxX = Math.max(maxX, testPoints[i]);
    minY = Math.min(minY, testPoints[i + 1]);
    maxY = Math.max(maxY, testPoints[i + 1]);
}

var width = maxX - minX,
    height = maxY - minY;

canvas.width = window.innerWidth;
canvas.height = canvas.width * height / width + 10;

var ratio = (canvas.width - 10) / width;

if (devicePixelRatio > 1) {
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.width *= 2;
    canvas.height *= 2;
    ctx.scale(2, 2);
}

console.time('earcut');
// for (var i = 0; i < 1000; i++) {
var result = earcut(testPoints);
// }
console.timeEnd('earcut');

var triangles = [];
for (var i = 0; i < result.length; i += 1) {
    triangles.push([testPoints[result[i]], testPoints[result[i] + 1]]);
}

ctx.lineJoin = 'round';

var original = [];
for (var i = 0; i < testPoints.length; i += 2) {
    original.push([testPoints[i], testPoints[i + 1]]);
}

drawPoly([original], 'black');

for (var i = 0; triangles && i < triangles.length; i += 3) {
    drawPoly([triangles.slice(i, i + 3)], 'rgba(255,0,0,0.2)', 'rgba(255,255,0,0.2)');
    // drawPoly([triangles.slice(i, i + 3)], 'rgba(255,0,0,0.0)', 'rgba(255,0,0,0.3)');
}

function drawPoint(p, color) {
    var x = (p[0] - minX) * ratio + 5,
        y = (p[1] - minY) * ratio + 5;
    ctx.fillStyle = color || 'grey';
    ctx.fillRect(x - 3, y - 3, 6, 6);
}

function drawPoly(rings, color, fill) {
    ctx.beginPath();

    ctx.strokeStyle = color;
    if (fill) ctx.fillStyle = fill;

    for (var k = 0; k < rings.length; k++) {
        var points = rings[k];
        for (var i = 0; i < points.length; i++) {
            var x = (points[i][0] - minX) * ratio + 5,
                y = (points[i][1] - minY) * ratio + 5;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
    }
    ctx.stroke();

    if (fill) ctx.fill('evenodd');
}
