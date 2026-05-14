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

  return process.env.FLY_PRIVATE_IP || "unknown";
}

async function getMachineMetadata() {
  const machineId = process.env.FLY_MACHINE_ID;

  if (!machineId) {
    return null;
  }

  try {
    const response = await fetch(
      `http://_api.internal:4280/v1/apps/${process.env.FLY_APP_NAME}/machines/${machineId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLY_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);

    return null;
  }
}

app.get("/", async (_, res) => {
  const metadata = await getMachineMetadata();

  res.send(`
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 40px;
      }

      dt {
        font-weight: bold;
        margin-top: 12px;
      }

      dd {
        margin-left: 0;
        margin-bottom: 8px;
      }
    </style>

    <h1>Fly.io Machine Info</h1>

    <dl>
      <dt>Machine ID</dt>
      <dd>${process.env.FLY_MACHINE_ID || "unknown"}</dd>

      <dt>Machine Name</dt>
      <dd>${os.hostname()}</dd>

      <dt>Image</dt>
      <dd>${metadata?.config?.image || process.env.FLY_IMAGE_REF || "unknown"}</dd>

      <dt>Created At</dt>
      <dd>${metadata?.created_at || "unknown"}</dd>

      <dt>Region</dt>
      <dd>${process.env.FLY_REGION || "unknown"}</dd>

      <dt>Private IP</dt>
      <dd>${getPrivateIp()}</dd>

      <dt>State</dt>
      <dd>${metadata?.state || "unknown"}</dd>
    </dl>
  `);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`running on port ${port}`);
});