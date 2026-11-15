import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import packageRoutes from "./routes/packageRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ message: "FitBox API berjalan" }));
app.use("/api/packages", packageRoutes);
app.use("/api/orders", orderRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;