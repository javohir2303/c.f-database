const { v4: uuidv4 } = require("uuid")

class FruitEntity {
  constructor(name, count, price) {
    this.id = uuidv4();
    this.name = name;
    this.count = count
    this.price = price;
  }
}

module.exports = { FruitEntity }
