import * as math from 'mathjs';

export function cubicSplineInterpolation(p, boundary) {
  var row = 0;
  var solutionIndex = (p.length - 1) * 4;

  // initialize matrix
  var m = []; // rows
  for (var i = 0; i < (p.length - 1) * 4; i++) {
    // columns (rows + 1)
    m.push([]);
    for (var j = 0; j <= (p.length - 1) * 4; j++) {
      m[i].push(math.bignumber(0)); // fill with zeros
    }
  }

  // splines through p equations
  for (var functionNr = 0; functionNr < p.length - 1; functionNr++, row++) {
    var p0 = p[functionNr],
      p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = math.pow(math.bignumber(p0.x), 3);
    m[row][functionNr * 4 + 1] = math.pow(math.bignumber(p0.x), 2);
    m[row][functionNr * 4 + 2] = math.bignumber(p0.x);
    m[row][functionNr * 4 + 3] = math.bignumber(1);
    m[row][solutionIndex] = math.bignumber(p0.y);

    m[++row][functionNr * 4 + 0] = math.pow(math.bignumber(p1.x), 3);
    m[row][functionNr * 4 + 1] = math.pow(math.bignumber(p1.x), 2);
    m[row][functionNr * 4 + 2] = math.bignumber(p1.x);
    m[row][functionNr * 4 + 3] = math.bignumber(1);
    m[row][solutionIndex] = math.bignumber(p1.y);
  }

  // first derivative
  for (var functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
    var p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = math.multiply(3, math.pow(math.bignumber(p1.x), 2));
    m[row][functionNr * 4 + 1] = math.multiply(2, math.bignumber(p1.x));
    m[row][functionNr * 4 + 2] = math.bignumber(1);
    m[row][functionNr * 4 + 4] = math.multiply(-3, math.pow(math.bignumber(p1.x), 2));
    m[row][functionNr * 4 + 5] = math.multiply(-2, math.bignumber(p1.x));
    m[row][functionNr * 4 + 6] = math.bignumber(-1);
  }

  // second derivative
  for (var functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
    var p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = math.multiply(6, math.bignumber(p1.x));
    m[row][functionNr * 4 + 1] = math.bignumber(2);
    m[row][functionNr * 4 + 4] = math.multiply(-6, math.bignumber(p1.x));
    m[row][functionNr * 4 + 5] = math.bignumber(-2);
  }

  // boundary conditions
  switch (boundary) {
    case 'quadratic': // first and last spline quadratic
      m[row++][0] = math.bignumber(1);
      m[row++][solutionIndex - 4 + 0] = math.bignumber(1);
      break;

    case 'notaknot': // Not-a-knot spline
      m[row][0 + 0] = math.bignumber(1);
      m[row++][0 + 4] = math.bignumber(-1);
      m[row][solutionIndex - 8 + 0] = math.bignumber(1);
      m[row][solutionIndex - 4 + 0] = math.bignumber(-1);
      break;

    case 'periodic': // periodic function
      // first derivative of first and last point equal
      m[row][0] = math.multiply(3, math.pow(math.bignumber(p[0].x), 2));
      m[row][1] = math.multiply(2, math.bignumber(p[0].x));
      m[row][2] = math.bignumber(1);
      m[row][solutionIndex - 4 + 0] = math.multiply(-3, math.pow(math.bignumber(p[p.length - 1].x), 2));
      m[row][solutionIndex - 4 + 1] = math.multiply(-2, math.bignumber(p[p.length - 1].x));
      m[row++][solutionIndex - 4 + 2] = math.bignumber(-1);

      // second derivative of first and last point equal
      m[row][0] = math.multiply(6, math.bignumber(p[0].x));
      m[row][1] = math.bignumber(2);
      m[row][solutionIndex - 4 + 0] = math.multiply(-6, math.bignumber(p[p.length - 1].x));
      m[row][solutionIndex - 4 + 1] = math.bignumber(-2);
      break;

    default:
      // natural spline
      m[row][0 + 0] = math.multiply(6, p[0].x);
      m[row++][0 + 1] = math.bignumber(2);
      m[row][solutionIndex - 4 + 0] = math.multiply(6, math.bignumber(p[p.length - 1].x));
      m[row][solutionIndex - 4 + 1] = math.bignumber(2);
      break;
  }

  var reducedRowEchelonForm = rref(m);
  var coefficients = [];
  for (var i = 0; i < reducedRowEchelonForm.length; i++) {
    coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
  }

  var functions = [];
  for (var i = 0; i < coefficients.length; i += 4) {
    functions.push({
      a: parseFloat(coefficients[i]),
      b: parseFloat(coefficients[i + 1]),
      c: parseFloat(coefficients[i + 2]),
      d: parseFloat(coefficients[i + 3]),
      range: { xmin: parseFloat(p[i / 4].x), xmax: parseFloat(p[i / 4 + 1].x) },
    });
  }
  return functions;
}

// Reduced row echelon form
// https://rosettacode.org/wiki/Reduced_row_echelon_form
function rref(mat) {
  var lead = 0;
  for (var r = 0; r < mat.length; r++) {
    if (mat[0].length <= lead) return;

    var i = r;
    while (mat[i][lead] == 0) {
      i++;
      if (mat.length == i) {
        i = r;
        lead++;
        if (mat[0].length == lead) return;
      }
    }

    var tmp = mat[i];
    mat[i] = mat[r];
    mat[r] = tmp;

    var val = mat[r][lead];
    for (var j = 0; j < mat[0].length; j++) {
      mat[r][j] = math.divide(mat[r][j], val);
    }

    for (var i = 0; i < mat.length; i++) {
      if (i == r) continue;
      val = math.bignumber(mat[i][lead]);
      for (var j = 0; j < mat[0].length; j++) {
        mat[i][j] = math.subtract(math.bignumber(mat[i][j]), math.multiply(val, math.bignumber(mat[r][j])));
      }
    }
    lead++;
  }
  return mat;
}
