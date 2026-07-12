const express = require("express");
const cors = require("cors");

const { TEMPLATES_ROOT } = require("./config/templatePaths");
const { UPLOADS_ROOT } = require("./config/storagePaths");
const errorHandler = require("./middleware/errorHandler");
const exportRoutes = require("./routes/exportRoutes");
const previewRoutes = require("./routes/previewRoutes");
const projectRoutes = require("./routes/projectRoutes");
const templateRoutes = require("./routes/templateRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use("/templates", express.static(TEMPLATES_ROOT));
app.use("/uploads", express.static(UPLOADS_ROOT));
app.use("/templates", previewRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/templates", templateRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/exports", exportRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
