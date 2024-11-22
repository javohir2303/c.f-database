const fs = require("fs/promises");

class Repository {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data || "[]")
    } catch (error) {
      throw new Error("Failed to read data")
    }
  }

  async write(data) {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      throw new Error("Failed to write data");
    }
  }

  async writeNewData(newData) {
    const currentData = await this.read();
    currentData.push(newData);
    await this.write(currentData);
  }

  async deleteDataById(id) {
    const currentData = await this.read();
    const index = currentData.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with ID ${id} not found`);
    }
    currentData.splice(index, 1);
    await this.write(currentData);
  }

  async updateDataById(id, updatedFields) {
    const currentData = await this.read();
    const index = currentData.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Item with ID ${id} not found`);
    }
    currentData[index] = { ...currentData[index], ...updatedFields };
    await this.write(currentData);
    return currentData[index];
  }

  async patchDataById(id, updatedFields) {
    const currentData = await this.read(); // Barcha ma’lumotlarni o‘qish
    const index = currentData.findIndex((item) => item.id === id);

    if (index === -1) {
        throw new Error(`Item with ID ${id} not found`);
    }

    // Faqat kiritilgan maydonlarni yangilash
    currentData[index] = { ...currentData[index], ...updatedFields };
    
    await this.write(currentData); // Yangi ma’lumotlarni yozish
    return currentData[index]; // Yangilangan obyektni qaytarish
}

}

module.exports = { Repository };
