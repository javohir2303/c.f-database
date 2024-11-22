const http = require("node:http");
const url = require("node:url");
const { ResData } = require("./lib/resData");
const { Repository } = require("./lib/repository");
const path = require("node:path");
const { bodyParser } = require("./lib/bodyparser");
const { CarEntity } = require("./lib/carsEntity");
const { FruitEntity } = require("./lib/fruitsEntity")

const carsDir = path.join(__dirname, "database", "cars.json");
const fruitDir = path.join(__dirname, "database", "fruits.json");


const carsRepo = new Repository(carsDir);
const fruitRepo = new Repository(fruitDir);


async function handleRequest(req, res) {
  const method = req.method;
  const parsedUrl = url.parse(req.url).pathname.split("/");

  if (method === "GET" && parsedUrl[1] === "cars") {
    const cars = await carsRepo.read();
    const resData = new ResData(200, "success", cars);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));

  } else if (method === "POST" && parsedUrl[1] === "cars") {
    const body = await bodyParser(req);
    if (!body.name || !body.color || !body.price) {
      const resData = new ResData(400, "Please provide name, brand, and price");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const newCar = new CarEntity(body.name, body.color, body.price);
    await carsRepo.writeNewData(newCar);

    const resData = new ResData(201, "created", newCar);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));

} else if (method === "PUT" && parsedUrl[1] === "cars" && parsedUrl[2]) {
    const id = parsedUrl[2]; // URL orqali ID ni olish

    try {
        // ID bo‘yicha obyektni olish
        const cars = await carsRepo.read();
        const car = cars.find((item) => item.id === id);

        if (!car) {
            throw new Error(`Car with ID ${id} not found`);
        }

        // Topilgan obyektni qaytarish
        const resData = new ResData(200, `Car with ID ${id} found`, car);
        res.writeHead(resData.statusCode);
        res.end(JSON.stringify(resData));
    } catch (error) {
        // Xato holati
        const resData = new ResData(404, error.message);
        res.writeHead(resData.statusCode);
        res.end(JSON.stringify(resData));
    }
} else if (method === "PATCH" && parsedUrl[1] === "cars" && parsedUrl[2]) {
    const id = parsedUrl[2];
    const body = await bodyParser(req);

    try {
        const patchedCar = await carsRepo.patchDataById(id, body);

        const resData = new ResData(200, `Car with ID ${id} patched successfully`, patchedCar);
        res.writeHead(resData.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resData));
    } catch (error) {
        const resData = new ResData(404, error.message);
        res.writeHead(resData.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resData));
    }
} else if (method === "DELETE" && parsedUrl[1] === "cars" && parsedUrl[2]) {
    const id = parsedUrl[2];

    try {
      await carsRepo.deleteDataById(id);
      const resData = new ResData(200, "deleted successfully");
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    } catch (error) {
      const resData = new ResData(404, error.message);
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    }

  } else if(method === "GET" && parsedUrl[1] === "fruit"){
    const fruits = await fruitRepo.read();
    const resData = new ResData(200, "success", fruits);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  } else if(method === "POST" && parsedUrl[1] === "fruit"){
    const body = await bodyParser(req);
    if (!body.name || !body.count || !body.price) {
      const resData = new ResData(400, "Please provide name, count, and price");
      res.writeHead(resData.statusCode);
      return res.end(JSON.stringify(resData));
    }

    const newFruit = new FruitEntity(body.name, body.count, body.price);
    await fruitRepo.writeNewData(newFruit);

    const resData = new ResData(201, "created", newFruit);
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }  else if (method === "PUT" && parsedUrl[1] === "fruit" && parsedUrl[2]) {
    const id = parsedUrl[2]

    try {
        const fruits = await fruitRepo.read();
        const fruit = fruits.find((item) => item.id === id);

        if (!fruit) {
            throw new Error(`Fruit with ID ${id} not found`);
        }

        const resData = new ResData(200, `Fruit with ID ${id} found`, car);
        res.writeHead(resData.statusCode);
        res.end(JSON.stringify(resData));
    } catch (error) {

        const resData = new ResData(404, error.message);
        res.writeHead(resData.statusCode);
        res.end(JSON.stringify(resData));
    }
}  else if (method === "PATCH" && parsedUrl[1] === "fruit" && parsedUrl[2]) {
    const id = parsedUrl[2];
    const body = await bodyParser(req);

    try {
        const patchedfruits = await fruitRepo.patchDataById(id, body);

        const resData = new ResData(200, `fruit with ID ${id} patched successfully`, patchedCar);
        res.writeHead(resData.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resData));
    } catch (error) {
        const resData = new ResData(404, error.message);
        res.writeHead(resData.statusCode, { "Content-Type": "application/json" });
        res.end(JSON.stringify(resData));
    }
}  else if (method === "DELETE" && parsedUrl[1] === "fruit" && parsedUrl[2]) {
    const id = parsedUrl[2];

    try {
      await fruitRepo.deleteDataById(id,);
      const resData = new ResData(200, "deleted successfully");
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    } catch (error) {
      const resData = new ResData(404, error.message);
      res.writeHead(resData.statusCode);
      res.end(JSON.stringify(resData));
    }

  } else {
    const resData = new ResData(404, "This API does not exist");
    res.writeHead(resData.statusCode);
    res.end(JSON.stringify(resData));
  }
}

const server = http.createServer(handleRequest);

server.listen(7777, () => {
  console.log("Server is running at http://localhost:7777");
});
