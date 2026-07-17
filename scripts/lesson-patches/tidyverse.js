module.exports = {
  "title": "Data wrangling with the tidyverse",
  "track": "data",
  "tool": "R",
  "level": "beginner",
  "time": "~6-8 hrs",
  "lede": "The tidyverse is a family of R packages that make data manipulation read like a sentence. With dplyr verbs and the pipe, you can express complex CalEnviroScreen rankings, NOAA summaries, and Climate TRACE reshaping as a clear, top-to-bottom recipe.",
  "learn": [
    "Use the pipe to chain steps readably",
    "Apply the five core dplyr verbs",
    "Filter, sort, mutate, and summarise environmental tables",
    "Join tables and pivot between wide and long formats",
    "Clean text and dates with stringr and lubridate"
  ],
  "prereqs": [
    {
      "id": "r-fundamentals",
      "label": "R fundamentals"
    }
  ],
  "resources": [
    {
      "name": "R for Data Science: transform",
      "url": "https://r4ds.hadley.nz/data-transform",
      "kind": "book"
    },
    {
      "name": "dplyr cheat sheet",
      "url": "https://rstudio.github.io/cheatsheets/data-transformation.pdf",
      "kind": "pdf"
    },
    {
      "name": "dplyr documentation",
      "url": "https://dplyr.tidyverse.org/",
      "kind": "docs"
    },
    {
      "name": "CalEnviroScreen data",
      "url": "https://oehha.ca.gov/calenviroscreen",
      "kind": "docs"
    }
  ],
  "unlock": {
    "label": "Who carries the pollution burden?",
    "url": "projects.html",
    "blurb": "Use dplyr on CalEnviroScreen to rank communities and summarise the burden."
  },
  "content": [
    {
      "type": "p",
      "html": "The <strong>tidyverse</strong> is a collection of R packages — <code>dplyr</code>, <code>readr</code>, <code>tidyr</code>, <code>ggplot2</code> — that share a consistent design. Together they make CalEnviroScreen burden rankings, NOAA climate summaries, and USGS streamflow analysis read like plain English."
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "Complete <a class=\"inline\" href=\"lesson.html?id=r-fundamentals\">R fundamentals</a> first. Use RStudio or Posit Cloud and run each block in the Console or a script.",
      "title": "Before you start."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "library(tidyverse)\n# Loads dplyr, readr, tidyr, ggplot2, and more"
    },
    {
      "type": "h2",
      "text": "Why the tidyverse for environmental data"
    },
    {
      "type": "p",
      "html": "R dominates ecological statistics and many California policy labs. CalEnviroScreen, EPA screening tools, and academic climate papers often ship R examples. The tidyverse is the modern standard for data wrangling in R."
    },
    {
      "type": "table",
      "head": [
        "Package",
        "Role",
        "Environmental example"
      ],
      "rows": [
        [
          "<code>readr</code>",
          "Read CSV fast",
          "Load CalEnviroScreen 4.0"
        ],
        [
          "<code>dplyr</code>",
          "Filter, mutate, summarise",
          "Rank tracts by PM2.5 percentile"
        ],
        [
          "<code>tidyr</code>",
          "Reshape tables",
          "Pivot Climate TRACE emissions wide/long"
        ],
        [
          "<code>lubridate</code>",
          "Date handling",
          "Parse NOAA daily station dates"
        ],
        [
          "<code>stringr</code>",
          "Text cleaning",
          "Standardise county names"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Reading data with readr"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ces <- read_csv(\"calenviroscreen_4_0.csv\")\nglimpse(ces)   # compact column overview\n\n# read_csv guesses types; specify if needed:\naq <- read_csv(\"la_air_quality.csv\",\n  col_types = cols(\n    date = col_date(),\n    aqi  = col_double(),\n    station = col_character()\n  )\n)"
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "<code>read_csv()</code> shows column types as it loads. If a numeric column appears as <code>chr</code>, something is wrong — often a header row or text sentinel mixed in.",
      "title": "Watch column types on load."
    },
    {
      "type": "h2",
      "text": "The pipe: read top to bottom"
    },
    {
      "type": "p",
      "html": "The pipe <code>|></code> passes the result on the left as the first argument to the function on the right. Read it as \"then\"."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# nested calls (hard to read)\nsummary(filter(aq, aqi > 100))\n\n# piped (reads like a recipe)\naq |>\n  filter(aqi > 100) |>\n  summary()"
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "<code>|></code> is base R (4.1+). Older code uses <code>%>%</code> from magrittr — they behave the same for everyday dplyr work.",
      "title": "Two pipe operators."
    },
    {
      "type": "h2",
      "text": "The five core dplyr verbs"
    },
    {
      "type": "table",
      "head": [
        "Verb",
        "What it does",
        "Example"
      ],
      "rows": [
        [
          "<code>filter()</code>",
          "Keep matching rows",
          "Unhealthy air days"
        ],
        [
          "<code>select()</code>",
          "Keep/drop columns",
          "Station, date, AQI only"
        ],
        [
          "<code>mutate()</code>",
          "Create or change columns",
          "AQI category labels"
        ],
        [
          "<code>arrange()</code>",
          "Sort rows",
          "Worst AQI first"
        ],
        [
          "<code>summarise()</code>",
          "Collapse to stats",
          "Mean AQI per county"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "filter: keep the rows you need"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  filter(aqi > 100) |>\n  filter(month %in% c(6, 7, 8, 9)) |>\n  head()"
    },
    {
      "type": "p",
      "html": "Combine conditions with <code>&amp;</code> (and) and <code>|</code> (or):"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  filter(aqi > 100 & pm25 > 35) |>\n  filter(station == \"Downtown LA\" | station == \"Pasadena\")"
    },
    {
      "type": "h3",
      "text": "filter helpers"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  filter(between(aqi, 50, 100)) |>       # moderate range\n  filter(station %in% c(\"Long Beach\", \"Pasadena\")) |>\n  filter(!is.na(pm25))                    # drop missing PM2.5"
    },
    {
      "type": "h2",
      "text": "select: choose columns"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  select(station, date, aqi, pm25) |>\n  head()\n\n# drop columns\naq |> select(-temp_c, -wind_speed)\n\n# rename while selecting\naq |> select(site = station, reading = aqi)"
    },
    {
      "type": "h3",
      "text": "select helpers"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |> select(starts_with(\"pm\"))     # pm25, pm10\naq |> select(where(is.numeric))    # all numeric columns\naq |> select(everything())         # all columns, useful mid-pipe"
    },
    {
      "type": "h2",
      "text": "mutate: create and transform columns"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq <- aq |>\n  mutate(\n    temp_f = temp_c * 9/5 + 32,\n    year = year(date),\n    month = month(date),\n    log_pm25 = log(pm25 + 1)\n  )"
    },
    {
      "type": "h3",
      "text": "case_when for category labels"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq <- aq |>\n  mutate(\n    category = case_when(\n      aqi <= 50  ~ \"Good\",\n      aqi <= 100 ~ \"Moderate\",\n      aqi <= 150 ~ \"Unhealthy for Sensitive\",\n      TRUE       ~ \"Unhealthy\"\n    )\n  )"
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "<code>case_when()</code> evaluates conditions top to bottom. Put the catch-all <code>TRUE ~ \"...\"</code> last.",
      "title": "case_when order matters."
    },
    {
      "type": "h2",
      "text": "arrange: sort your results"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  arrange(desc(aqi)) |>\n  head(10)\n\n# multiple sort keys\naq |>\n  arrange(station, desc(aqi)) |>\n  head()"
    },
    {
      "type": "h2",
      "text": "summarise and group_by"
    },
    {
      "type": "p",
      "html": "Pair <code>group_by()</code> with <code>summarise()</code> to compute one row of statistics per group:"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  group_by(station) |>\n  summarise(\n    mean_aqi = mean(aqi, na.rm = TRUE),\n    max_aqi  = max(aqi, na.rm = TRUE),\n    n        = n()\n  ) |>\n  arrange(desc(mean_aqi))"
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "If any value is <code>NA</code>, <code>mean()</code> returns <code>NA</code> by default. Always add <code>na.rm = TRUE</code> unless you intentionally want missing summaries.",
      "title": "Mind the NAs."
    },
    {
      "type": "h3",
      "text": "Multiple grouping columns"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  group_by(station, month) |>\n  summarise(mean_aqi = mean(aqi, na.rm = TRUE), .groups = \"drop\") |>\n  arrange(desc(mean_aqi))"
    },
    {
      "type": "h2",
      "text": "CalEnviroScreen: ranking pollution burden"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ces <- read_csv(\"calenviroscreen_4_0.csv\")\n\n# top 10 most burdened tracts by PM2.5 percentile\nhigh_burden <- ces |>\n  select(CensusTract, County, PM2.5, Poverty) |>\n  arrange(desc(PM2.5)) |>\n  head(10)\n\nprint(high_burden)"
    },
    {
      "type": "h3",
      "text": "County-level summary"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "by_county <- ces |>\n  group_by(County) |>\n  summarise(\n    mean_pm25  = mean(PM2.5, na.rm = TRUE),\n    mean_poverty = mean(Poverty, na.rm = TRUE),\n    n_tracts = n()\n  ) |>\n  arrange(desc(mean_pm25))"
    },
    {
      "type": "h2",
      "text": "count: a summarise shortcut"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# how many unhealthy days per station?\naq |>\n  filter(aqi > 100) |>\n  count(station, sort = TRUE)"
    },
    {
      "type": "h2",
      "text": "distinct and slice"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# unique stations\naq |> distinct(station)\n\n# top 3 worst days overall\naq |> slice_max(aqi, n = 3)\n\n# one row per station (highest AQI)\naq |>\n  group_by(station) |>\n  slice_max(aqi, n = 1)"
    },
    {
      "type": "h2",
      "text": "Joining tables"
    },
    {
      "type": "p",
      "html": "Combine air readings with station metadata or CalEnviroScreen geography:"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "readings <- read_csv(\"aqi_readings.csv\")\nmeta <- read_csv(\"station_metadata.csv\")\n\njoined <- readings |>\n  left_join(meta, by = \"station_id\")\n\nglimpse(joined)"
    },
    {
      "type": "table",
      "head": [
        "Join",
        "Function",
        "Keeps"
      ],
      "rows": [
        [
          "Left",
          "<code>left_join()</code>",
          "All rows from left table"
        ],
        [
          "Inner",
          "<code>inner_join()</code>",
          "Only matching rows"
        ],
        [
          "Full",
          "<code>full_join()</code>",
          "All rows from both"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "tidyr: pivot longer and wider"
    },
    {
      "type": "p",
      "html": "Climate TRACE facility data often arrives wide (one column per year). Long format is easier to filter and plot."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "wide <- read_csv(\"climate_trace_facilities.csv\")\n\nlong <- wide |>\n  pivot_longer(\n    cols = starts_with(\"20\"),\n    names_to = \"year\",\n    values_to = \"co2e_tonnes\"\n  )\n\nglimpse(long)"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# long back to wide\nlong |>\n  pivot_wider(\n    names_from = year,\n    values_from = co2e_tonnes\n  )"
    },
    {
      "type": "h2",
      "text": "Working with dates: lubridate"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq <- aq |>\n  mutate(\n    date = ymd(date),\n    year = year(date),\n    month = month(date, label = TRUE),\n    season = case_when(\n      month(date) %in% c(12, 1, 2) ~ \"Winter\",\n      month(date) %in% c(3, 4, 5)  ~ \"Spring\",\n      month(date) %in% c(6, 7, 8)  ~ \"Summer\",\n      TRUE                         ~ \"Fall\"\n    )\n  )"
    },
    {
      "type": "h2",
      "text": "String cleaning with stringr"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq <- aq |>\n  mutate(\n    station = str_trim(station),\n    station = str_to_title(station),\n    is_coastal = str_detect(location, regex(\"beach|coast\", ignore_case = TRUE))\n  )"
    },
    {
      "type": "h2",
      "text": "Handling missing data"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# count NAs per column\naq |> summarise(across(everything(), ~sum(is.na(.))))\n\n# drop rows missing AQI\nclean <- aq |> filter(!is.na(aqi))\n\n# replace NA with median\naq <- aq |>\n  group_by(station) |>\n  mutate(aqi = if_else(is.na(aqi), median(aqi, na.rm = TRUE), aqi)) |>\n  ungroup()"
    },
    {
      "type": "h2",
      "text": "The across() helper"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# summarise multiple numeric columns at once\naq |>\n  group_by(station) |>\n  summarise(\n    across(c(aqi, pm25, o3_ppm), ~mean(.x, na.rm = TRUE))\n  )"
    },
    {
      "type": "h2",
      "text": "A complete dplyr pipeline"
    },
    {
      "type": "steps",
      "items": [
        "Load CalEnviroScreen with <code>read_csv()</code>.",
        "Select tract ID, county, PM2.5, and poverty columns.",
        "Filter to tracts in Los Angeles County.",
        "Add a high-burden flag where PM2.5 percentile exceeds 90.",
        "Group by city and summarise mean PM2.5 and tract count.",
        "Arrange descending and print the top 10 cities."
      ]
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ces <- read_csv(\"calenviroscreen_4_0.csv\")\n\nla_burden <- ces |>\n  filter(County == \"Los Angeles\") |>\n  mutate(high_burden = PM2.5 > 90) |>\n  group_by(City) |>\n  summarise(\n    mean_pm25 = mean(PM2.5, na.rm = TRUE),\n    n_tracts = n(),\n    n_high = sum(high_burden, na.rm = TRUE)\n  ) |>\n  arrange(desc(mean_pm25)) |>\n  head(10)\n\nprint(la_burden)"
    },
    {
      "type": "h2",
      "text": "Common mistakes"
    },
    {
      "type": "list",
      "items": [
        "Forgetting <code>na.rm = TRUE</code> in <code>mean()</code> and getting all-NA summaries.",
        "Grouping but not ungrouping before the next operation (check with <code>group_by()</code> output).",
        "Using <code>filter()</code> when you mean <code>select()</code> — filter keeps rows, select keeps columns.",
        "Joining on columns with different names — specify <code>by = c(\"left_col\" = \"right_col\")</code>.",
        "Not checking row counts after a join (unexpected <code>inner_join</code> can silently drop rows)."
      ]
    },
    {
      "type": "exercise",
      "title": "Rank stations by bad-air days",
      "html": "For each <code>station</code>, count how many rows have <code>aqi &gt; 100</code>, then show stations ordered from most to fewest unhealthy days.",
      "hint": "Filter to <code>aqi &gt; 100</code>, then <code>group_by(station)</code> and <code>summarise(bad_days = n())</code>, then <code>arrange(desc(bad_days))</code>. Or use <code>count(station, sort = TRUE)</code> after filtering.",
      "solution": {
        "lang": "r",
        "code": "aq |>\n  filter(aqi > 100) |>\n  count(station, sort = TRUE)"
      }
    },
    {
      "type": "exercise",
      "title": "Summarise CalEnviroScreen by county",
      "html": "Load CalEnviroScreen data and compute, for each county: mean PM2.5 percentile, mean poverty score, and number of census tracts. Show the 5 counties with highest mean PM2.5.",
      "hint": "Use <code>group_by(County)</code>, <code>summarise()</code> with <code>na.rm = TRUE</code>, and <code>slice_max()</code> or <code>arrange(desc()) |> head(5)</code>.",
      "solution": {
        "lang": "r",
        "code": "ces <- read_csv(\"calenviroscreen_4_0.csv\")\n\nces |>\n  group_by(County) |>\n  summarise(\n    mean_pm25 = mean(PM2.5, na.rm = TRUE),\n    mean_poverty = mean(Poverty, na.rm = TRUE),\n    n_tracts = n()\n  ) |>\n  slice_max(mean_pm25, n = 5)"
      }
    },
    {
      "type": "exercise",
      "title": "Pivot Climate TRACE emissions to long format",
      "html": "Given a wide CSV with columns <code>facility</code>, <code>2019</code>, <code>2020</code>, <code>2021</code>, <code>2022</code> (CO2e tonnes), pivot to long format and compute total emissions per facility across all years.",
      "hint": "Use <code>pivot_longer(cols = starts_with(\"20\"), ...)</code>, then <code>group_by(facility) |> summarise(total = sum(co2e_tonnes))</code>.",
      "solution": {
        "lang": "r",
        "code": "facilities <- read_csv(\"climate_trace_facilities.csv\")\n\nfacilities |>\n  pivot_longer(starts_with(\"20\"), names_to = \"year\", values_to = \"co2e\") |>\n  group_by(facility) |>\n  summarise(total_co2e = sum(co2e, na.rm = TRUE)) |>\n  arrange(desc(total_co2e))"
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "Load data with <code>read_csv()</code>; inspect with <code>glimpse()</code>.",
        "Chain steps with the pipe <code>|></code> for readable top-to-bottom recipes.",
        "Five verbs: <code>filter</code>, <code>select</code>, <code>mutate</code>, <code>arrange</code>, <code>summarise</code>.",
        "<code>case_when()</code> labels categories; <code>group_by()</code> + <code>summarise()</code> aggregates.",
        "<code>left_join()</code> merges tables; <code>pivot_longer()</code> / <code>pivot_wider()</code> reshape.",
        "Always use <code>na.rm = TRUE</code> in summary functions unless NAs should propagate."
      ]
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "Apply these skills in the <a class=\"inline\" href=\"projects.html\">Who carries the pollution burden?</a> project using CalEnviroScreen data.",
      "title": "Next up."
    }
  ]
};
