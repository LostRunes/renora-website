const express = require("express");     // express: This is the framework we’re using to build the backend server. It makes handling routes and requests easier.
const cors = require("cors");   // cors: This stands for Cross-Origin Resource Sharing. //frontend and backend communication
const upload = require("./middleware/upload");

const mongoose = require("mongoose");

const Product = require("./models/Product");

const app = express();      // We create an Express application by calling express(). This app will define routes and handle requests and responses.

app.use(cors());        // When you send data to your backend (for example, when you eventually add a feature where you submit a new product from a form), that data often comes in JSON format.
app.use(express.json());        // The express.json() middleware makes sure that any JSON data in the request body is automatically parsed into a JavaScript object. Without it, the backend wouldn’t understand JSON data sent from the frontend or other API clients.


mongoose.connect("mongodb://localhost:27017/renora");

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});

// app.get("/", (req,res) => {
//     res.send("Renora backend running");
// })

//(Testing API)
// app.get("/products",(req,res) => {
//     res.json([{
//         name:"Rose Gold Ring",
//             price:12000,
//             type:"Rings",
//             material:"Rose Gold",
//             image:"https://via.placeholder.com/200",
//             description:"Sample product"
//         }
//     ]);
// });

app.get("/products", async (req,res) => {
    const products = await Product.find();
    res.json(products);
});

// POST API
app.post("/add-product", upload.single("image"), async (req, res) => {

  console.log("BODY:", req.body);
  console.log("FILE:", req.file);

  try {

    let imageUrl = "";

    if (req.file) {
      imageUrl = req.file.path;
    }

    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      type: req.body.type,
      material: req.body.material,
      description: req.body.description,
      image: imageUrl
    });

    await product.save();

    res.json({
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add product" });
  }

});

app.listen(5000,() => {
    console.log("Server running on port 5000");
});