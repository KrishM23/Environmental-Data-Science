module.exports = {
  "title": "Cleaning & preparing real-world data",
  "track": "data",
  "tool": "Both",
  "level": "intermediate",
  "time": "~5-6 hrs",
  "lede": "Real environmental data is messy: missing readings, inconsistent labels, wrong types, sneaky duplicates. Cleaning is where most analysis time actually goes — and doing it carefully is what separates a trustworthy result from a misleading one.",
  "learn": [
    "Diagnose common data-quality problems systematically",
    "Fix types, dates, and inconsistent text in Python and R",
    "Handle sentinel values and missing data deliberately",
    "Find outliers and remove duplicates safely",
    "Reshape, validate, and document a reproducible cleaning pipeline"
  ],
  "prereqs": [
    {
      "id": "pandas",
      "label": "pandas"
    },
    {
      "id": "tidyverse",
      "label": "tidyverse"
    }
  ],
  "resources": [
    {
      "name": "Tidy Data (Wickham)",
      "url": "https://vita.had.co.nz/papers/tidy-data.pdf",
      "kind": "paper"
    },
    {
      "name": "pandas: working with text",
      "url": "https://pandas.pydata.org/docs/user_guide/text.html",
      "kind": "docs"
    },
    {
      "name": "Kaggle: data cleaning",
      "url": "https://www.kaggle.com/learn/data-cleaning",
      "kind": "course"
    },
    {
      "name": "NOAA data documentation",
      "url": "https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation",
      "kind": "docs"
    }
  ],
  "unlock": {
    "label": "Track California’s emitters",
    "url": "projects.html",
    "blurb": "A facility dataset with the full menu of real-world messiness — perfect cleaning practice."
  },
  "content": [
    {
      "type": "p",
      "html": "Real environmental data is messy: missing sensor readings, inconsistent station labels, wrong column types, duplicate rows, and sentinel values disguised as real numbers. Cleaning is where most analysis time actually goes — and doing it carefully separates a trustworthy result from a misleading one."
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "This lesson uses both Python (pandas) and R (tidyverse) side by side. Complete the <a class=\"inline\" href=\"lesson.html?id=pandas\">pandas</a> and <a class=\"inline\" href=\"lesson.html?id=tidyverse\">tidyverse</a> lessons first.",
      "title": "Prerequisites."
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "Never overwrite your raw file. Load it, clean into a new variable or file, and keep every step in code so the process is reproducible and reviewable.",
      "title": "Golden rule."
    },
    {
      "type": "h2",
      "text": "Why environmental data is especially messy"
    },
    {
      "type": "list",
      "items": [
        "Sensors go offline and encode gaps as <code>-999</code>, <code>9999</code>, or empty strings.",
        "Agency exports change column names between versions (AirNow, NOAA, USGS).",
        "Text labels vary: \"Los Angeles\", \"LA\", \"los angeles county\".",
        "Multiple readings per station per hour from overlapping monitors.",
        "Climate TRACE and CalEnviroScreen mix census geography with varying precision."
      ]
    },
    {
      "type": "h2",
      "text": "Step 1: Diagnose before you fix"
    },
    {
      "type": "p",
      "html": "Spend time understanding problems before changing anything."
    },
    {
      "type": "h3",
      "text": "Python diagnosis checklist"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"raw_air_quality.csv\")\n\nprint(\"Shape:\", df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\nprint(df.describe())\nprint(\"Unique stations:\", df[\"station\"].nunique())\nprint(df[\"station\"].unique()[:20])\nprint(\"Duplicates:\", df.duplicated().sum())"
    },
    {
      "type": "h3",
      "text": "R diagnosis checklist"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "library(tidyverse)\n\ndf <- read_csv(\"raw_air_quality.csv\")\n\nglimpse(df)\nsummary(df)\ndf |> summarise(across(everything(), ~sum(is.na(.))))\ndf |> count(station, sort = TRUE)"
    },
    {
      "type": "h3",
      "text": "Questions to ask every new dataset"
    },
    {
      "type": "olist",
      "items": [
        "How many rows and columns? Does that match the documentation?",
        "Are numeric columns actually numeric (<code>dtypes</code> / <code>glimpse</code>)?",
        "How many missing values per column?",
        "Are min/max values plausible (no -999 AQI)?",
        "Are category labels consistent?",
        "Are there duplicate rows?"
      ]
    },
    {
      "type": "h2",
      "text": "Step 2: Fix column types"
    },
    {
      "type": "p",
      "html": "Numbers stored as text block math. Dates stored as strings block time-series analysis."
    },
    {
      "type": "h3",
      "text": "Python"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df[\"aqi\"] = pd.to_numeric(df[\"aqi\"], errors=\"coerce\")\ndf[\"date\"] = pd.to_datetime(df[\"date\"], errors=\"coerce\")\ndf[\"station_id\"] = df[\"station_id\"].astype(str)  # IDs must not be floats"
    },
    {
      "type": "h3",
      "text": "R"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "df <- df |>\n  mutate(\n    aqi = parse_number(aqi),\n    date = ymd(date),\n    station_id = as.character(station_id)\n  )"
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "Use <code>errors=\"coerce\"</code> (Python) or <code>parse_number()</code> (R) so invalid values become NA instead of crashing your script.",
      "title": "Coerce, do not crash."
    },
    {
      "type": "h2",
      "text": "Step 3: Handle sentinel values"
    },
    {
      "type": "p",
      "html": "Agencies use placeholder numbers for missing readings. Treat them as NA before any summary."
    },
    {
      "type": "h3",
      "text": "Python"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "SENTINELS = [-999, -9999, 9999, -8888]\n\nfor col in [\"aqi\", \"pm25\", \"temp_c\"]:\n    df[col] = df[col].replace(SENTINELS, pd.NA)\n\n# or on load:\ndf = pd.read_csv(\"noaa.csv\", na_values=SENTINELS)"
    },
    {
      "type": "h3",
      "text": "R"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "SENTINELS <- c(-999, -9999, 9999, -8888)\n\ndf <- df |>\n  mutate(across(c(aqi, pm25, temp_c), ~na_if(.x, SENTINELS)))"
    },
    {
      "type": "h2",
      "text": "Step 4: Standardise text labels"
    },
    {
      "type": "p",
      "html": "\"Downtown LA\", \"downtown la\", and \" Downtown LA \" are three different values to a computer."
    },
    {
      "type": "h3",
      "text": "Python"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df[\"station\"] = df[\"station\"].str.strip().str.title()\n\nRENAME = {\n    \"Dtla\": \"Downtown La\",\n    \"La\": \"Los Angeles\",\n    \"Long Beach, Ca\": \"Long Beach\"\n}\ndf[\"station\"] = df[\"station\"].replace(RENAME)"
    },
    {
      "type": "h3",
      "text": "R"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "df <- df |>\n  mutate(\n    station = str_trim(station),\n    station = str_to_title(station),\n    station = recode(station,\n      \"Dtla\" = \"Downtown La\",\n      \"La\" = \"Los Angeles\"\n    )\n  )"
    },
    {
      "type": "h2",
      "text": "Step 5: Handle missing values"
    },
    {
      "type": "p",
      "html": "There is no default-correct choice. Decide based on your research question and document the decision."
    },
    {
      "type": "table",
      "head": [
        "Strategy",
        "When it fits",
        "Python",
        "R"
      ],
      "rows": [
        [
          "Drop rows",
          "Few gaps; analysis requires complete rows",
          "dropna(subset=[\"aqi\"])",
          "filter(!is.na(aqi))"
        ],
        [
          "Fill with statistic",
          "Median/mean is a reasonable stand-in",
          "fillna(median())",
          "replace_na(median())"
        ],
        [
          "Forward-fill",
          "Time series; last reading still valid",
          "ffill()",
          "fill(aqi, .direction = \"down\")"
        ],
        [
          "Flag",
          "Missingness itself is informative",
          "New column was_missing",
          "mutate(was_missing = is.na(aqi))"
        ],
        [
          "Leave as NA",
          "Your stats already skip NA",
          "Do nothing",
          "Use na.rm = TRUE"
        ]
      ]
    },
    {
      "type": "h3",
      "text": "Forward-fill by station (Python)"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = df.sort_values([\"station\", \"date\"])\ndf[\"aqi\"] = df.groupby(\"station\")[\"aqi\"].ffill()"
    },
    {
      "type": "h3",
      "text": "Group median fill (R)"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "df <- df |>\n  group_by(station) |>\n  mutate(aqi = if_else(is.na(aqi), median(aqi, na.rm = TRUE), aqi)) |>\n  ungroup()"
    },
    {
      "type": "h2",
      "text": "Step 6: Remove duplicates"
    },
    {
      "type": "h3",
      "text": "Python"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = df.drop_duplicates()\ndf = df.drop_duplicates(subset=[\"station\", \"date\"], keep=\"first\")"
    },
    {
      "type": "h3",
      "text": "R"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "df <- df |> distinct()\ndf <- df |> distinct(station, date, .keep_all = TRUE)"
    },
    {
      "type": "h2",
      "text": "Step 7: Detect and handle outliers"
    },
    {
      "type": "p",
      "html": "Not every extreme value is an error — wildfire smoke genuinely pushes AQI above 300. But instrument glitches happen."
    },
    {
      "type": "h3",
      "text": "Visual check"
    },
    {
      "type": "p",
      "html": "Plot histograms or boxplots before deleting anything. The <a class=\"inline\" href=\"lesson.html?id=matplotlib-seaborn\">matplotlib lesson</a> covers this in depth."
    },
    {
      "type": "h3",
      "text": "IQR rule (Python)"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "q1 = df[\"pm25\"].quantile(0.25)\nq3 = df[\"pm25\"].quantile(0.75)\niqr = q3 - q1\nlower = q1 - 1.5 * iqr\nupper = q3 + 1.5 * iqr\n\noutliers = df[(df[\"pm25\"] < lower) | (df[\"pm25\"] > upper)]\nprint(f\"Flagged {len(outliers)} outlier rows\")"
    },
    {
      "type": "h3",
      "text": "IQR rule (R)"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "q1 <- quantile(df$pm25, 0.25, na.rm = TRUE)\nq3 <- quantile(df$pm25, 0.75, na.rm = TRUE)\niqr <- q3 - q1\n\noutliers <- df |>\n  filter(pm25 < q1 - 1.5 * iqr | pm25 > q3 + 1.5 * iqr)"
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "Do not blindly delete outliers in environmental data. A PM2.5 reading of 200 during a wildfire may be real. Flag outliers, investigate, then decide.",
      "title": "Outliers are not always errors."
    },
    {
      "type": "h2",
      "text": "Step 8: Reshape to tidy format"
    },
    {
      "type": "p",
      "html": "Tidy data: one observation per row, one variable per column. Climate TRACE facility tables often arrive wide."
    },
    {
      "type": "h3",
      "text": "Python: melt and pivot"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "long = df.melt(\n    id_vars=[\"facility\", \"sector\"],\n    value_vars=[\"2019\", \"2020\", \"2021\"],\n    var_name=\"year\", value_name=\"co2e_tonnes\"\n)\n\nwide = long.pivot_table(\n    index=\"facility\", columns=\"year\", values=\"co2e_tonnes\"\n)"
    },
    {
      "type": "h3",
      "text": "R: pivot_longer and pivot_wider"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "long <- df |>\n  pivot_longer(\n    starts_with(\"20\"),\n    names_to = \"year\",\n    values_to = \"co2e_tonnes\"\n  )\n\nwide <- long |>\n  pivot_wider(names_from = year, values_from = co2e_tonnes)"
    },
    {
      "type": "h2",
      "text": "Step 9: Validate your cleaned data"
    },
    {
      "type": "p",
      "html": "After cleaning, confirm the result makes sense:"
    },
    {
      "type": "olist",
      "items": [
        "Row count changed? Know why (duplicates removed, NAs dropped).",
        "Summary stats plausible? Mean AQI between 0 and 500, not -999.",
        "No remaining sentinel values?",
        "Date range covers the period you expect?",
        "Join keys match (no orphaned rows after merge)?"
      ]
    },
    {
      "type": "h3",
      "text": "Python validation snippet"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "assert df[\"aqi\"].min() >= 0, \"AQI should not be negative\"\nassert df[\"aqi\"].max() <= 500, \"Check for sentinel values\"\nassert df[\"date\"].notna().all(), \"Dates should all be parsed\"\nprint(\"Validation passed.\")"
    },
    {
      "type": "h2",
      "text": "Real-world example: cleaning AirNow exports"
    },
    {
      "type": "steps",
      "items": [
        "Load raw CSV with <code>na_values=[-999]</code>.",
        "Parse dates; check for unparseable rows.",
        "Standardise station names (strip, title-case).",
        "Drop exact duplicate rows on station + timestamp.",
        "Forward-fill short gaps within each station (< 3 hours).",
        "Flag rows where AQI exceeds 200 for manual review.",
        "Export to <code>airnow_clean.csv</code>; keep raw file untouched."
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import pandas as pd\n\nraw = pd.read_csv(\"airnow_raw.csv\", na_values=[-999, \"\"])\nclean = raw.copy()\n\nclean[\"date\"] = pd.to_datetime(clean[\"date\"], errors=\"coerce\")\nclean[\"station\"] = clean[\"station\"].str.strip().str.title()\nclean = clean.drop_duplicates(subset=[\"station\", \"date\"])\nclean = clean.sort_values([\"station\", \"date\"])\nclean[\"aqi\"] = clean.groupby(\"station\")[\"aqi\"].ffill()\nclean[\"high_aqi_flag\"] = clean[\"aqi\"] > 200\n\nclean.to_csv(\"airnow_clean.csv\", index=False)\nprint(clean.info())"
    },
    {
      "type": "h2",
      "text": "Real-world example: CalEnviroScreen in R"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "library(tidyverse)\n\nraw <- read_csv(\"calenviroscreen_4_0.csv\")\n\nclean <- raw |>\n  mutate(\n    across(where(is.character), str_trim),\n    PM2.5 = parse_number(as.character(PM2.5)),\n    Poverty = parse_number(as.character(Poverty))\n  ) |>\n  filter(!is.na(CensusTract)) |>\n  distinct(CensusTract, .keep_all = TRUE)\n\nwrite_csv(clean, \"ces_clean.csv\")"
    },
    {
      "type": "h2",
      "text": "Document your cleaning decisions"
    },
    {
      "type": "p",
      "html": "In a notebook, write a Markdown cell above each cleaning step explaining what you did and why. Future you (and reviewers) need to trust the pipeline."
    },
    {
      "type": "list",
      "items": [
        "What sentinel values did you replace?",
        "Why did you drop vs fill missing readings?",
        "How many rows were removed at each step?",
        "Did you verify against the data dictionary?"
      ]
    },
    {
      "type": "exercise",
      "title": "Clean a messy AirNow CSV",
      "html": "Load a raw AirNow CSV with sentinel values and inconsistent station names. Write a cleaning pipeline that: (1) replaces sentinels with NA, (2) parses dates, (3) standardises station names, (4) removes duplicates, and (5) reports final row count and mean AQI.",
      "hint": "Work step by step in separate cells. Use <code>na_values</code> on load, <code>.str.strip().str.title()</code> for names, and <code>drop_duplicates(subset=[...])</code>. Print before/after row counts.",
      "solution": {
        "lang": "python",
        "code": "import pandas as pd\n\nraw = pd.read_csv(\"airnow_raw.csv\", na_values=[-999, -9999])\nclean = raw.copy()\n\nclean[\"date\"] = pd.to_datetime(clean[\"date\"], errors=\"coerce\")\nclean[\"station\"] = clean[\"station\"].str.strip().str.title()\nclean = clean.drop_duplicates(subset=[\"station\", \"date\"])\nclean = clean.dropna(subset=[\"aqi\"])\n\nprint(\"Rows before:\", len(raw), \"after:\", len(clean))\nprint(\"Mean AQI:\", round(clean[\"aqi\"].mean(), 1))"
      }
    },
    {
      "type": "exercise",
      "title": "Standardise county names in CalEnviroScreen",
      "html": "CalEnviroScreen county names may include trailing spaces or inconsistent casing. Write an R pipeline that trims, title-cases, and recodes known variants, then counts tracts per county.",
      "hint": "Use <code>str_trim()</code>, <code>str_to_title()</code>, and <code>count(County, sort = TRUE)</code>.",
      "solution": {
        "lang": "r",
        "code": "library(tidyverse)\n\nces <- read_csv(\"calenviroscreen_4_0.csv\")\n\nces |>\n  mutate(County = str_to_title(str_trim(County))) |>\n  count(County, sort = TRUE)"
      }
    },
    {
      "type": "exercise",
      "title": "Build a reusable cleaning checklist",
      "html": "Pick any dataset from the <a class=\"inline\" href=\"datasets.html\">dataset library</a> (NOAA, USGS, or Climate TRACE). Create a notebook with cells for: diagnose, fix types, handle sentinels, standardise text, handle missing values, remove duplicates, validate, and export.",
      "hint": "Keep raw data untouched. Add a Markdown note above each code cell explaining your decision. Print summary stats before and after.",
      "solution": {
        "lang": "python",
        "code": "# Template structure — adapt to your chosen dataset\nimport pandas as pd\n\nraw = pd.read_csv(\"YOUR_FILE.csv\")\nprint(\"=== DIAGNOSE ===\")\nprint(raw.info())\nprint(raw.isna().sum())\n\n# ... cleaning steps ...\n\nprint(\"=== VALIDATE ===\")\nprint(clean.describe())\nclean.to_csv(\"YOUR_FILE_clean.csv\", index=False)"
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "<strong>Diagnose first</strong>: types, missing counts, labels, duplicates, impossible values.",
        "Replace sentinel values (-999, 9999) with NA before summarising.",
        "Fix types explicitly; never assume CSVs loaded correctly.",
        "Standardise text before grouping or joining.",
        "Choose a missing-data strategy on purpose and document it.",
        "Reshape to tidy (long) format for grouping and plotting.",
        "Validate after cleaning; keep raw data raw."
      ]
    }
  ]
};
