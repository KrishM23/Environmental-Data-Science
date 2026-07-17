module.exports = {
  "title": "Data wrangling with pandas",
  "track": "data",
  "tool": "Python",
  "level": "beginner",
  "time": "~6-8 hrs",
  "lede": "pandas is the workhorse of environmental data science in Python. It turns messy monitoring tables from AirNow, NOAA, USGS, and Climate TRACE into something you can filter, group, and summarise in a line or two. If you learn one library deeply, make it this one.",
  "learn": [
    "Load CSV and URL data into a DataFrame",
    "Inspect, select, filter, and sort rows and columns",
    "Create new columns and label categories",
    "Group and aggregate to find environmental patterns",
    "Handle dates, missing values, merges, and reshaping"
  ],
  "prereqs": [
    {
      "id": "python-fundamentals",
      "label": "Python fundamentals"
    }
  ],
  "resources": [
    {
      "name": "Kaggle: pandas",
      "url": "https://www.kaggle.com/learn/pandas",
      "kind": "course"
    },
    {
      "name": "10 minutes to pandas",
      "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
      "kind": "docs"
    },
    {
      "name": "pandas cheat sheet",
      "url": "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf",
      "kind": "pdf"
    },
    {
      "name": "AirNow data format guide",
      "url": "https://docs.airnowapi.org/",
      "kind": "docs"
    }
  ],
  "unlock": {
    "label": "Map LA’s air quality",
    "url": "projects.html",
    "blurb": "A perfect first pandas project: load AQI readings, filter, group by station, and summarise."
  },
  "content": [
    {
      "type": "p",
      "html": "A <strong>DataFrame</strong> is a table with named columns and labelled rows. Environmental scientists use pandas to wrangle AirNow AQI readings, NOAA temperature grids, USGS streamflow records, and Climate TRACE emissions tables — all without writing loops for every row."
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "This lesson assumes you completed <a class=\"inline\" href=\"lesson.html?id=python-fundamentals\">Python fundamentals</a>. Open a Colab notebook and run each code block as you go.",
      "title": "How to follow along."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import pandas as pd\nimport numpy as np\n\n# Convention: import pandas as pd everywhere"
    },
    {
      "type": "h2",
      "text": "Why pandas for environmental data"
    },
    {
      "type": "p",
      "html": "Government agencies publish monitoring data as CSV files and API responses. A single LA air-quality year might have 8,760 hourly rows across dozens of stations. pandas lets you load that table, filter unhealthy days, and compute monthly averages in a handful of lines."
    },
    {
      "type": "table",
      "head": [
        "Source",
        "Typical format",
        "pandas entry point"
      ],
      "rows": [
        [
          "AirNow",
          "CSV or API JSON",
          "pd.read_csv() or pd.json_normalize()"
        ],
        [
          "NOAA",
          "CSV, NetCDF exports",
          "pd.read_csv() with parse_dates"
        ],
        [
          "USGS Water Services",
          "JSON time series",
          "pd.json_normalize() then set_index"
        ],
        [
          "Climate TRACE",
          "CSV facility lists",
          "pd.read_csv() with dtype hints"
        ],
        [
          "CalEnviroScreen",
          "CSV census tracts",
          "pd.read_csv() + groupby"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Loading data"
    },
    {
      "type": "h3",
      "text": "From a local CSV file"
    },
    {
      "type": "p",
      "html": "The workhorse is <code>pd.read_csv()</code>. Always inspect the result before analysing."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = pd.read_csv(\"la_air_quality.csv\")\n\nprint(df.head())       # first 5 rows\nprint(df.shape)       # (rows, columns)\nprint(df.columns.tolist())\nprint(df.dtypes)"
    },
    {
      "type": "h3",
      "text": "From a URL — no download needed"
    },
    {
      "type": "p",
      "html": "Terrain projects often read straight from a hosted URL. pandas fetches and parses in one step:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "url = \"https://files.airnowtech.org/?filename=AQI_LosAngeles.csv\"\ndf = pd.read_csv(url)\ndf.head()"
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "Run <code>df.head()</code>, <code>df.shape</code>, and <code>df.info()</code> on every new dataset. Thirty seconds of inspection prevents hours of debugging wrong assumptions.",
      "title": "Always look first."
    },
    {
      "type": "h3",
      "text": "Useful read_csv options"
    },
    {
      "type": "p",
      "html": "Real agency files have quirks. These parameters fix the most common ones:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = pd.read_csv(\n    \"noaa_daily_temps.csv\",\n    parse_dates=[\"DATE\"],          # parse date column on load\n    na_values=[-999, -9999, \"\"],   # treat sensor sentinels as missing\n    skiprows=2,                    # skip metadata header lines\n    sep=\";\",                       # European CSVs use semicolons\n    encoding=\"latin-1\"             # older EPA files\n)"
    },
    {
      "type": "h2",
      "text": "Inspecting a DataFrame"
    },
    {
      "type": "p",
      "html": "Before filtering or plotting, understand what you have."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df.head(10)          # peek at rows\ndf.tail(3)           # last rows\ndf.sample(5)         # random sample\ndf.info()            # column types + non-null counts\ndf.describe()        # numeric summary stats\ndf[\"station\"].value_counts()  # count per category"
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "If <code>describe()</code> shows a minimum AQI of <code>-999</code> or a max temperature of <code>9999</code>, those are almost certainly missing-data placeholders, not real readings. Replace them with <code>NaN</code> before analysing.",
      "title": "Watch for sentinel values."
    },
    {
      "type": "h2",
      "text": "Series and columns"
    },
    {
      "type": "p",
      "html": "Selecting one column returns a <strong>Series</strong> — a labelled 1-D array. Summary methods work directly on it:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "aqi = df[\"aqi\"]\nprint(type(aqi))       # pandas Series\nprint(aqi.mean())\nprint(aqi.median())\nprint(aqi.max())\nprint(aqi.std())"
    },
    {
      "type": "p",
      "html": "Select multiple columns with a list inside double brackets:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "subset = df[[\"station\", \"date\", \"aqi\", \"pm25\"]]\nsubset.head()"
    },
    {
      "type": "h2",
      "text": "Filtering rows with boolean masks"
    },
    {
      "type": "p",
      "html": "The most-used pandas skill: keep rows where a condition is <code>True</code>."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# unhealthy air days (AQI > 100)\nunhealthy = df[df[\"aqi\"] > 100]\n\n# summer months only\nsummer = df[df[\"month\"].isin([6, 7, 8, 9])]\n\n# PM2.5 above EPA daily standard (35 ug/m3)\nhigh_pm25 = df[df[\"pm25\"] > 35.0]"
    },
    {
      "type": "h3",
      "text": "Combining conditions"
    },
    {
      "type": "p",
      "html": "Use <code>&amp;</code> for AND and <code>|</code> for OR. Wrap each test in parentheses:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "bad_summer = df[(df[\"aqi\"] > 100) & (df[\"month\"] >= 6)]\n\n# either high ozone OR high PM2.5\npolluted = df[(df[\"o3_ppm\"] > 0.070) | (df[\"pm25\"] > 35)]"
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "Plain Python <code>and</code> / <code>or</code> do not work on Series. Always use <code>&amp;</code> / <code>|</code> with parentheses around each condition.",
      "title": "Use & and |, not and / or."
    },
    {
      "type": "h3",
      "text": "The .query() shortcut"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df.query(\"aqi > 100 and month >= 6 and station == 'Downtown LA'\")"
    },
    {
      "type": "h2",
      "text": "Sorting and ranking"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# worst air days first\ndf.sort_values(\"aqi\", ascending=False).head(10)\n\n# sort by multiple columns\ndf.sort_values([\"station\", \"date\"], ascending=[True, True])\n\n# rank stations by mean AQI\nrank = df.groupby(\"station\")[\"aqi\"].mean().sort_values(ascending=False)\nprint(rank.head(5))"
    },
    {
      "type": "h2",
      "text": "Creating and modifying columns"
    },
    {
      "type": "p",
      "html": "Assign to a new column name. Operations run on the entire column at once (vectorised):"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# unit conversion\ndf[\"temp_f\"] = df[\"temp_c\"] * 9/5 + 32\n\n# extract year from a datetime column\ndf[\"year\"] = df[\"date\"].dt.year\ndf[\"month\"] = df[\"date\"].dt.month"
    },
    {
      "type": "h3",
      "text": "Conditional labels with .apply()"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "def aqi_category(val):\n    if pd.isna(val):\n        return \"Missing\"\n    if val <= 50:\n        return \"Good\"\n    if val <= 100:\n        return \"Moderate\"\n    if val <= 150:\n        return \"Unhealthy for Sensitive\"\n    return \"Unhealthy\"\n\ndf[\"category\"] = df[\"aqi\"].apply(aqi_category)"
    },
    {
      "type": "h3",
      "text": "Faster mapping with .map() and .replace()"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# map pollutant codes to full names\ncode_map = {\"PM25\": \"Fine particles\", \"O3\": \"Ozone\", \"NO2\": \"Nitrogen dioxide\"}\ndf[\"pollutant_name\"] = df[\"parameter\"].map(code_map)\n\n# fix known label typos\ndf[\"station\"] = df[\"station\"].replace({\"Dtla\": \"Downtown LA\", \"downtown la\": \"Downtown LA\"})"
    },
    {
      "type": "h2",
      "text": "Group and summarise"
    },
    {
      "type": "p",
      "html": "Split-apply-combine: group rows by a column, compute a summary for each group. This answers most \"how much per ___\" questions."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# mean AQI per station\ndf.groupby(\"station\")[\"aqi\"].mean()\n\n# multiple stats at once\ndf.groupby(\"station\")[\"aqi\"].agg([\"mean\", \"max\", \"min\", \"count\"])\n\n# group by two columns\ndf.groupby([\"month\", \"category\"])[\"aqi\"].mean()"
    },
    {
      "type": "h3",
      "text": "Named aggregations"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "summary = df.groupby(\"station\").agg(\n    mean_aqi=(\"aqi\", \"mean\"),\n    max_aqi=(\"aqi\", \"max\"),\n    n_readings=(\"aqi\", \"count\"),\n    mean_pm25=(\"pm25\", \"mean\")\n).reset_index()\nsummary.sort_values(\"mean_aqi\", ascending=False)"
    },
    {
      "type": "h3",
      "text": "CalEnviroScreen example: burden by county"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "ces = pd.read_csv(\"calenviroscreen_4_0.csv\")\n\n# average PM2.5 percentile score by county\nby_county = ces.groupby(\"County\")[\"PM2.5\"].mean().sort_values(ascending=False)\nprint(by_county.head())"
    },
    {
      "type": "h2",
      "text": "Working with dates and times"
    },
    {
      "type": "p",
      "html": "Environmental time series depend on correct datetime parsing."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df[\"date\"] = pd.to_datetime(df[\"date\"], errors=\"coerce\")\n\n# extract parts\ndf[\"year\"] = df[\"date\"].dt.year\ndf[\"month\"] = df[\"date\"].dt.month\ndf[\"day_of_week\"] = df[\"date\"].dt.day_name()\n\n# filter a date range\nmask = (df[\"date\"] >= \"2023-06-01\") & (df[\"date\"] <= \"2023-08-31\")\nsummer_2023 = df[mask]"
    },
    {
      "type": "h3",
      "text": "Resampling time series"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# hourly readings -> daily mean AQI\ndf_ts = df.set_index(\"date\")\ndaily = df_ts[\"aqi\"].resample(\"D\").mean()\nmonthly = df_ts[\"aqi\"].resample(\"ME\").mean()\nprint(monthly.head())"
    },
    {
      "type": "h2",
      "text": "Missing data"
    },
    {
      "type": "p",
      "html": "Real sensors fail. Missing values appear as <code>NaN</code>. Handle them deliberately:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df[\"aqi\"].isna().sum()           # count missing\ndf[\"aqi\"].isna().mean() * 100     # percent missing\n\n# drop rows where AQI is missing\nclean = df.dropna(subset=[\"aqi\"])\n\n# fill with median\ndf[\"aqi\"] = df[\"aqi\"].fillna(df[\"aqi\"].median())\n\n# forward-fill for time series gaps\ndf[\"aqi\"] = df.groupby(\"station\")[\"aqi\"].ffill()"
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "There is no universal rule for missing data. The <a class=\"inline\" href=\"lesson.html?id=data-cleaning\">data cleaning lesson</a> covers when to drop, fill, or flag gaps.",
      "title": "Missing data strategy matters."
    },
    {
      "type": "h2",
      "text": "Duplicates and unique values"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df.duplicated().sum()\ndf = df.drop_duplicates(subset=[\"station\", \"date\"], keep=\"first\")\n\nprint(df[\"station\"].nunique())\nprint(df[\"station\"].unique())"
    },
    {
      "type": "h2",
      "text": "Merging tables"
    },
    {
      "type": "p",
      "html": "Join station readings with station metadata (latitude, elevation, land use):"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "readings = pd.read_csv(\"aqi_readings.csv\")\nmeta = pd.read_csv(\"station_metadata.csv\")\n\nmerged = readings.merge(meta, on=\"station_id\", how=\"left\")\nmerged.head()"
    },
    {
      "type": "h3",
      "text": "Join types"
    },
    {
      "type": "table",
      "head": [
        "how=",
        "Keeps"
      ],
      "rows": [
        [
          "<code>\"left\"</code>",
          "All rows from the left table; match from right"
        ],
        [
          "<code>\"inner\"</code>",
          "Only rows with a match in both tables"
        ],
        [
          "<code>\"outer\"</code>",
          "All rows from both; NaN where no match"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Reshaping: wide and long"
    },
    {
      "type": "p",
      "html": "Climate TRACE and NOAA often publish wide tables (one column per year). Long format is easier to group and plot."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "# wide -> long\nlong = df.melt(\n    id_vars=[\"facility_name\", \"sector\"],\n    value_vars=[\"2019\", \"2020\", \"2021\", \"2022\"],\n    var_name=\"year\",\n    value_name=\"co2e_tonnes\"\n)\n\n# long -> wide\nwide = long.pivot_table(\n    index=\"facility_name\", columns=\"year\", values=\"co2e_tonnes\"\n)"
    },
    {
      "type": "h2",
      "text": "String operations on text columns"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df[\"station\"] = df[\"station\"].str.strip().str.title()\ndf[\"has_highway\"] = df[\"location\"].str.contains(\"I-5\", case=False, na=False)\ndf[\"county_code\"] = df[\"site_id\"].str[:2]"
    },
    {
      "type": "h2",
      "text": "Exporting cleaned data"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df.to_csv(\"la_aqi_clean.csv\", index=False)\ndf.to_parquet(\"la_aqi_clean.parquet\")  # faster for large files"
    },
    {
      "type": "h2",
      "text": "A full AirNow workflow"
    },
    {
      "type": "steps",
      "items": [
        "Load hourly AQI CSV with <code>parse_dates</code> and <code>na_values</code>.",
        "Inspect with <code>head()</code>, <code>info()</code>, and <code>describe()</code>.",
        "Standardise station names with <code>.str.strip()</code> and <code>.replace()</code>.",
        "Filter to PM2.5 as the dominant pollutant.",
        "Group by station and month; compute mean AQI.",
        "Sort to find the worst station-month combinations.",
        "Export the summary table to CSV."
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import pandas as pd\n\nurl = \"https://files.airnowtech.org/?filename=AQI_LosAngeles.csv\"\ndf = pd.read_csv(url, parse_dates=[\"Date\"], na_values=[-999])\n\ndf[\"Station\"] = df[\"Station\"].str.strip()\npm25 = df[df[\"Defining Parameter\"] == \"PM2.5\"].copy()\n\nmonthly = (\n    pm25.groupby([\"Station\", pm25[\"Date\"].dt.month])[\"AQI\"]\n    .mean()\n    .reset_index(name=\"mean_aqi\")\n    .sort_values(\"mean_aqi\", ascending=False)\n)\nprint(monthly.head(10))"
    },
    {
      "type": "h2",
      "text": "Common mistakes"
    },
    {
      "type": "list",
      "items": [
        "Forgetting parentheses around each condition in <code>&amp;</code> / <code>|</code> filters.",
        "Calling <code>.mean()</code> on a column that is still text (check <code>dtypes</code>).",
        "Modifying a slice instead of a copy — use <code>.copy()</code> when filtering then editing.",
        "Ignoring sentinel values like <code>-999</code> that inflate or deflate summary stats.",
        "Merging on columns with mismatched types (string vs int station IDs)."
      ]
    },
    {
      "type": "exercise",
      "title": "Find the dirtiest month",
      "html": "Given a DataFrame <code>df</code> with columns <code>month</code> and <code>aqi</code>, compute the average AQI for each month and print the month with the highest average.",
      "hint": "Group by <code>month</code>, take <code>mean()</code> of <code>aqi</code>, then use <code>.idxmax()</code> for the month label and <code>.max()</code> for the value.",
      "solution": {
        "lang": "python",
        "code": "monthly = df.groupby(\"month\")[\"aqi\"].mean()\nprint(monthly)\nprint(\"Worst month:\", monthly.idxmax(), \"->\", round(monthly.max(), 1))",
        "note": "<code>.idxmax()</code> returns the label; <code>.max()</code> returns the value."
      }
    },
    {
      "type": "exercise",
      "title": "Rank LA stations by unhealthy days",
      "html": "Load an air-quality DataFrame with columns <code>station</code>, <code>date</code>, and <code>aqi</code>. Count how many days each station had AQI above 100, then list stations from most to fewest unhealthy days.",
      "hint": "Filter first with <code>df[df[\"aqi\"] > 100]</code>, then <code>groupby(\"station\")</code> and <code>.size()</code> or <code>.count()</code>, then <code>sort_values(ascending=False)</code>.",
      "solution": {
        "lang": "python",
        "code": "bad_days = df[df[\"aqi\"] > 100].groupby(\"station\").size()\nbad_days = bad_days.sort_values(ascending=False)\nprint(bad_days.head(10))"
      }
    },
    {
      "type": "exercise",
      "title": "Merge readings with station coordinates",
      "html": "You have <code>readings</code> (station_id, date, pm25) and <code>stations</code> (station_id, lat, lon, elevation). Join them so every reading row has latitude and longitude, then compute mean PM2.5 by elevation band (below 100m, 100-500m, above 500m).",
      "hint": "Use <code>readings.merge(stations, on=\"station_id\")</code>. Create an elevation band column with <code>pd.cut()</code> or <code>.apply()</code>, then groupby the band.",
      "solution": {
        "lang": "python",
        "code": "merged = readings.merge(stations, on=\"station_id\", how=\"left\")\n\nmerged[\"elev_band\"] = pd.cut(\n    merged[\"elevation\"],\n    bins=[-1, 100, 500, 10000],\n    labels=[\"low\", \"mid\", \"high\"]\n)\n\nmerged.groupby(\"elev_band\")[\"pm25\"].mean()"
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "<code>pd.read_csv()</code> loads tables from files or URLs; inspect with <code>head()</code>, <code>info()</code>, <code>describe()</code>.",
        "Filter rows with boolean conditions using <code>&amp;</code> / <code>|</code> and parentheses.",
        "Create columns by assignment; use <code>.apply()</code>, <code>.map()</code>, and <code>.replace()</code> for labels.",
        "<code>groupby()</code> + aggregation answers most \"by category\" questions.",
        "Parse dates with <code>pd.to_datetime()</code>; resample time series with <code>.resample()</code>.",
        "Handle <code>NaN</code> deliberately; watch for sentinel values like <code>-999</code>.",
        "<code>merge()</code> joins tables; <code>melt()</code> / <code>pivot_table()</code> reshape wide and long."
      ]
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "You are ready for the <a class=\"inline\" href=\"projects.html\">Map LA’s air quality</a> project — a perfect first pandas notebook on real AirNow data.",
      "title": "Next up."
    }
  ]
};
