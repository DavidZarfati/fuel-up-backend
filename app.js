import 'dotenv/config';
import express from 'express';
import ordersRouter from "./routers/ordersRouter.js";
import cors from "cors"
import customersRouter from "./routers/customersRouter.js";
import productsRouter from "./routers/productsRouter.js"
import categoriesRouter from "./routers/categoriesRouter.js";
import productsInvoicesRouter from "./routers/productsInvoicesRouter.js";
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';


const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL_ORIGIN
}));

app.use(express.json());
app.use(express.static("public"));

app.use("/api/products", productsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/productsInvoices", productsInvoicesRouter);


app.use(errorHandler);
app.use(notFound);

app.get("/", (req, resp) => {
    console.log("Rotta /");
    resp.send("test");
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
