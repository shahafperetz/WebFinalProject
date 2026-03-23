import app from "./app";

const port = Number(process.env.PORT) || 3001;

app.listen(port, () => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://node16.cs.colman.ac.il"
      : `http://localhost:${port}`;

  console.log(`Server is running on ${baseUrl}`);
  console.log(`Swagger docs available at ${baseUrl}/api-docs`);
});
