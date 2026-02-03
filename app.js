import express from 'express';
import customersRouter from "./routers/customersRouter.js";
import cors from "cors"

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL_ORIGIN
}))
app.use(express.static("public"))

app.use(express.json())

app.use("/api/customers", customersRouter);

app.get("/", (req, resp) => {
    console.log("Rotta /");
    resp.send("test")
});
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
