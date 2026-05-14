const express = require("express");
const os = require("os");

const app = express();

function getPrivateIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  return "unknown";
}

app.get("/", (_, res) => {
  res.send(`
    <dl>
      <dt>Machine ID</dt>
      <dd>${process.env.FLY_MACHINE_ID || "unknown"}</dd>

      <dt>Machine Name</dt>
      <dd>${os.hostname()}</dd>

      <dt>Image</dt>
      <dd>${process.env.FLY_IMAGE_REF || "unknown"}</dd>

      <dt>Created At</dt>
      <dd>pending</dd>

      <dt>Region</dt>
      <dd>${process.env.FLY_REGION || "unknown"}</dd>

      <dt>Private IP</dt>
      <dd>${getPrivateIp()}</dd>

      <dt>State</dt>
      <dd>pending</dd>
    </dl>
  `);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running on port ${port}`);
});