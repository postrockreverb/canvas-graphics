class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  get(coordName) {
    switch (coordName) {
      case 'x':
        return this.x;

      case 'y':
        return this.y;

      case 'z':
        return this.z;

      default:
        break;
    }
  }

  set(coordName, value) {
    switch (coordName) {
      case 'x':
        this.x = value;
        break;

      case 'y':
        this.y = value;
        break;

      case 'z':
        this.z = value;
        break;

      default:
        break;
    }
  }
}

export { Point };
