module.exports = {
  "title": "Making maps",
  "track": "viz",
  "tool": "Both",
  "level": "intermediate",
  "time": "~5-6 hrs",
  "lede": "Environmental data is almost always tied to place. A good map answers \"where?\" instantly — where the heat is worst, which communities bear the pollution, where emitters cluster. This lesson gets you from coordinates to clear thematic maps in Python and R.",
  "learn": [
    "Plot points from latitude and longitude",
    "Understand the choropleth (shaded-area) map",
    "Join tabular data to geographic boundaries",
    "Choose colour scales that do not mislead",
    "Build interactive maps with Folium",
    "Make static maps with ggplot2 and sf"
  ],
  "prereqs": [
    {
      "id": "pandas",
      "label": "pandas"
    },
    {
      "id": "matplotlib-seaborn",
      "label": "matplotlib"
    }
  ],
  "resources": [
    {
      "name": "GeoPandas: mapping",
      "url": "https://geopandas.org/en/stable/docs/user_guide/mapping.html",
      "kind": "docs"
    },
    {
      "name": "Folium (interactive maps)",
      "url": "https://python-visualization.github.io/folium/",
      "kind": "docs"
    },
    {
      "name": "ColorBrewer palettes",
      "url": "https://colorbrewer2.org/",
      "kind": "tool"
    }
  ],
  "unlock": {
    "label": "Map LA’s air quality",
    "url": "projects.html",
    "blurb": "Plot monitoring stations and shade neighbourhoods by pollution — a map-first project."
  },
  "content": [
    {
      "type": "p",
      "html": "There are two maps you will make most often: <strong>point maps</strong> (a dot per location) and <strong>choropleths</strong> (areas shaded by a value). Python uses GeoPandas and Folium; R uses the <code>sf</code> package with ggplot2. The geospatial deep-dive is in the <a class=\"inline\" href=\"lesson.html?id=geospatial\">geospatial lesson</a>."
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "Maps are joins plus geometry.",
      "html": "Every thematic map combines a spatial layer (points or polygons) with a data column to colour or size by. If the map looks wrong, check the join key before tweaking colours."
    },
    {
      "type": "h2",
      "text": "Coordinates: latitude and longitude"
    },
    {
      "type": "p",
      "html": "Latitude measures north–south (equator = 0). Longitude measures east–west (Greenwich = 0). In plotting, <strong>longitude is x</strong> and <strong>latitude is y</strong>."
    },
    {
      "type": "table",
      "head": [
        "Column",
        "Axis",
        "LA example"
      ],
      "rows": [
        [
          "<code>lon</code> / <code>longitude</code>",
          "x (horizontal)",
          "-118.24"
        ],
        [
          "<code>lat</code> / <code>latitude</code>",
          "y (vertical)",
          "34.05"
        ]
      ]
    },
    {
      "type": "callout",
      "variant": "warn",
      "title": "Lon is x, lat is y.",
      "html": "Swapping them is the classic mapping bug — your data ends up in the wrong ocean."
    },
    {
      "type": "h2",
      "text": "Quick point map with matplotlib"
    },
    {
      "type": "p",
      "html": "If you have lat/lon columns, a scatter plot is already a map. Colour points by AQI or emissions for instant spatial context."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(7, 7))\nsc = ax.scatter(stations[\"lon\"], stations[\"lat\"],\n                c=stations[\"aqi\"], cmap=\"YlOrRd\", s=60, edgecolors=\"white\", linewidth=0.5)\nplt.colorbar(sc, ax=ax, label=\"AQI\")\nax.set_xlabel(\"Longitude\")\nax.set_ylabel(\"Latitude\")\nax.set_title(\"Air-quality stations coloured by AQI\")\nax.set_aspect(\"equal\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h3",
      "text": "Size points by a third variable"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "sizes = stations[\"emissions_mtco2e\"] / stations[\"emissions_mtco2e\"].max() * 200\nax.scatter(stations[\"lon\"], stations[\"lat\"], s=sizes, c=stations[\"aqi\"],\n           cmap=\"YlOrRd\", alpha=0.7)\nax.set_title(\"Station AQI (colour) and facility size (area)\")"
    },
    {
      "type": "h2",
      "text": "GeoPandas: spatial data frames"
    },
    {
      "type": "p",
      "html": "A <strong>GeoDataFrame</strong> is a pandas DataFrame plus a <code>geometry</code> column (points, lines, or polygons). Read shapefiles and GeoJSON directly."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import geopandas as gpd\n\ntracts = gpd.read_file(\"la_tracts.geojson\")\nprint(tracts.crs)       # coordinate reference system\nprint(tracts.head())\ntracts.plot(figsize=(6, 6), edgecolor=\"gray\", facecolor=\"none\")"
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "CRS matters.",
      "html": "Every spatial layer has a CRS (coordinate system). Layers in different CRS must be reprojected before joining or measuring distance. The geospatial lesson covers this in depth."
    },
    {
      "type": "h2",
      "text": "Choropleths: shading areas"
    },
    {
      "type": "p",
      "html": "A choropleth shades regions — census tracts, counties, zip codes — by a value like burden score or asthma rate. You need boundary geometry plus a data value per region, joined on a shared ID."
    },
    {
      "type": "steps",
      "items": [
        {
          "title": "Load boundaries",
          "text": "Read a GeoJSON or shapefile with one row per region and a geometry column."
        },
        {
          "title": "Prepare tabular data",
          "text": "Ensure your burden or AQI table has the same ID format as the boundaries."
        },
        {
          "title": "Join",
          "text": "Merge on the shared key (e.g. tract_id, GEOID, FIPS)."
        },
        {
          "title": "Plot",
          "text": "Call .plot(column=\"burden_score\", cmap=\"YlOrRd\", legend=True)."
        }
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "merged = tracts.merge(burden_df, on=\"tract_id\", how=\"left\")\n\nfig, ax = plt.subplots(figsize=(8, 8))\nmerged.plot(column=\"burden_score\", cmap=\"YlOrRd\", legend=True,\n            ax=ax, edgecolor=\"white\", linewidth=0.3)\nax.set_axis_off()\nax.set_title(\"Pollution burden by census tract, Los Angeles\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "callout",
      "variant": "warn",
      "title": "The join is everything.",
      "html": "If the map is blank or patchy, IDs did not match. A common gotcha: <code>6037</code> (integer) vs <code>\"06037\"</code> (zero-padded string). Standardise before merging."
    },
    {
      "type": "h2",
      "text": "Colour scales that tell the truth"
    },
    {
      "type": "list",
      "items": [
        "<strong>Sequential</strong> (YlOrRd, Blues) for low-to-high values like AQI or burden.",
        "<strong>Diverging</strong> (RdBu, BrBG) for values above/below a meaningful midpoint like temperature anomaly.",
        "<strong>Qualitative</strong> (Set2, tab10) for categories — land use type, facility class.",
        "<strong>Avoid rainbow / jet</strong> — it invents boundaries not in the data and fails colour-blind readers."
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "merged.plot(column=\"burden_score\", cmap=\"YlOrRd\", legend=True,\n            scheme=\"quantiles\", k=5)   # 5-class quantile bins"
    },
    {
      "type": "p",
      "html": "Binning into classes (quantiles, equal intervals) can clarify or distort. Large polygons dominate visually even when few people live there — always note that choropleths show area, not people."
    },
    {
      "type": "h2",
      "text": "Classified vs. continuous choropleths"
    },
    {
      "type": "table",
      "head": [
        "Approach",
        "Pros",
        "Cons"
      ],
      "rows": [
        [
          "Continuous colour",
          "Preserves full range",
          "Hard to read exact values"
        ],
        [
          "Quantile bins",
          "Every class has data",
          "Hides absolute scale"
        ],
        [
          "Equal interval",
          "Simple legend",
          "Empty classes possible"
        ],
        [
          "Natural breaks",
          "Finds clusters",
          "Opaque without explanation"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Interactive maps with Folium"
    },
    {
      "type": "p",
      "html": "Folium builds Leaflet web maps you can pan and zoom. Ideal for embedding station networks or facility locations in a notebook or HTML page."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import folium\n\nm = folium.Map(location=[34.05, -118.24], zoom_start=10, tiles=\"CartoDB positron\")\nfor _, row in stations.iterrows():\n    folium.CircleMarker(\n        location=[row[\"lat\"], row[\"lon\"]],\n        radius=6,\n        color=\"#2F6B4F\",\n        fill=True,\n        fill_opacity=0.7,\n        popup=row[\"station\"] + \": AQI \" + str(row[\"aqi\"])\n    ).add_to(m)\nm"
    },
    {
      "type": "h3",
      "text": "Choropleth layers in Folium"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "folium.Choropleth(\n    geo_data=tracts.__geo_interface__,\n    data=burden_df,\n    columns=[\"tract_id\", \"burden_score\"],\n    key_on=\"feature.properties.tract_id\",\n    fill_color=\"YlOrRd\",\n    legend_name=\"Burden score\"\n).add_to(m)"
    },
    {
      "type": "h2",
      "text": "Maps in R with sf and ggplot2"
    },
    {
      "type": "p",
      "html": "The <code>sf</code> package stores simple features. Read with <code>st_read()</code>, join with dplyr, and plot with <code>geom_sf()</code>."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "library(tidyverse)\nlibrary(sf)\n\ntracts <- st_read(\"la_tracts.geojson\")\nburden <- read_csv(\"burden_scores.csv\")\n\njoined <- tracts |>\n  left_join(burden, by = \"tract_id\")\n\nggplot(joined) +\n  geom_sf(aes(fill = burden_score), color = \"white\", linewidth = 0.2) +\n  scale_fill_viridis_c(option = \"magma\", name = \"Burden\") +\n  labs(title = \"Pollution burden across LA census tracts\") +\n  theme_void()"
    },
    {
      "type": "callout",
      "variant": "tip",
      "title": "theme_void() for maps.",
      "html": "Remove axes and grid with <code>theme_void()</code> — maps do not need x/y tick labels when the geography is recognisable."
    },
    {
      "type": "h2",
      "text": "Point maps in ggplot2"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot() +\n  geom_sf(data = tracts, fill = \"gray95\", color = \"gray70\", linewidth = 0.2) +\n  geom_point(data = stations, aes(x = lon, y = lat, color = aqi), size = 3) +\n  scale_color_viridis_c(option = \"inferno\", name = \"AQI\") +\n  coord_sf() +\n  labs(title = \"Monitoring stations on LA tract boundaries\") +\n  theme_minimal()"
    },
    {
      "type": "h2",
      "text": "Basemaps and context"
    },
    {
      "type": "p",
      "html": "Bare scatter maps float in space. Adding city boundaries, roads, or a muted basemap helps readers orient. In GeoPandas, plot boundaries underneath points with layered <code>plot()</code> calls."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(8, 8))\ntracts.plot(ax=ax, facecolor=\"none\", edgecolor=\"lightgray\", linewidth=0.4)\nstations.plot(ax=ax, column=\"aqi\", cmap=\"YlOrRd\", markersize=40, legend=True)\nax.set_axis_off()\nax.set_title(\"AQI stations within LA census tracts\")\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Map design checklist"
    },
    {
      "type": "olist",
      "items": [
        "Title states the finding, not just \"Map of X\".",
        "Legend shows units and bin breaks if classified.",
        "North arrow or recognisable geography for orientation.",
        "Source line: where boundaries and data came from.",
        "Note caveats: unmeasured areas, edge effects, MAUP."
      ]
    },
    {
      "type": "callout",
      "variant": "warn",
      "title": "The Modifiable Areal Unit Problem.",
      "html": "Choropleth patterns depend on how boundaries are drawn. A \"high burden\" tract next to a \"low burden\" tract may average very different lived experiences block by block. Maps summarise — they do not replace local knowledge."
    },
    {
      "type": "h2",
      "text": "Emissions facility maps"
    },
    {
      "type": "p",
      "html": "Point maps of industrial emitters reveal clustering near ports, refineries, and freight corridors. Combine with population or burden choropleths to tell an environmental justice story."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(9, 9))\ntracts.plot(ax=ax, column=\"burden_score\", cmap=\"YlOrRd\", legend=True, alpha=0.8)\nfacilities.plot(ax=ax, color=\"black\", markersize=15, marker=\"x\", label=\"Major emitter\")\nax.legend()\nax.set_title(\"High-burden tracts overlap industrial emitter clusters\")\nax.set_axis_off()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Heat and climate raster previews"
    },
    {
      "type": "p",
      "html": "Gridded temperature or precipitation data can be shown as a smoothed surface. For quick maps, treat grid cell centres as points or use dedicated raster tools (see the gridded-remote-sensing lesson)."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "ax = heat_df.plot.scatter(x=\"lon\", y=\"lat\", c=\"temp_anomaly_c\",\n                          cmap=\"RdBu_r\", figsize=(8, 6), s=10)\nax.set_title(\"Western US temperature anomaly, summer 2023\")\nplt.colorbar(ax.collections[0], label=\"°C anomaly\")\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Exporting maps"
    },
    {
      "type": "list",
      "items": [
        "Static: <code>fig.savefig(\"burden_map.png\", dpi=200, bbox_inches=\"tight\")</code> in Python.",
        "Static: <code>ggsave(\"burden_map.png\", width = 8, height = 8, dpi = 200)</code> in R.",
        "Interactive: <code>m.save(\"stations_map.html\")</code> for Folium.",
        "Use higher DPI for print; 150–200 for slides."
      ]
    },
    {
      "type": "h2",
      "text": "Troubleshooting"
    },
    {
      "type": "table",
      "head": [
        "Symptom",
        "Likely cause",
        "Fix"
      ],
      "rows": [
        [
          "Map in wrong location",
          "Swapped lat/lon",
          "Lon on x, lat on y"
        ],
        [
          "All one colour",
          "Join failed (NaN values)",
          "Check merge keys and dtypes"
        ],
        [
          "Tiny squished map",
          "Aspect ratio wrong",
          "<code>ax.set_aspect(\"equal\")</code> or <code>coord_sf()</code>"
        ],
        [
          "Folium blank tiles",
          "No internet in sandbox",
          "Use offline tiles or static GeoPandas"
        ],
        [
          "R geom_sf error",
          "Not an sf object",
          "Wrap with <code>st_as_sf()</code> or read via <code>st_read</code>"
        ]
      ]
    },
    {
      "type": "exercise",
      "title": "Map the monitoring network",
      "html": "From a table of stations with <code>lat</code>, <code>lon</code>, and <code>aqi</code>, make a static point map coloured by AQI with a colour bar and a descriptive title. Bonus: rebuild as an interactive Folium map with popups.",
      "hint": "For the static version: <code>ax.scatter(lon, lat, c=aqi, cmap=\"YlOrRd\")</code> plus <code>plt.colorbar</code>. Watch the lon/lat order.",
      "solution": {
        "lang": "python",
        "code": "import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(7, 7))\nsc = ax.scatter(stations[\"lon\"], stations[\"lat\"],\n                c=stations[\"aqi\"], cmap=\"YlOrRd\", s=60)\nplt.colorbar(sc, ax=ax, label=\"AQI\")\nax.set_aspect(\"equal\")\nax.set_title(\"LA monitoring stations: highest AQI inland and near freeways\")\nax.set_xlabel(\"Longitude\")\nax.set_ylabel(\"Latitude\")\nplt.tight_layout()\nplt.show()"
      }
    },
    {
      "type": "exercise",
      "title": "Choropleth burden map",
      "html": "Join tract boundaries to a burden-score table on <code>tract_id</code>. Plot a choropleth with a sequential palette and a legend. Title the finding. How many tracts failed to join? Investigate mismatched IDs.",
      "hint": "Use <code>merge(..., how=\"left\", indicator=True)</code> or <code>anti_join</code> in R to find unmatched rows.",
      "solution": {
        "lang": "python",
        "code": "merged = tracts.merge(burden_df, on=\"tract_id\", how=\"left\", indicator=True)\nprint(merged[\"_merge\"].value_counts())\n\nfig, ax = plt.subplots(figsize=(8, 8))\nmerged.plot(column=\"burden_score\", cmap=\"YlOrRd\", legend=True,\n            ax=ax, edgecolor=\"white\", linewidth=0.2, missing_kwds={\"color\": \"lightgray\"})\nax.set_axis_off()\nax.set_title(\"South LA and port-adjacent tracts carry the highest burden\")\nplt.show()"
      }
    },
    {
      "type": "exercise",
      "title": "R choropleth with ggplot2",
      "html": "In R, read tract polygons and burden data, join with dplyr, and plot with <code>geom_sf(aes(fill = burden_score))</code>. Use a viridis fill scale and <code>theme_void()</code>. Add a title stating which region stands out.",
      "hint": "library(sf); library(tidyverse); st_read(); left_join(); ggplot() + geom_sf() + scale_fill_viridis_c().",
      "solution": {
        "lang": "r",
        "code": "library(tidyverse)\nlibrary(sf)\n\ntracts <- st_read(\"la_tracts.geojson\")\njoined <- tracts |> left_join(burden, by = \"tract_id\")\n\nggplot(joined) +\n  geom_sf(aes(fill = burden_score), color = \"white\", linewidth = 0.15) +\n  scale_fill_viridis_c(option = \"inferno\", name = \"Burden\") +\n  labs(title = \"Pollution burden concentrates in southern and eastern LA\") +\n  theme_void()"
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "Point maps are scatter plots of (lon, lat) — colour or size by a value.",
        "Choropleths = region geometry + a value per region, joined on a shared ID.",
        "Match colour scale to data: sequential, diverging — never rainbow.",
        "Folium for interactive web maps; GeoPandas/sf + ggplot2 for publication static maps."
      ]
    }
  ]
};
