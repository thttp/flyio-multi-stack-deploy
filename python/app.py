import os
import socket
import requests
import psutil
from flask import Flask

app = Flask(__name__)


def get_private_ip():
    try:
        for iface, addrs in psutil.net_if_addrs().items():
            for addr in addrs:
                if addr.family == 2 and not addr.address.startswith("127."):
                    return addr.address
    except Exception:
        pass
    return os.environ.get("FLY_PRIVATE_IP", "unknown")


def get_machine_metadata():
    machine_id = os.environ.get("FLY_MACHINE_ID")
    if not machine_id:
        return None
    try:
        url = f"http://_api.internal:4280/v1/apps/{os.environ.get('FLY_APP_NAME')}/machines/{machine_id}"
        response = requests.get(
            url,
            headers={"Authorization": f"Bearer {os.environ.get('FLY_API_TOKEN')}"},
            timeout=5,
        )
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching metadata: {e}")
        return None


@app.route("/")
def index():
    metadata = get_machine_metadata()

    machine_id = os.environ.get("FLY_MACHINE_ID", "unknown")
    machine_name = socket.gethostname()
    image = (
        (metadata or {}).get("config", {}).get("image")
        or os.environ.get("FLY_IMAGE_REF", "unknown")
    )
    created_at = (metadata or {}).get("created_at", "unknown")
    region = os.environ.get("FLY_REGION", "unknown")
    private_ip = get_private_ip()
    state = (metadata or {}).get("state", "unknown")

    return f"""
    <style>
      body {{ font-family: Arial, sans-serif; padding: 40px; }}
      dt {{ font-weight: bold; margin-top: 12px; }}
      dd {{ margin-left: 0; margin-bottom: 8px; }}
    </style>
    <h1>Fly.io Machine Info</h1>
    <dl>
      <dt>Machine ID</dt>
      <dd>{machine_id}</dd>
      <dt>Machine Name</dt>
      <dd>{machine_name}</dd>
      <dt>Image</dt>
      <dd>{image}</dd>
      <dt>Created At</dt>
      <dd>{created_at}</dd>
      <dt>Region</dt>
      <dd>{region}</dd>
      <dt>Private IP</dt>
      <dd>{private_ip}</dd>
      <dt>State</dt>
      <dd>{state}</dd>
    </dl>
    """


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app.run(host="0.0.0.0", port=port)