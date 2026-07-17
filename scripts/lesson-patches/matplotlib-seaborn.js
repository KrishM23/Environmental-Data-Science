module.exports = {
  "title": "Plotting with matplotlib & seaborn",
  "track": "viz",
  "tool": "Python",
  "level": "beginner",
  "time": "~5-6 hrs",
  "lede": "A chart turns a wall of numbers into an insight you can see. matplotlib is Python’s foundational plotting library; seaborn sits on top for beautiful statistical charts in one line. Together they cover almost everything you’ll need for environmental data — AQI trends, emissions comparisons, climate time series, and burden distributions.",
  "learn": [
    "Make line, bar, scatter and histogram charts",
    "Label axes, titles and legends properly",
    "Use seaborn for fast statistical plots",
    "Plot straight from a DataFrame",
    "Style charts for reports and colour-blind readers",
    "Save publication-ready figures"
  ],
  "prereqs": [
    {
      "id": "pandas",
      "label": "pandas"
    }
  ],
  "resources": [
    {
      "name": "matplotlib quick start",
      "url": "https://matplotlib.org/stable/users/explain/quick_start.html",
      "kind": "docs"
    },
    {
      "name": "seaborn tutorial",
      "url": "https://seaborn.pydata.org/tutorial.html",
      "kind": "docs"
    },
    {
      "name": "Python Graph Gallery",
      "url": "https://python-graph-gallery.com/",
      "kind": "gallery"
    }
  ],
  "unlock": {
    "label": "Map LA’s air quality",
    "url": "projects.html",
    "blurb": "Chart AQI over time and across stations to see the story in the data."
  },
  "content": [
    {
      "type": "p",
      "html": "Import the two libraries by convention. In a Jupyter or Colab notebook, charts appear inline automatically after <code>plt.show()</code> or the last expression."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\n\nsns.set_theme(style=\"whitegrid\", palette=\"colorblind\")"
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "How to read this lesson.",
      "html": "Each dark code block is runnable. Environmental examples use familiar columns — <code>aqi</code>, <code>month</code>, <code>station</code>, <code>emissions_mtco2e</code> — but the plotting patterns work on any tidy table."
    },
    {
      "type": "h2",
      "text": "Figure and axes: the building blocks"
    },
    {
      "type": "p",
      "html": "Every matplotlib chart starts with a <strong>figure</strong> (the canvas) and one or more <strong>axes</strong> (the plot area). The pattern <code>fig, ax = plt.subplots()</code> gives you both; you draw on <code>ax</code>."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(8, 4))\nax.plot([1, 2, 3], [55, 72, 95], marker=\"o\", color=\"#2F6B4F\")\nax.set_title(\"Example AQI trend\")\nax.set_xlabel(\"Month\")\nax.set_ylabel(\"AQI\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "Figure vs. axes.",
      "html": "Confusingly, <code>axes</code> means the plot panel, not the x/y axis lines. One figure can hold several axes via <code>plt.subplots(2, 1)</code> for stacked panels."
    },
    {
      "type": "table",
      "head": [
        "Object",
        "What it is",
        "Typical methods"
      ],
      "rows": [
        [
          "<code>fig</code>",
          "Whole image / canvas",
          "<code>fig.savefig()</code>, <code>fig.suptitle()</code>"
        ],
        [
          "<code>ax</code>",
          "One plot panel",
          "<code>ax.plot()</code>, <code>ax.set_title()</code>, <code>ax.legend()</code>"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Line charts: trends over time"
    },
    {
      "type": "p",
      "html": "Line charts answer <em>how does this change over time?</em> — monthly AQI, annual emissions, decadal temperature. Plot x as time (or ordered categories) and y as the measured value."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "monthly = df.groupby(\"month\")[\"aqi\"].mean()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(monthly.index, monthly.values, marker=\"o\", linewidth=2, color=\"#2F6B4F\")\nax.axhline(100, color=\"gray\", linestyle=\"--\", linewidth=1, label=\"Unhealthy threshold\")\nax.set_title(\"LA air quality worsens through summer\")\nax.set_xlabel(\"Month\")\nax.set_ylabel(\"Average AQI\")\nax.legend()\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "callout",
      "variant": "tip",
      "title": "Reference lines add context.",
      "html": "<code>ax.axhline(100)</code> draws a horizontal line at AQI 100 — the EPA \"Unhealthy for Sensitive Groups\" breakpoint. Thresholds turn a trend into a policy story."
    },
    {
      "type": "h3",
      "text": "Multiple series on one chart"
    },
    {
      "type": "p",
      "html": "Loop over stations or call <code>plot</code> once per group. A legend tells readers which line is which."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(9, 4))\nfor station, grp in df.groupby(\"station\"):\n    m = grp.groupby(\"month\")[\"aqi\"].mean()\n    ax.plot(m.index, m.values, marker=\"o\", label=station)\nax.set_title(\"Seasonal AQI varies by monitoring station\")\nax.set_xlabel(\"Month\")\nax.set_ylabel(\"Average AQI\")\nax.legend(title=\"Station\", bbox_to_anchor=(1.02, 1), loc=\"upper left\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Bar charts: compare categories"
    },
    {
      "type": "p",
      "html": "Bar charts compare discrete groups — emissions by sector, mean AQI by neighbourhood, facility counts by county. Sort bars by value so the ranking is obvious."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "sector = df.groupby(\"sector\")[\"emissions_mtco2e\"].sum().sort_values(ascending=True)\n\nfig, ax = plt.subplots(figsize=(7, 5))\nax.barh(sector.index, sector.values, color=\"#5B8BB0\")\nax.set_xlabel(\"Total emissions (MtCO2e)\")\nax.set_title(\"Transport dominates California sector emissions\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "callout",
      "variant": "warn",
      "title": "Bar charts must start at zero.",
      "html": "Truncating the y-axis exaggerates small differences. Line charts can zoom; bar charts should not — the bar length is the visual argument."
    },
    {
      "type": "h3",
      "text": "Grouped and stacked bars"
    },
    {
      "type": "p",
      "html": "Use grouped bars to compare sub-categories side by side; stacked bars show part-to-whole (e.g. emissions sources within a sector)."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "pivot = df.pivot_table(index=\"year\", columns=\"fuel\", values=\"emissions_mtco2e\", aggfunc=\"sum\")\npivot.plot(kind=\"bar\", stacked=True, figsize=(8, 4), colormap=\"YlOrRd\")\nplt.ylabel(\"Emissions (MtCO2e)\")\nplt.title(\"Fossil emissions by fuel type over time\")\nplt.xticks(rotation=0)\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Scatter plots: relationships between variables"
    },
    {
      "type": "p",
      "html": "Scatter plots reveal correlation — temperature vs AQI, population vs burden score, wind speed vs particulate matter. Each point is one observation."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(6, 5))\nax.scatter(df[\"temp_c\"], df[\"pm25\"], alpha=0.5, s=30, color=\"#2F6B4F\")\nax.set_xlabel(\"Temperature (°C)\")\nax.set_ylabel(\"PM2.5 (µg/m³)\")\nax.set_title(\"Warmer days tend toward higher particulate levels\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h3",
      "text": "Colour a third variable"
    },
    {
      "type": "p",
      "html": "Map a third column to colour with the <code>c</code> argument and add a colour bar. Great for showing AQI category or land-use type on a temp–pollution scatter."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(7, 5))\nsc = ax.scatter(df[\"temp_c\"], df[\"pm25\"], c=df[\"aqi\"], cmap=\"YlOrRd\", alpha=0.6, s=40)\nplt.colorbar(sc, ax=ax, label=\"AQI\")\nax.set_xlabel(\"Temperature (°C)\")\nax.set_ylabel(\"PM2.5\")\nax.set_title(\"Pollution–temperature relationship coloured by AQI\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Histograms and distributions"
    },
    {
      "type": "p",
      "html": "Histograms show how values spread — the distribution of daily AQI readings, facility emission sizes, or tract-level burden scores."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(7, 4))\nax.hist(df[\"aqi\"], bins=30, color=\"#5B8BB0\", edgecolor=\"white\")\nax.axvline(df[\"aqi\"].median(), color=\"crimson\", linestyle=\"--\", label=\"Median\")\nax.set_xlabel(\"AQI\")\nax.set_ylabel(\"Number of days\")\nax.set_title(\"Most LA days fall in the Moderate AQI range\")\nax.legend()\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h3",
      "text": "Overlaid distributions by group"
    },
    {
      "type": "p",
      "html": "Compare distributions across categories with side-by-side histograms or KDE curves. seaborn makes this one line."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(8, 4))\nsns.histplot(data=df, x=\"burden_score\", hue=\"region\", kde=True, ax=ax, alpha=0.5)\nax.set_title(\"Pollution burden score distribution by region\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "seaborn: statistical plots from DataFrames"
    },
    {
      "type": "p",
      "html": "seaborn understands tidy DataFrames. Pass <code>data=df</code> plus column names for <code>x</code>, <code>y</code>, and <code>hue</code>; it handles legends, palettes, and sensible defaults."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "sns.lineplot(data=df, x=\"month\", y=\"aqi\", hue=\"station\", marker=\"o\")\nplt.title(\"Monthly AQI by station\")\nplt.show()"
    },
    {
      "type": "table",
      "head": [
        "Function",
        "Shows",
        "Environmental example"
      ],
      "rows": [
        [
          "<code>sns.lineplot</code>",
          "Trend over x",
          "AQI by month"
        ],
        [
          "<code>sns.barplot</code>",
          "Mean per category",
          "Mean PM2.5 by land use"
        ],
        [
          "<code>sns.boxplot</code>",
          "Spread by group",
          "AQI distribution per station"
        ],
        [
          "<code>sns.scatterplot</code>",
          "Two numeric vars",
          "Temp vs ozone"
        ],
        [
          "<code>sns.heatmap</code>",
          "Matrix of values",
          "Correlation of pollutants"
        ]
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(7, 4))\nsns.boxplot(data=df, x=\"station\", y=\"aqi\", ax=ax, palette=\"colorblind\")\nax.set_title(\"AQI spread differs across monitoring stations\")\nplt.xticks(rotation=45, ha=\"right\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "callout",
      "variant": "tip",
      "title": "Fast exploration.",
      "html": "<code>sns.pairplot(df[[\"temp_c\",\"pm25\",\"aqi\",\"wind_kmh\"]])</code> grids every variable against every other — noisy with many columns, brilliant for four or five."
    },
    {
      "type": "h2",
      "text": "Colour, style and accessibility"
    },
    {
      "type": "list",
      "items": [
        "<strong>Use colour with intent</strong> — one highlight colour on grey context beats a rainbow.",
        "<strong>Colour-blind safe palettes</strong> — <code>sns.set_palette(\"colorblind\")</code> or matplotlib’s <code>tab10</code>.",
        "<strong>Sequential scales</strong> (YlOrRd) for low-to-high values like AQI or burden.",
        "<strong>Diverging scales</strong> (RdBu) for anomalies above/below a baseline.",
        "<strong>Avoid jet / rainbow</strong> — it invents false boundaries and fails accessibility tests."
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(8, 4))\nfor i, (name, grp) in enumerate(df.groupby(\"station\")):\n    ax.plot(grp[\"month\"], grp[\"aqi\"], label=name, color=plt.cm.tab10(i))\nax.set_title(\"Stations coloured with tab10 (colour-blind friendly)\")\nax.legend()\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Labels, legends and annotations"
    },
    {
      "type": "p",
      "html": "An unlabelled chart cannot be trusted. Title the finding, not just the axes. Annotate spikes — wildfire smoke, heat waves, policy changes."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(9, 4))\nax.plot(df[\"date\"], df[\"aqi\"], color=\"#2F6B4F\")\nax.annotate(\"Wildfire smoke event\", xy=(df[\"date\"].iloc[180], df[\"aqi\"].iloc[180]),\n            xytext=(df[\"date\"].iloc[150], df[\"aqi\"].iloc[180] + 30),\n            arrowprops=dict(arrowstyle=\"->\", color=\"gray\"))\nax.set_title(\"September spike driven by regional wildfire smoke\")\nax.set_xlabel(\"Date\")\nax.set_ylabel(\"Daily AQI\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "olist",
      "items": [
        "<code>ax.set_title()</code> — state the finding.",
        "<code>ax.set_xlabel()</code> / <code>ax.set_ylabel()</code> — include units.",
        "<code>ax.legend()</code> — identify coloured series.",
        "<code>ax.annotate()</code> — point at the event that matters."
      ]
    },
    {
      "type": "h2",
      "text": "Multiple panels with subplots"
    },
    {
      "type": "p",
      "html": "Compare pollutants or regions side by side with <code>plt.subplots(nrows, ncols)</code>. Share an axis when scales match."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True)\nfor ax, col, title in zip(axes, [\"pm25\", \"ozone\"], [\"PM2.5\", \"Ozone\"]):\n    ax.plot(df[\"month\"], df.groupby(\"month\")[col].mean(), marker=\"o\", color=\"#2F6B4F\")\n    ax.set_title(title)\n    ax.set_xlabel(\"Month\")\naxes[0].set_ylabel(\"Concentration\")\nfig.suptitle(\"Summer peaks in both PM2.5 and ozone\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "When to facet instead.",
      "html": "If you have many groups, seaborn’s <code>relplot(..., col=\"station\")</code> or <code>FacetGrid</code> auto-layouts small multiples — less boilerplate than manual subplots."
    },
    {
      "type": "h2",
      "text": "Plot straight from pandas"
    },
    {
      "type": "p",
      "html": "For quick exploration, DataFrames expose <code>.plot()</code> which wraps matplotlib. Fine for notebooks; switch to explicit <code>ax</code> methods when you need fine control."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df.groupby(\"year\")[\"emissions_mtco2e\"].sum().plot(kind=\"bar\", color=\"#5B8BB0\", figsize=(7, 4))\nplt.ylabel(\"MtCO2e\")\nplt.title(\"Annual reported emissions trend\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Date axes and formatting"
    },
    {
      "type": "p",
      "html": "Environmental time series need readable date ticks. Parse dates first, then use matplotlib’s date locator and formatter."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import matplotlib.dates as mdates\n\ndf[\"date\"] = pd.to_datetime(df[\"date\"])\nfig, ax = plt.subplots(figsize=(10, 4))\nax.plot(df[\"date\"], df[\"co2_ppm\"], color=\"#2F6B4F\")\nax.xaxis.set_major_locator(mdates.YearLocator(5))\nax.xaxis.set_major_formatter(mdates.DateFormatter(\"%Y\"))\nax.set_title(\"Mauna Loa CO2 trend\")\nax.set_ylabel(\"CO2 (ppm)\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h2",
      "text": "Saving figures for reports"
    },
    {
      "type": "p",
      "html": "Save vector PDF for print, PNG for slides and web. Always use <code>bbox_inches=\"tight\"</code> so labels are not clipped."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "fig, ax = plt.subplots(figsize=(8, 4))\nax.plot(monthly.index, monthly.values, marker=\"o\", color=\"#2F6B4F\")\nax.set_title(\"Air quality worsens through summer\")\nfig.savefig(\"aqi_by_month.png\", dpi=150, bbox_inches=\"tight\")\nfig.savefig(\"aqi_by_month.pdf\", bbox_inches=\"tight\")\nplt.show()"
    },
    {
      "type": "list",
      "items": [
        "<code>dpi=150</code> or higher for crisp PNG slides.",
        "<code>bbox_inches=\"tight\"</code> trims whitespace.",
        "Save <em>before</em> <code>plt.show()</code> in scripts; order matters less in notebooks.",
        "Name files descriptively: <code>la_aqi_summer_2024.png</code>."
      ]
    },
    {
      "type": "h2",
      "text": "Common mistakes and fixes"
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
          "Empty plot",
          "Wrong column names or all NaN",
          "Print <code>df.head()</code> and check dtypes"
        ],
        [
          "Overlapping x labels",
          "Too many categories",
          "<code>plt.xticks(rotation=45, ha=\"right\")</code>"
        ],
        [
          "Legend covers data",
          "Default position",
          "<code>bbox_to_anchor</code> outside the plot"
        ],
        [
          "Different scales compared",
          "Dual y-axis temptation",
          "Two panels with <code>sharex=True</code>"
        ],
        [
          "Tiny bars look huge",
          "Y-axis not at zero",
          "Reset ylim to include 0"
        ]
      ]
    },
    {
      "type": "exercise",
      "title": "Tell the summer AQI story",
      "html": "Using a dataset with <code>month</code> and <code>aqi</code>, compute the monthly average and make a clearly titled line chart that shows when air quality is worst. Add axis labels, a reference line at AQI 100, and save it as a PNG.",
      "hint": "<code>df.groupby(\"month\")[\"aqi\"].mean()</code> gives the y-values; use <code>ax.axhline(100)</code> for the threshold.",
      "solution": {
        "lang": "python",
        "code": "monthly = df.groupby(\"month\")[\"aqi\"].mean()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(monthly.index, monthly.values, marker=\"o\", color=\"#2F6B4F\", linewidth=2)\nax.axhline(100, color=\"gray\", linestyle=\"--\", label=\"Unhealthy threshold\")\nax.set_title(\"Air quality worsens through the summer\")\nax.set_xlabel(\"Month\")\nax.set_ylabel(\"Average AQI\")\nax.legend()\nfig.savefig(\"aqi_by_month.png\", dpi=150, bbox_inches=\"tight\")\nplt.show()"
      }
    },
    {
      "type": "exercise",
      "title": "Compare sector emissions",
      "html": "From a table with <code>sector</code> and <code>emissions_mtco2e</code>, create a horizontal bar chart sorted by total emissions. Title it with the finding (which sector dominates), label the x-axis with units, and ensure bars start at zero.",
      "hint": "Group with <code>.groupby(\"sector\")[\"emissions_mtco2e\"].sum().sort_values()</code>, then <code>ax.barh()</code>.",
      "solution": {
        "lang": "python",
        "code": "sector = df.groupby(\"sector\")[\"emissions_mtco2e\"].sum().sort_values()\n\nfig, ax = plt.subplots(figsize=(7, 5))\nax.barh(sector.index, sector.values, color=\"#5B8BB0\")\nax.set_xlabel(\"Total emissions (MtCO2e)\")\nax.set_title(\"Transport accounts for the largest share of emissions\")\nplt.tight_layout()\nplt.show()"
      }
    },
    {
      "type": "exercise",
      "title": "Explore pollutant correlations",
      "html": "Select numeric pollution and weather columns (<code>pm25</code>, <code>ozone</code>, <code>temp_c</code>, <code>wind_kmh</code>, <code>aqi</code>). Plot a seaborn heatmap of their correlation matrix with annotations. Write one sentence about the strongest relationship you see.",
      "hint": "<code>df[[\"pm25\",\"ozone\",\"temp_c\",\"wind_kmh\",\"aqi\"]].corr()</code> then <code>sns.heatmap(..., annot=True, cmap=\"RdBu_r\", center=0)</code>.",
      "solution": {
        "lang": "python",
        "code": "cols = [\"pm25\", \"ozone\", \"temp_c\", \"wind_kmh\", \"aqi\"]\ncorr = df[cols].corr()\n\nfig, ax = plt.subplots(figsize=(6, 5))\nsns.heatmap(corr, annot=True, cmap=\"RdBu_r\", center=0, ax=ax)\nax.set_title(\"Pollutant and weather correlations\")\nplt.tight_layout()\nplt.show()\n# Example finding: PM2.5 and AQI are strongly positively correlated."
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "Build plots on an <code>ax</code> from <code>fig, ax = plt.subplots()</code>.",
        "Match chart to question: line for trends, bar to compare, scatter for relationships, hist for distributions.",
        "seaborn plots DataFrames in one line with <code>x</code>, <code>y</code>, <code>hue</code>.",
        "Title the finding, label with units, use accessible colours, and save with <code>fig.savefig()</code>."
      ]
    }
  ]
};
