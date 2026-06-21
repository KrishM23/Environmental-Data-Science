# Terrain starter notebooks

Runnable code for beginner projects on [Terrain](https://github.com/KrishM23/Environmental-Data-Science). Each notebook matches a project card on [`projects.html`](../projects.html).

## Beginner projects

| Project | File | Language | Data source |
|---------|------|----------|-------------|
| Map LA's air quality | [`la_air_quality_map.ipynb`](la_air_quality_map.ipynb) | Python | EPA AirNow |
| Who carries the pollution burden? | [`calenviroscreen_burden.Rmd`](calenviroscreen_burden.Rmd) | R | CalEnviroScreen 4.0 |
| Is your hometown getting hotter? | [`hometown_temperature_trend.ipynb`](hometown_temperature_trend.ipynb) | Python | NOAA NCEI |

## How to run

### Python (Colab — easiest)

1. On a project card, click **Open in Colab**.
2. Run cells top to bottom (`Runtime → Run all`).

**If Colab opens a blank notebook:** the old link format failed silently when GitHub returned 404 (private repo). Use **Open in Colab** after the repo is public, or upload the `.ipynb` manually via Colab → File → Upload notebook.

- **Recommended:** GitHub → repo **Settings → General → Change repository visibility → Public** (Terrain is meant to be open anyway).
- **Or:** deploy the site on Netlify, then set your live URL in [`assets/site-config.js`](../assets/site-config.js) as `publicOrigin: 'https://your-site.netlify.app'`.
- **Or:** in Colab, use **File → Upload notebook** and select the `.ipynb` from this folder.

3. For **AirNow**, either use bundled sample data or set `USE_LIVE_DATA = True` and paste a free [API key](https://docs.airnowapi.org/account/request/).

### Python (local)

```bash
cd notebooks
python3 -m pip install pandas requests matplotlib folium
jupyter notebook la_air_quality_map.ipynb
```

### R (RStudio)

1. Open `calenviroscreen_burden.Rmd` in RStudio.
2. Install packages when prompted (first chunk).
3. Click **Knit** or run chunks interactively.

## Sample data

The `data/` folder includes offline fallbacks:

- `airnow_la_sample.json` — LA-area AQI snapshot (AirNow API format)
- `ces4_la_county.json` — CalEnviroScreen 4.0, LA County tracts
- `noaa_lax_tmax_daily.csv` — daily TMAX for LAX, 2010–2024

Live fetches are preferred when you have internet; toggle flags in each notebook to use samples.

## Adding notebooks

When you add a new project notebook, update the `notebook` field in [`projects.html`](../projects.html) and link the matching explainer on [`datasets.html`](../datasets.html).
