# Render City Model Service

This deploy keeps the Next.js app on Vercel and runs only the Python/PyTorch
city model as a Render Docker web service.

## Render

Create a Blueprint from this repo or create a Docker web service manually.

If using the Blueprint, Render reads:

```txt
render.yaml
Dockerfile.model
requirements-model.txt
```

Set this Render env var when prompted:

```txt
CITY_MODEL_API_KEY=<long random secret>
```

The service exposes:

```txt
GET /health
GET /version
POST /predict
```

`/predict` requires:

```txt
Authorization: Bearer <CITY_MODEL_API_KEY>
```

## Vercel

After the Render deploy succeeds, copy the Render service URL into Vercel:

```txt
CITY_MODEL_ENABLED=true
CITY_MODEL_URL=https://safelanding-city-model.onrender.com
CITY_MODEL_TIMEOUT_MS=3500
CITY_MODEL_API_KEY=<same long random secret as Render>
```

Do not expose the Render model URL directly to the browser. The browser should
continue calling the existing Next.js routes:

```txt
/api/city-predictions
/api/country-predictions
```

## Notes

Render free instances can sleep after inactivity, so the first prediction after
a quiet period can be slow. The Next.js routes keep their heuristic fallback if
the model service is unavailable or times out.
