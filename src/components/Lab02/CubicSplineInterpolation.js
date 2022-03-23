export function cubicSplineInterpolation(p, boundary) {
  var row = 0;
  var solutionIndex = (p.length - 1) * 4;

  // initialize matrix
  var m = []; // rows
  for (var i = 0; i < (p.length - 1) * 4; i++) {
    // columns (rows + 1)
    m.push([]);
    for (var j = 0; j <= (p.length - 1) * 4; j++) {
      m[i].push(0); // fill with zeros
    }
  }

  // splines through p equations
  for (var functionNr = 0; functionNr < p.length - 1; functionNr++, row++) {
    var p0 = p[functionNr],
      p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = Math.pow(p0.x, 3);
    m[row][functionNr * 4 + 1] = Math.pow(p0.x, 2);
    m[row][functionNr * 4 + 2] = p0.x;
    m[row][functionNr * 4 + 3] = 1;
    m[row][solutionIndex] = p0.y;

    m[++row][functionNr * 4 + 0] = Math.pow(p1.x, 3);
    m[row][functionNr * 4 + 1] = Math.pow(p1.x, 2);
    m[row][functionNr * 4 + 2] = p1.x;
    m[row][functionNr * 4 + 3] = 1;
    m[row][solutionIndex] = p1.y;
  }

  // first derivative
  for (var functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
    var p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = 3 * Math.pow(p1.x, 2);
    m[row][functionNr * 4 + 1] = 2 * p1.x;
    m[row][functionNr * 4 + 2] = 1;
    m[row][functionNr * 4 + 4] = -3 * Math.pow(p1.x, 2);
    m[row][functionNr * 4 + 5] = -2 * p1.x;
    m[row][functionNr * 4 + 6] = -1;
  }

  // second derivative
  for (var functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
    var p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = 6 * p1.x;
    m[row][functionNr * 4 + 1] = 2;
    m[row][functionNr * 4 + 4] = -6 * p1.x;
    m[row][functionNr * 4 + 5] = -2;
  }

  // boundary conditions
  switch (boundary) {
    case 'quadratic': // first and last spline quadratic
      m[row++][0] = 1;
      m[row++][solutionIndex - 4 + 0] = 1;
      break;

    case 'notaknot': // Not-a-knot spline
      m[row][0 + 0] = 1;
      m[row++][0 + 4] = -1;
      m[row][solutionIndex - 8 + 0] = 1;
      m[row][solutionIndex - 4 + 0] = -1;
      break;

    case 'periodic': // periodic function
      // first derivative of first and last point equal
      m[row][0] = 3 * Math.pow(p[0].x, 2);
      m[row][1] = 2 * p[0].x;
      m[row][2] = 1;
      m[row][solutionIndex - 4 + 0] = -3 * Math.pow(p[p.length - 1].x * 2);
      m[row][solutionIndex - 4 + 1] = -2 * p[p.length - 1].x;
      m[row++][solutionIndex - 4 + 2] = -1;

      // second derivative of first and last point equal
      m[row][0] = 6 * p[0].x;
      m[row][1] = 2;
      m[row][solutionIndex - 4 + 0] = -6 * p[p.length - 1].x;
      m[row][solutionIndex - 4 + 1] = -2;
      break;

    default:
      // natural spline
      m[row][0 + 0] = 6 * p[0].x;
      m[row++][0 + 1] = 2;
      m[row][solutionIndex - 4 + 0] = 6 * p[p.length - 1].x;
      m[row][solutionIndex - 4 + 1] = 2;
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
      mat[r][j] = mat[r][j] / val;
    }

    for (var i = 0; i < mat.length; i++) {
      if (i == r) continue;
      val = mat[i][lead];
      for (var j = 0; j < mat[0].length; j++) {
        mat[i][j] = mat[i][j] - val * mat[r][j];
      }
    }
    lead++;
  }
  return mat;
}
