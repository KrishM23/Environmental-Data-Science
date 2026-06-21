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

## Advanced

| Project | File | Language | Data source |
|---------|------|----------|-------------|
| Map California's largest emitters | [`california_emitters_map.ipynb`](california_emitters_map.ipynb) | Python · Colab | Climate TRACE CO₂ (334 CA facilities, 2022) |
| Compare heat-wave trends across Western cities | [`western_heat_waves.ipynb`](western_heat_waves.ipynb) | Python · Colab | NOAA NCEI (live daily TMAX) |
| Measure ice-sheet change with ICESat-2 | [`icesat2_elevation_change.ipynb`](icesat2_elevation_change.ipynb) | Python · Colab | NASA ATL06 via Earthdata |
| Do burdened communities sit near major emitters? | [`burden_near_emitters.Rmd`](burden_near_emitters.Rmd) | R · RStudio | CalEnviroScreen + Climate TRACE |

## How to run (mentors)

**Suggested session:** Intro (5 min) → work through sections with check-ins (45–90 min) → takeaway writing (10 min).

- **Python / Colab:** Click **Open in Colab** on project cards. Read the *For mentors* box at the top with the student before running code.
- **R / RStudio:** Open the `.Rmd`, run chunk-by-chunk, use **Mentor check-in** questions literally — they are written for you.
- Each section follows: **Goal → Concept → Run cell → You should see → Mentor check-in**

### AirNow API key (Colab)

1. Open the notebook in Colab.
2. Run **Step 0** and paste your free key between the quotes.
3. Run the rest top to bottom.

No Colab Secrets needed. **Do not commit a notebook that still contains your key.**

Local runs: leave Step 0 empty and use a `.env` file (see `.env.example`).

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
| Air quality map | Live AirNow (free API key required) | — |
| Temperature trend | Yes (NOAA API) | `data/noaa_lax_tmax_daily.csv` (offline only) |
| CalEnviroScreen burden | Yes (ArcGIS) | `data/ces4_la_county.json` (offline only) |
| UCLA carbon tracker | Bundled UC verified series | `data/ucla_emissions.csv` |
| Watershed drought | Yes (USGS NWIS) | — |
| Burden + air quality | CES live + AirNow live (API key) | — |
| California emitters map | Climate TRACE v5.7.0 extract (2022); optional live zip refresh | `data/climate_trace_ca_facilities.csv` |
| Western heat waves | Yes (NOAA NCEI, decade pulls) | — |
| ICESat-2 elevation change | Yes (Earthdata + ATL06 HDF5 download) | — |
| Burden near emitters | CES ArcGIS + Climate TRACE extract | `data/climate_trace_ca_facilities.csv` |

## Adding notebooks

Update the `notebook` field in [`projects.html`](../projects.html) and link the matching explainer on [`datasets.html`](../datasets.html).
