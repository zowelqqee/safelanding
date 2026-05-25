"""Small local HTTP server for the city recommendation model.

Run:
    python3 -m ml.city_model_server --host 127.0.0.1 --port 8000
"""

from __future__ import annotations

import argparse
import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

from .city_inference import predict_cities


class CityModelHandler(BaseHTTPRequestHandler):
    server_version = "SoftLandingCityModel/0.1"

    def do_GET(self) -> None:
        if self.path == "/health":
            self._send_json({"ok": True})
            return

        self._send_json({"error": "Not found"}, status=HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        if self.path != "/predict":
            self._send_json({"error": "Not found"}, status=HTTPStatus.NOT_FOUND)
            return

        try:
            payload = self._read_json_body()
            profile = payload.get("profile")
            if not isinstance(profile, dict):
                raise ValueError("Request body must include a profile object")

            result = predict_cities(profile, top_k=int(payload.get("top_k", 58)))
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        except Exception as error:  # noqa: BLE001 - local service should return JSON errors
            self._send_json(
                {"error": "City model inference failed", "detail": str(error)},
                status=HTTPStatus.INTERNAL_SERVER_ERROR,
            )
            return

        self._send_json(result)

    def _read_json_body(self) -> dict[str, Any]:
        content_length = int(self.headers.get("content-length", "0"))
        raw_body = self.rfile.read(content_length)
        if not raw_body:
            return {}

        payload = json.loads(raw_body.decode("utf-8"))
        if not isinstance(payload, dict):
            raise ValueError("Request body must be a JSON object")
        return payload

    def _send_json(self, body: dict[str, Any], status: HTTPStatus = HTTPStatus.OK) -> None:
        response = json.dumps(body).encode("utf-8")
        self.send_response(status.value)
        self.send_header("content-type", "application/json; charset=utf-8")
        self.send_header("content-length", str(len(response)))
        self.end_headers()
        self.wfile.write(response)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run the local city model server")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), CityModelHandler)
    print(f"City model server listening on http://{args.host}:{args.port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
