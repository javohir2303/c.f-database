const { v4: uuidv4 } = require("uuid")

class CarEntity {
  constructor(name, color, price) {
    this.id = uuidv4();
    this.name = name;
    this.color = color;
    this.price = price;
  }
}

module.exports = { CarEntity }
