import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/issue", routes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Issuance service running on port ${PORT}`);
  });
}

export default app;