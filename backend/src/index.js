import express from "express";
import cors from "cors";

async function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_, res) => {
    res.send({
      success: true,
      body: "Hello World!",
    });
  });

  const PORT = process.env.PORT || 3000;
  const hostname = process.env.HOSTNAME || "localhost";

  app.listen(PORT, () => {
    console.log(`Server is running on http://${hostname}:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
