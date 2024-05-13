import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import router from "./router";
import db from "./config/db";
import swaggerUi from "swagger-ui-express";
import swaggerEspec, { swaggerUiOptions } from "./config/swagger";

// Conectar a base de datos
export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    // console.log( colors.blue( 'Conexión exitosa a la BD'))
  } catch (error) {
    // console.log(error)
    console.log(colors.red.bold("Hubo un error al conectar a la BD"));
  }
}
connectDB();

// Instancia de express
const server = express();

// Permitir conexión de otros dominios
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.FRONTEND_URL) {
      console.log("Permitir");
      callback(null, true);
    } else {
      console.log("No permitir");
      callback(new Error("Error de CORS"));
    }
  },
};

server.use(cors(corsOptions));

// Leer datos de formularios
server.use(express.json());

server.use(morgan("dev"));
server.use("/api/products", router);

//Docs
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerEspec, swaggerUiOptions)
);
export default server;
