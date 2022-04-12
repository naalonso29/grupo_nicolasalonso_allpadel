const express = require("express");
const app = express();
const method = require('method-override')
const path = require("path");
const session = require('express-session');
const cors = require('cors');


//Modulos requeridos
const rutasUsers = require("./routes/users")
const rutasProductos = require('./routes/products');
const rutaHome = require("./routes/index");
const rutaApi = require("./routes/api");


app.set("port", 3001);
app.set("view engine", "ejs");


app.listen(process.env.PORT || 3001, () => console.log("Servidor Corriendo"));

app.use(session({
    secret: "mensajeSecreto",
    resave: false,
    saveUninitialized: false
}));

app.use(express.static(path.resolve(__dirname, '..', 'public')))
app.use(express.urlencoded({ extended: false }))
app.use(method('_method'))
app.use(cors({ origin: "http://localhost:3000"}))

//Direcciones
app.use("/", rutaHome);
app.use("/users", rutasUsers);
app.use("/products", rutasProductos);
app.use("/api", rutaApi);