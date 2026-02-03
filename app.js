import express from 'express';
import customersRouter from "./routers/customersRouter.js";
import ordersRouter from "./routers/ordersRouter.js";
import cors from "cors"

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL_ORIGIN
}));
app.use(express.static("public"));

app.use(express.json());

app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);

app.get("/", (req, resp) => {
    console.log("Rotta /");
    resp.send("test");
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
