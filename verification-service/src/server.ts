import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/verify", routes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 6000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Verification service running on port ${PORT}`);
  });
}

export default app;