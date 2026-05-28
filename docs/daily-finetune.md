# Daily City Model Fine-Tune

The city model can be updated once per day from Supabase profile and behavior
data with GitHub Actions.

The workflow lives at:

```txt
.github/workflows/daily-city-model-finetune.yml
```

It runs daily at 05:17 Europe/Moscow time while Moscow is UTC+3, and can also
be started manually from the GitHub Actions tab.

## Required GitHub Secrets

Set these in GitHub repository settings:

```txt
SUPABASE_URL=<your Supabase project URL>
SUPABASE_SERVICE_ROLE_KEY=<your Supabase service role key>
```

Use the real service role key only as a GitHub secret. Do not expose it as a
`NEXT_PUBLIC_` variable.

## Optional GitHub Variable

```txt
CITY_MODEL_MIN_FINETUNE_SAMPLES=10
```

If this variable is not set, the workflow requires at least 10 training samples
before updating `city_model.pt`.

## Deploy Flow

```txt
Supabase app_events + move_profiles
  -> GitHub Actions fine-tune
  -> commit updated city_model.pt
  -> Render auto-deploys the model service from main
```

The workflow commits only `city_model.pt`. Backup files created during training
remain inside the temporary GitHub Actions runner and are not pushed.
