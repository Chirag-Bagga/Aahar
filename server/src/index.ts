import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { startNpkIngestionJob } from "./jobs/npk.ingest.js";

const app = createApp();
app.listen(env.PORT, () => {
  console.log(`Server listening on http://localhost:${env.PORT}`);
  startNpkIngestionJob();
});
