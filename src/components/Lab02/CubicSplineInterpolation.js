export function cubicSplineInterpolation(p, boundary) {
  let row = 0;
  let solutionIndex = (p.length - 1) * 4;

  // initialize matrix
  let m = []; // rows
  for (let i = 0; i < (p.length - 1) * 4; i++) {
    // columns (rows + 1)
    m.push([]);
    for (let j = 0; j <= (p.length - 1) * 4; j++) {
      m[i].push(0); // fill with zeros
    }
  }

  // splines through p equations
  for (let functionNr = 0; functionNr < p.length - 1; functionNr++, row++) {
    let p0 = p[functionNr],
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
  for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
    let p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = 3 * Math.pow(p1.x, 2);
    m[row][functionNr * 4 + 1] = 2 * p1.x;
    m[row][functionNr * 4 + 2] = 1;
    m[row][functionNr * 4 + 4] = -3 * Math.pow(p1.x, 2);
    m[row][functionNr * 4 + 5] = -2 * p1.x;
    m[row][functionNr * 4 + 6] = -1;
  }

  // second derivative
  for (let functionNr = 0; functionNr < p.length - 2; functionNr++, row++) {
    let p1 = p[functionNr + 1];
    m[row][functionNr * 4 + 0] = 6 * p1.x;
    m[row][functionNr * 4 + 1] = 2;
    m[row][functionNr * 4 + 4] = -6 * p1.x;
    m[row][functionNr * 4 + 5] = -2;
  }

  // boundary conditions
  switch (boundary) {
    case 'fixed':
      m[row++][0] = 1;
      m[row++][solutionIndex - 4 + 0] = 1;
      break;

    case 'loose':
      m[row][0 + 0] = 1;
      m[row++][0 + 4] = -1;
      m[row][solutionIndex - 8 + 0] = 1;
      m[row][solutionIndex - 4 + 0] = -1;
      break;

    case 'periodic':
      m[row][0] = 3 * Math.pow(p[0].x, 2);
      m[row][1] = 2 * p[0].x;
      m[row][2] = 1;
      m[row][solutionIndex - 4 + 0] = -3 * Math.pow(p[p.length - 1].x, 2);
      m[row][solutionIndex - 4 + 1] = -2 * p[p.length - 1].x;
      m[row++][solutionIndex - 4 + 2] = -1;

      m[row][0] = 6 * p[0].x;
      m[row][1] = 2;
      m[row][solutionIndex - 4 + 0] = -6 * p[p.length - 1].x;
      m[row][solutionIndex - 4 + 1] = -2;
      break;

    case 'aperiodic':
      m[row][0 + 0] = 6 * p[0].x;
      m[row++][0 + 1] = 2;
      m[row][solutionIndex - 4 + 0] = 6 * p[p.length - 1].x;
      m[row][solutionIndex - 4 + 1] = 2;
      break;

    default:
      throw new Error('no boundary conditions specified');
  }

  let reducedRowEchelonForm = rref(m);
  let coefficients = [];
  for (let i = 0; i < reducedRowEchelonForm.length; i++) {
    coefficients.push(reducedRowEchelonForm[i][reducedRowEchelonForm[i].length - 1]);
  }

  let functions = [];
  for (let i = 0; i < coefficients.length; i += 4) {
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
  let lead = 0;
  for (let r = 0; r < mat.length; r++) {
    if (mat[0].length <= lead) return;

    let i = r;
    while (mat[i][lead] == 0) {
      i++;
      if (mat.length == i) {
        i = r;
        lead++;
        if (mat[0].length == lead) return;
      }
    }

    let tmp = mat[i];
    mat[i] = mat[r];
    mat[r] = tmp;

    let val = mat[r][lead];
    for (let j = 0; j < mat[0].length; j++) {
      mat[r][j] = mat[r][j] / val;
    }

    for (let i = 0; i < mat.length; i++) {
      if (i == r) continue;
      val = mat[i][lead];
      for (let j = 0; j < mat[0].length; j++) {
        mat[i][j] = mat[i][j] - val * mat[r][j];
      }
    }
    lead++;
  }
  return mat;
}
