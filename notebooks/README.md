# Terrain project notebooks

Runnable code for projects on [Terrain](https://github.com/KrishM23/Environmental-Data-Science). Each file matches a card on [`projects.html`](../projects.html).

## Beginner

| Project | File | Language | Data source |
|---------|------|----------|-------------|
| Map LA's air quality | [`la_air_quality_map.ipynb`](la_air_quality_map.ipynb) | Python · Colab | EPA AirNow |
| Who carries the pollution burden? | [`calenviroscreen_burden.Rmd`](calenviroscreen_burden.Rmd) | R · RStudio | CalEnviroScreen 4.0 |
| Is your hometown getting hotter? | [`hometown_temperature_trend.ipynb`](hometown_temperature_trend.ipynb) | Python · Colab | NOAA NCEI |

## Intermediate

| Project | File | Language | Data source |
|---------|------|----------|-------------|
| Rebuild the UCLA carbon tracker | [`ucla_carbon_tracker.Rmd`](ucla_carbon_tracker.Rmd) | R · RStudio | UC Annual Sustainability Reports |
| Track a watershed through a drought | [`watershed_drought.ipynb`](watershed_drought.ipynb) | Python · Colab | USGS NWIS streamflow |
| Connect pollution burden to air quality | [`pollution_burden_air_quality.Rmd`](pollution_burden_air_quality.Rmd) | R · RStudio | CalEnviroScreen + EPA AirNow |

## How to run

### Python (Colab)

1. On a project card, click **Open in Colab** (`.ipynb` only).
2. **Runtime → Run all**.

R projects use **View on GitHub** → download the `.Rmd` and open in RStudio or Posit Cloud.

### Python (local)

```bash
cd notebooks
python3 -m pip install -r requirements.txt
jupyter notebook la_air_quality_map.ipynb
```

### R (RStudio)

1. Open any `.Rmd` file.
2. Install packages when prompted (first chunk).
3. **Knit** or run chunks interactively.

## Data notes

| Notebook | Live by default? | Fallback |
|----------|------------------|----------|
| Air quality map | Sample (AirNow needs free API key) | `data/airnow_la_sample.json` |
| Temperature trend | Yes (NOAA API) | `data/noaa_lax_tmax_daily.csv` |
| CalEnviroScreen burden | Yes (ArcGIS) | `data/ces4_la_county.json` |
| UCLA carbon tracker | Bundled UC verified series | `data/ucla_emissions.csv` |
| Watershed drought | Yes (USGS NWIS) | — |
| Burden + air quality | CES live + AirNow sample | `data/airnow_la_sample.json` |

## Adding notebooks

Update the `notebook` field in [`projects.html`](../projects.html) and link the matching explainer on [`datasets.html`](../datasets.html).
