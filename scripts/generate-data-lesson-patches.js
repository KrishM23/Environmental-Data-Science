#!/usr/bin/env node
/**
 * Generate comprehensive lesson patch files for pandas, tidyverse,
 * data-cleaning, and apis-csv-json.
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'lesson-patches');

function b(type, fields) {
  return { type, ...fields };
}
function h2(text) { return b('h2', { text }); }
function h3(text) { return b('h3', { text }); }
function p(html) { return b('p', { html }); }
function list(items) { return b('list', { items }); }
function olist(items) { return b('olist', { items }); }
function steps(items) { return b('steps', { items }); }
function code(lang, code, caption) {
  const o = { lang, code };
  if (caption) o.caption = caption;
  return b('code', o);
}
function callout(variant, html, title) {
  const o = { variant, html };
  if (title) o.title = title;
  return b('callout', o);
}
function table(head, rows) { return b('table', { head, rows }); }
function exercise(title, html, hint, solution) {
  return b('exercise', { title, html, hint, solution });
}

function writeLesson(id, lesson) {
  const file = path.join(OUT, id + '.js');
  fs.writeFileSync(file, 'module.exports = ' + JSON.stringify(lesson, null, 2) + ';\n');
  console.log('Wrote', file, '- blocks:', lesson.content.length);
}

// ---------------------------------------------------------------------------
// PANDAS
// ---------------------------------------------------------------------------
function buildPandas() {
  const C = [];

  C.push(p('A <strong>DataFrame</strong> is a table with named columns and labelled rows. Environmental scientists use pandas to wrangle AirNow AQI readings, NOAA temperature grids, USGS streamflow records, and Climate TRACE emissions tables \u2014 all without writing loops for every row.'));
  C.push(callout('note', 'This lesson assumes you completed <a class="inline" href="lesson.html?id=python-fundamentals">Python fundamentals</a>. Open a Colab notebook and run each code block as you go.', 'How to follow along.'));
  C.push(code('python', 'import pandas as pd\nimport numpy as np\n\n# Convention: import pandas as pd everywhere'));
  C.push(h2('Why pandas for environmental data'));
  C.push(p('Government agencies publish monitoring data as CSV files and API responses. A single LA air-quality year might have 8,760 hourly rows across dozens of stations. pandas lets you load that table, filter unhealthy days, and compute monthly averages in a handful of lines.'));
  C.push(table(['Source', 'Typical format', 'pandas entry point'], [
    ['AirNow', 'CSV or API JSON', 'pd.read_csv() or pd.json_normalize()'],
    ['NOAA', 'CSV, NetCDF exports', 'pd.read_csv() with parse_dates'],
    ['USGS Water Services', 'JSON time series', 'pd.json_normalize() then set_index'],
    ['Climate TRACE', 'CSV facility lists', 'pd.read_csv() with dtype hints'],
    ['CalEnviroScreen', 'CSV census tracts', 'pd.read_csv() + groupby']
  ]));
  C.push(h2('Loading data'));
  C.push(h3('From a local CSV file'));
  C.push(p('The workhorse is <code>pd.read_csv()</code>. Always inspect the result before analysing.'));
  C.push(code('python', 'df = pd.read_csv("la_air_quality.csv")\n\nprint(df.head())       # first 5 rows\nprint(df.shape)       # (rows, columns)\nprint(df.columns.tolist())\nprint(df.dtypes)'));
  C.push(h3('From a URL \u2014 no download needed'));
  C.push(p('Terrain projects often read straight from a hosted URL. pandas fetches and parses in one step:'));
  C.push(code('python', 'url = "https://files.airnowtech.org/?filename=AQI_LosAngeles.csv"\ndf = pd.read_csv(url)\ndf.head()'));
  C.push(callout('tip', 'Run <code>df.head()</code>, <code>df.shape</code>, and <code>df.info()</code> on every new dataset. Thirty seconds of inspection prevents hours of debugging wrong assumptions.', 'Always look first.'));
  C.push(h3('Useful read_csv options'));
  C.push(p('Real agency files have quirks. These parameters fix the most common ones:'));
  C.push(code('python', 'df = pd.read_csv(\n    "noaa_daily_temps.csv",\n    parse_dates=["DATE"],          # parse date column on load\n    na_values=[-999, -9999, ""],   # treat sensor sentinels as missing\n    skiprows=2,                    # skip metadata header lines\n    sep=";",                       # European CSVs use semicolons\n    encoding="latin-1"             # older EPA files\n)'));
  C.push(h2('Inspecting a DataFrame'));
  C.push(p('Before filtering or plotting, understand what you have.'));
  C.push(code('python', 'df.head(10)          # peek at rows\ndf.tail(3)           # last rows\ndf.sample(5)         # random sample\ndf.info()            # column types + non-null counts\ndf.describe()        # numeric summary stats\ndf["station"].value_counts()  # count per category'));
  C.push(callout('warn', 'If <code>describe()</code> shows a minimum AQI of <code>-999</code> or a max temperature of <code>9999</code>, those are almost certainly missing-data placeholders, not real readings. Replace them with <code>NaN</code> before analysing.', 'Watch for sentinel values.'));
  C.push(h2('Series and columns'));
  C.push(p('Selecting one column returns a <strong>Series</strong> \u2014 a labelled 1-D array. Summary methods work directly on it:'));
  C.push(code('python', 'aqi = df["aqi"]\nprint(type(aqi))       # pandas Series\nprint(aqi.mean())\nprint(aqi.median())\nprint(aqi.max())\nprint(aqi.std())'));
  C.push(p('Select multiple columns with a list inside double brackets:'));
  C.push(code('python', 'subset = df[["station", "date", "aqi", "pm25"]]\nsubset.head()'));
  C.push(h2('Filtering rows with boolean masks'));
  C.push(p('The most-used pandas skill: keep rows where a condition is <code>True</code>.'));
  C.push(code('python', '# unhealthy air days (AQI > 100)\nunhealthy = df[df["aqi"] > 100]\n\n# summer months only\nsummer = df[df["month"].isin([6, 7, 8, 9])]\n\n# PM2.5 above EPA daily standard (35 ug/m3)\nhigh_pm25 = df[df["pm25"] > 35.0]'));
  C.push(h3('Combining conditions'));
  C.push(p('Use <code>&amp;</code> for AND and <code>|</code> for OR. Wrap each test in parentheses:'));
  C.push(code('python', 'bad_summer = df[(df["aqi"] > 100) & (df["month"] >= 6)]\n\n# either high ozone OR high PM2.5\npolluted = df[(df["o3_ppm"] > 0.070) | (df["pm25"] > 35)]'));
  C.push(callout('warn', 'Plain Python <code>and</code> / <code>or</code> do not work on Series. Always use <code>&amp;</code> / <code>|</code> with parentheses around each condition.', 'Use & and |, not and / or.'));
  C.push(h3('The .query() shortcut'));
  C.push(code('python', 'df.query("aqi > 100 and month >= 6 and station == \'Downtown LA\'")'));
  C.push(h2('Sorting and ranking'));
  C.push(code('python', '# worst air days first\ndf.sort_values("aqi", ascending=False).head(10)\n\n# sort by multiple columns\ndf.sort_values(["station", "date"], ascending=[True, True])\n\n# rank stations by mean AQI\nrank = df.groupby("station")["aqi"].mean().sort_values(ascending=False)\nprint(rank.head(5))'));
  C.push(h2('Creating and modifying columns'));
  C.push(p('Assign to a new column name. Operations run on the entire column at once (vectorised):'));
  C.push(code('python', '# unit conversion\ndf["temp_f"] = df["temp_c"] * 9/5 + 32\n\n# extract year from a datetime column\ndf["year"] = df["date"].dt.year\ndf["month"] = df["date"].dt.month'));
  C.push(h3('Conditional labels with .apply()'));
  C.push(code('python', 'def aqi_category(val):\n    if pd.isna(val):\n        return "Missing"\n    if val <= 50:\n        return "Good"\n    if val <= 100:\n        return "Moderate"\n    if val <= 150:\n        return "Unhealthy for Sensitive"\n    return "Unhealthy"\n\ndf["category"] = df["aqi"].apply(aqi_category)'));
  C.push(h3('Faster mapping with .map() and .replace()'));
  C.push(code('python', '# map pollutant codes to full names\ncode_map = {"PM25": "Fine particles", "O3": "Ozone", "NO2": "Nitrogen dioxide"}\ndf["pollutant_name"] = df["parameter"].map(code_map)\n\n# fix known label typos\ndf["station"] = df["station"].replace({"Dtla": "Downtown LA", "downtown la": "Downtown LA"})'));
  C.push(h2('Group and summarise'));
  C.push(p('Split-apply-combine: group rows by a column, compute a summary for each group. This answers most "how much per ___" questions.'));
  C.push(code('python', '# mean AQI per station\ndf.groupby("station")["aqi"].mean()\n\n# multiple stats at once\ndf.groupby("station")["aqi"].agg(["mean", "max", "min", "count"])\n\n# group by two columns\ndf.groupby(["month", "category"])["aqi"].mean()'));
  C.push(h3('Named aggregations'));
  C.push(code('python', 'summary = df.groupby("station").agg(\n    mean_aqi=("aqi", "mean"),\n    max_aqi=("aqi", "max"),\n    n_readings=("aqi", "count"),\n    mean_pm25=("pm25", "mean")\n).reset_index()\nsummary.sort_values("mean_aqi", ascending=False)'));
  C.push(h3('CalEnviroScreen example: burden by county'));
  C.push(code('python', 'ces = pd.read_csv("calenviroscreen_4_0.csv")\n\n# average PM2.5 percentile score by county\nby_county = ces.groupby("County")["PM2.5"].mean().sort_values(ascending=False)\nprint(by_county.head())'));
  C.push(h2('Working with dates and times'));
  C.push(p('Environmental time series depend on correct datetime parsing.'));
  C.push(code('python', 'df["date"] = pd.to_datetime(df["date"], errors="coerce")\n\n# extract parts\ndf["year"] = df["date"].dt.year\ndf["month"] = df["date"].dt.month\ndf["day_of_week"] = df["date"].dt.day_name()\n\n# filter a date range\nmask = (df["date"] >= "2023-06-01") & (df["date"] <= "2023-08-31")\nsummer_2023 = df[mask]'));
  C.push(h3('Resampling time series'));
  C.push(code('python', '# hourly readings -> daily mean AQI\ndf_ts = df.set_index("date")\ndaily = df_ts["aqi"].resample("D").mean()\nmonthly = df_ts["aqi"].resample("ME").mean()\nprint(monthly.head())'));
  C.push(h2('Missing data'));
  C.push(p('Real sensors fail. Missing values appear as <code>NaN</code>. Handle them deliberately:'));
  C.push(code('python', 'df["aqi"].isna().sum()           # count missing\ndf["aqi"].isna().mean() * 100     # percent missing\n\n# drop rows where AQI is missing\nclean = df.dropna(subset=["aqi"])\n\n# fill with median\ndf["aqi"] = df["aqi"].fillna(df["aqi"].median())\n\n# forward-fill for time series gaps\ndf["aqi"] = df.groupby("station")["aqi"].ffill()'));
  C.push(callout('note', 'There is no universal rule for missing data. The <a class="inline" href="lesson.html?id=data-cleaning">data cleaning lesson</a> covers when to drop, fill, or flag gaps.', 'Missing data strategy matters.'));
  C.push(h2('Duplicates and unique values'));
  C.push(code('python', 'df.duplicated().sum()\ndf = df.drop_duplicates(subset=["station", "date"], keep="first")\n\nprint(df["station"].nunique())\nprint(df["station"].unique())'));
  C.push(h2('Merging tables'));
  C.push(p('Join station readings with station metadata (latitude, elevation, land use):'));
  C.push(code('python', 'readings = pd.read_csv("aqi_readings.csv")\nmeta = pd.read_csv("station_metadata.csv")\n\nmerged = readings.merge(meta, on="station_id", how="left")\nmerged.head()'));
  C.push(h3('Join types'));
  C.push(table(['how=', 'Keeps'], [
    ['<code>"left"</code>', 'All rows from the left table; match from right'],
    ['<code>"inner"</code>', 'Only rows with a match in both tables'],
    ['<code>"outer"</code>', 'All rows from both; NaN where no match']
  ]));
  C.push(h2('Reshaping: wide and long'));
  C.push(p('Climate TRACE and NOAA often publish wide tables (one column per year). Long format is easier to group and plot.'));
  C.push(code('python', '# wide -> long\nlong = df.melt(\n    id_vars=["facility_name", "sector"],\n    value_vars=["2019", "2020", "2021", "2022"],\n    var_name="year",\n    value_name="co2e_tonnes"\n)\n\n# long -> wide\nwide = long.pivot_table(\n    index="facility_name", columns="year", values="co2e_tonnes"\n)'));
  C.push(h2('String operations on text columns'));
  C.push(code('python', 'df["station"] = df["station"].str.strip().str.title()\ndf["has_highway"] = df["location"].str.contains("I-5", case=False, na=False)\ndf["county_code"] = df["site_id"].str[:2]'));
  C.push(h2('Exporting cleaned data'));
  C.push(code('python', 'df.to_csv("la_aqi_clean.csv", index=False)\ndf.to_parquet("la_aqi_clean.parquet")  # faster for large files'));
  C.push(h2('A full AirNow workflow'));
  C.push(steps([
    'Load hourly AQI CSV with <code>parse_dates</code> and <code>na_values</code>.',
    'Inspect with <code>head()</code>, <code>info()</code>, and <code>describe()</code>.',
    'Standardise station names with <code>.str.strip()</code> and <code>.replace()</code>.',
    'Filter to PM2.5 as the dominant pollutant.',
    'Group by station and month; compute mean AQI.',
    'Sort to find the worst station-month combinations.',
    'Export the summary table to CSV.'
  ]));
  C.push(code('python', 'import pandas as pd\n\nurl = "https://files.airnowtech.org/?filename=AQI_LosAngeles.csv"\ndf = pd.read_csv(url, parse_dates=["Date"], na_values=[-999])\n\ndf["Station"] = df["Station"].str.strip()\npm25 = df[df["Defining Parameter"] == "PM2.5"].copy()\n\nmonthly = (\n    pm25.groupby(["Station", pm25["Date"].dt.month])["AQI"]\n    .mean()\n    .reset_index(name="mean_aqi")\n    .sort_values("mean_aqi", ascending=False)\n)\nprint(monthly.head(10))'));
  C.push(h2('Common mistakes'));
  C.push(list([
    'Forgetting parentheses around each condition in <code>&amp;</code> / <code>|</code> filters.',
    'Calling <code>.mean()</code> on a column that is still text (check <code>dtypes</code>).',
    'Modifying a slice instead of a copy \u2014 use <code>.copy()</code> when filtering then editing.',
    'Ignoring sentinel values like <code>-999</code> that inflate or deflate summary stats.',
    'Merging on columns with mismatched types (string vs int station IDs).'
  ]));
  C.push(exercise(
    'Find the dirtiest month',
    'Given a DataFrame <code>df</code> with columns <code>month</code> and <code>aqi</code>, compute the average AQI for each month and print the month with the highest average.',
    'Group by <code>month</code>, take <code>mean()</code> of <code>aqi</code>, then use <code>.idxmax()</code> for the month label and <code>.max()</code> for the value.',
    { lang: 'python', code: 'monthly = df.groupby("month")["aqi"].mean()\nprint(monthly)\nprint("Worst month:", monthly.idxmax(), "->", round(monthly.max(), 1))', note: '<code>.idxmax()</code> returns the label; <code>.max()</code> returns the value.' }
  ));
  C.push(exercise(
    'Rank LA stations by unhealthy days',
    'Load an air-quality DataFrame with columns <code>station</code>, <code>date</code>, and <code>aqi</code>. Count how many days each station had AQI above 100, then list stations from most to fewest unhealthy days.',
    'Filter first with <code>df[df["aqi"] > 100]</code>, then <code>groupby("station")</code> and <code>.size()</code> or <code>.count()</code>, then <code>sort_values(ascending=False)</code>.',
    { lang: 'python', code: 'bad_days = df[df["aqi"] > 100].groupby("station").size()\nbad_days = bad_days.sort_values(ascending=False)\nprint(bad_days.head(10))' }
  ));
  C.push(exercise(
    'Merge readings with station coordinates',
    'You have <code>readings</code> (station_id, date, pm25) and <code>stations</code> (station_id, lat, lon, elevation). Join them so every reading row has latitude and longitude, then compute mean PM2.5 by elevation band (below 100m, 100-500m, above 500m).',
    'Use <code>readings.merge(stations, on="station_id")</code>. Create an elevation band column with <code>pd.cut()</code> or <code>.apply()</code>, then groupby the band.',
    { lang: 'python', code: 'merged = readings.merge(stations, on="station_id", how="left")\n\nmerged["elev_band"] = pd.cut(\n    merged["elevation"],\n    bins=[-1, 100, 500, 10000],\n    labels=["low", "mid", "high"]\n)\n\nmerged.groupby("elev_band")["pm25"].mean()' }
  ));
  C.push(h2('Recap'));
  C.push(list([
    '<code>pd.read_csv()</code> loads tables from files or URLs; inspect with <code>head()</code>, <code>info()</code>, <code>describe()</code>.',
    'Filter rows with boolean conditions using <code>&amp;</code> / <code>|</code> and parentheses.',
    'Create columns by assignment; use <code>.apply()</code>, <code>.map()</code>, and <code>.replace()</code> for labels.',
    '<code>groupby()</code> + aggregation answers most "by category" questions.',
    'Parse dates with <code>pd.to_datetime()</code>; resample time series with <code>.resample()</code>.',
    'Handle <code>NaN</code> deliberately; watch for sentinel values like <code>-999</code>.',
    '<code>merge()</code> joins tables; <code>melt()</code> / <code>pivot_table()</code> reshape wide and long.'
  ]));
  C.push(callout('tip', 'You are ready for the <a class="inline" href="projects.html">Map LA\u2019s air quality</a> project \u2014 a perfect first pandas notebook on real AirNow data.', 'Next up.'));

  return {
    title: 'Data wrangling with pandas',
    track: 'data',
    tool: 'Python',
    level: 'beginner',
    time: '~6-8 hrs',
    lede: 'pandas is the workhorse of environmental data science in Python. It turns messy monitoring tables from AirNow, NOAA, USGS, and Climate TRACE into something you can filter, group, and summarise in a line or two. If you learn one library deeply, make it this one.',
    learn: [
      'Load CSV and URL data into a DataFrame',
      'Inspect, select, filter, and sort rows and columns',
      'Create new columns and label categories',
      'Group and aggregate to find environmental patterns',
      'Handle dates, missing values, merges, and reshaping'
    ],
    prereqs: [{ id: 'python-fundamentals', label: 'Python fundamentals' }],
    resources: [
      { name: 'Kaggle: pandas', url: 'https://www.kaggle.com/learn/pandas', kind: 'course' },
      { name: '10 minutes to pandas', url: 'https://pandas.pydata.org/docs/user_guide/10min.html', kind: 'docs' },
      { name: 'pandas cheat sheet', url: 'https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf', kind: 'pdf' },
      { name: 'AirNow data format guide', url: 'https://docs.airnowapi.org/', kind: 'docs' }
    ],
    unlock: { label: 'Map LA\u2019s air quality', url: 'projects.html', blurb: 'A perfect first pandas project: load AQI readings, filter, group by station, and summarise.' },
    content: C
  };
}

// ---------------------------------------------------------------------------
// TIDYVERSE
// ---------------------------------------------------------------------------
function buildTidyverse() {
  const C = [];

  C.push(p('The <strong>tidyverse</strong> is a collection of R packages \u2014 <code>dplyr</code>, <code>readr</code>, <code>tidyr</code>, <code>ggplot2</code> \u2014 that share a consistent design. Together they make CalEnviroScreen burden rankings, NOAA climate summaries, and USGS streamflow analysis read like plain English.'));
  C.push(callout('note', 'Complete <a class="inline" href="lesson.html?id=r-fundamentals">R fundamentals</a> first. Use RStudio or Posit Cloud and run each block in the Console or a script.', 'Before you start.'));
  C.push(code('r', 'library(tidyverse)\n# Loads dplyr, readr, tidyr, ggplot2, and more'));
  C.push(h2('Why the tidyverse for environmental data'));
  C.push(p('R dominates ecological statistics and many California policy labs. CalEnviroScreen, EPA screening tools, and academic climate papers often ship R examples. The tidyverse is the modern standard for data wrangling in R.'));
  C.push(table(['Package', 'Role', 'Environmental example'], [
    ['<code>readr</code>', 'Read CSV fast', 'Load CalEnviroScreen 4.0'],
    ['<code>dplyr</code>', 'Filter, mutate, summarise', 'Rank tracts by PM2.5 percentile'],
    ['<code>tidyr</code>', 'Reshape tables', 'Pivot Climate TRACE emissions wide/long'],
    ['<code>lubridate</code>', 'Date handling', 'Parse NOAA daily station dates'],
    ['<code>stringr</code>', 'Text cleaning', 'Standardise county names']
  ]));
  C.push(h2('Reading data with readr'));
  C.push(code('r', 'ces <- read_csv("calenviroscreen_4_0.csv")\nglimpse(ces)   # compact column overview\n\n# read_csv guesses types; specify if needed:\naq <- read_csv("la_air_quality.csv",\n  col_types = cols(\n    date = col_date(),\n    aqi  = col_double(),\n    station = col_character()\n  )\n)'));
  C.push(callout('tip', '<code>read_csv()</code> shows column types as it loads. If a numeric column appears as <code>chr</code>, something is wrong \u2014 often a header row or text sentinel mixed in.', 'Watch column types on load.'));
  C.push(h2('The pipe: read top to bottom'));
  C.push(p('The pipe <code>|></code> passes the result on the left as the first argument to the function on the right. Read it as "then".'));
  C.push(code('r', '# nested calls (hard to read)\nsummary(filter(aq, aqi > 100))\n\n# piped (reads like a recipe)\naq |>\n  filter(aqi > 100) |>\n  summary()'));
  C.push(callout('note', '<code>|></code> is base R (4.1+). Older code uses <code>%>%</code> from magrittr \u2014 they behave the same for everyday dplyr work.', 'Two pipe operators.'));
  C.push(h2('The five core dplyr verbs'));
  C.push(table(['Verb', 'What it does', 'Example'], [
    ['<code>filter()</code>', 'Keep matching rows', 'Unhealthy air days'],
    ['<code>select()</code>', 'Keep/drop columns', 'Station, date, AQI only'],
    ['<code>mutate()</code>', 'Create or change columns', 'AQI category labels'],
    ['<code>arrange()</code>', 'Sort rows', 'Worst AQI first'],
    ['<code>summarise()</code>', 'Collapse to stats', 'Mean AQI per county']
  ]));
  C.push(h2('filter: keep the rows you need'));
  C.push(code('r', 'aq |>\n  filter(aqi > 100) |>\n  filter(month %in% c(6, 7, 8, 9)) |>\n  head()'));
  C.push(p('Combine conditions with <code>&amp;</code> (and) and <code>|</code> (or):'));
  C.push(code('r', 'aq |>\n  filter(aqi > 100 & pm25 > 35) |>\n  filter(station == "Downtown LA" | station == "Pasadena")'));
  C.push(h3('filter helpers'));
  C.push(code('r', 'aq |>\n  filter(between(aqi, 50, 100)) |>       # moderate range\n  filter(station %in% c("Long Beach", "Pasadena")) |>\n  filter(!is.na(pm25))                    # drop missing PM2.5'));
  C.push(h2('select: choose columns'));
  C.push(code('r', 'aq |>\n  select(station, date, aqi, pm25) |>\n  head()\n\n# drop columns\naq |> select(-temp_c, -wind_speed)\n\n# rename while selecting\naq |> select(site = station, reading = aqi)'));
  C.push(h3('select helpers'));
  C.push(code('r', 'aq |> select(starts_with("pm"))     # pm25, pm10\naq |> select(where(is.numeric))    # all numeric columns\naq |> select(everything())         # all columns, useful mid-pipe'));
  C.push(h2('mutate: create and transform columns'));
  C.push(code('r', 'aq <- aq |>\n  mutate(\n    temp_f = temp_c * 9/5 + 32,\n    year = year(date),\n    month = month(date),\n    log_pm25 = log(pm25 + 1)\n  )'));
  C.push(h3('case_when for category labels'));
  C.push(code('r', 'aq <- aq |>\n  mutate(\n    category = case_when(\n      aqi <= 50  ~ "Good",\n      aqi <= 100 ~ "Moderate",\n      aqi <= 150 ~ "Unhealthy for Sensitive",\n      TRUE       ~ "Unhealthy"\n    )\n  )'));
  C.push(callout('tip', '<code>case_when()</code> evaluates conditions top to bottom. Put the catch-all <code>TRUE ~ "..."</code> last.', 'case_when order matters.'));
  C.push(h2('arrange: sort your results'));
  C.push(code('r', 'aq |>\n  arrange(desc(aqi)) |>\n  head(10)\n\n# multiple sort keys\naq |>\n  arrange(station, desc(aqi)) |>\n  head()'));
  C.push(h2('summarise and group_by'));
  C.push(p('Pair <code>group_by()</code> with <code>summarise()</code> to compute one row of statistics per group:'));
  C.push(code('r', 'aq |>\n  group_by(station) |>\n  summarise(\n    mean_aqi = mean(aqi, na.rm = TRUE),\n    max_aqi  = max(aqi, na.rm = TRUE),\n    n        = n()\n  ) |>\n  arrange(desc(mean_aqi))'));
  C.push(callout('warn', 'If any value is <code>NA</code>, <code>mean()</code> returns <code>NA</code> by default. Always add <code>na.rm = TRUE</code> unless you intentionally want missing summaries.', 'Mind the NAs.'));
  C.push(h3('Multiple grouping columns'));
  C.push(code('r', 'aq |>\n  group_by(station, month) |>\n  summarise(mean_aqi = mean(aqi, na.rm = TRUE), .groups = "drop") |>\n  arrange(desc(mean_aqi))'));
  C.push(h2('CalEnviroScreen: ranking pollution burden'));
  C.push(code('r', 'ces <- read_csv("calenviroscreen_4_0.csv")\n\n# top 10 most burdened tracts by PM2.5 percentile\nhigh_burden <- ces |>\n  select(CensusTract, County, PM2.5, Poverty) |>\n  arrange(desc(PM2.5)) |>\n  head(10)\n\nprint(high_burden)'));
  C.push(h3('County-level summary'));
  C.push(code('r', 'by_county <- ces |>\n  group_by(County) |>\n  summarise(\n    mean_pm25  = mean(PM2.5, na.rm = TRUE),\n    mean_poverty = mean(Poverty, na.rm = TRUE),\n    n_tracts = n()\n  ) |>\n  arrange(desc(mean_pm25))'));
  C.push(h2('count: a summarise shortcut'));
  C.push(code('r', '# how many unhealthy days per station?\naq |>\n  filter(aqi > 100) |>\n  count(station, sort = TRUE)'));
  C.push(h2('distinct and slice'));
  C.push(code('r', '# unique stations\naq |> distinct(station)\n\n# top 3 worst days overall\naq |> slice_max(aqi, n = 3)\n\n# one row per station (highest AQI)\naq |>\n  group_by(station) |>\n  slice_max(aqi, n = 1)'));
  C.push(h2('Joining tables'));
  C.push(p('Combine air readings with station metadata or CalEnviroScreen geography:'));
  C.push(code('r', 'readings <- read_csv("aqi_readings.csv")\nmeta <- read_csv("station_metadata.csv")\n\njoined <- readings |>\n  left_join(meta, by = "station_id")\n\nglimpse(joined)'));
  C.push(table(['Join', 'Function', 'Keeps'], [
    ['Left', '<code>left_join()</code>', 'All rows from left table'],
    ['Inner', '<code>inner_join()</code>', 'Only matching rows'],
    ['Full', '<code>full_join()</code>', 'All rows from both']
  ]));
  C.push(h2('tidyr: pivot longer and wider'));
  C.push(p('Climate TRACE facility data often arrives wide (one column per year). Long format is easier to filter and plot.'));
  C.push(code('r', 'wide <- read_csv("climate_trace_facilities.csv")\n\nlong <- wide |>\n  pivot_longer(\n    cols = starts_with("20"),\n    names_to = "year",\n    values_to = "co2e_tonnes"\n  )\n\nglimpse(long)'));
  C.push(code('r', '# long back to wide\nlong |>\n  pivot_wider(\n    names_from = year,\n    values_from = co2e_tonnes\n  )'));
  C.push(h2('Working with dates: lubridate'));
  C.push(code('r', 'aq <- aq |>\n  mutate(\n    date = ymd(date),\n    year = year(date),\n    month = month(date, label = TRUE),\n    season = case_when(\n      month(date) %in% c(12, 1, 2) ~ "Winter",\n      month(date) %in% c(3, 4, 5)  ~ "Spring",\n      month(date) %in% c(6, 7, 8)  ~ "Summer",\n      TRUE                         ~ "Fall"\n    )\n  )'));
  C.push(h2('String cleaning with stringr'));
  C.push(code('r', 'aq <- aq |>\n  mutate(\n    station = str_trim(station),\n    station = str_to_title(station),\n    is_coastal = str_detect(location, regex("beach|coast", ignore_case = TRUE))\n  )'));
  C.push(h2('Handling missing data'));
  C.push(code('r', '# count NAs per column\naq |> summarise(across(everything(), ~sum(is.na(.))))\n\n# drop rows missing AQI\nclean <- aq |> filter(!is.na(aqi))\n\n# replace NA with median\naq <- aq |>\n  group_by(station) |>\n  mutate(aqi = if_else(is.na(aqi), median(aqi, na.rm = TRUE), aqi)) |>\n  ungroup()'));
  C.push(h2('The across() helper'));
  C.push(code('r', '# summarise multiple numeric columns at once\naq |>\n  group_by(station) |>\n  summarise(\n    across(c(aqi, pm25, o3_ppm), ~mean(.x, na.rm = TRUE))\n  )'));
  C.push(h2('A complete dplyr pipeline'));
  C.push(steps([
    'Load CalEnviroScreen with <code>read_csv()</code>.',
    'Select tract ID, county, PM2.5, and poverty columns.',
    'Filter to tracts in Los Angeles County.',
    'Add a high-burden flag where PM2.5 percentile exceeds 90.',
    'Group by city and summarise mean PM2.5 and tract count.',
    'Arrange descending and print the top 10 cities.'
  ]));
  C.push(code('r', 'ces <- read_csv("calenviroscreen_4_0.csv")\n\nla_burden <- ces |>\n  filter(County == "Los Angeles") |>\n  mutate(high_burden = PM2.5 > 90) |>\n  group_by(City) |>\n  summarise(\n    mean_pm25 = mean(PM2.5, na.rm = TRUE),\n    n_tracts = n(),\n    n_high = sum(high_burden, na.rm = TRUE)\n  ) |>\n  arrange(desc(mean_pm25)) |>\n  head(10)\n\nprint(la_burden)'));
  C.push(h2('Common mistakes'));
  C.push(list([
    'Forgetting <code>na.rm = TRUE</code> in <code>mean()</code> and getting all-NA summaries.',
    'Grouping but not ungrouping before the next operation (check with <code>group_by()</code> output).',
    'Using <code>filter()</code> when you mean <code>select()</code> \u2014 filter keeps rows, select keeps columns.',
    'Joining on columns with different names \u2014 specify <code>by = c("left_col" = "right_col")</code>.',
    'Not checking row counts after a join (unexpected <code>inner_join</code> can silently drop rows).'
  ]));
  C.push(exercise(
    'Rank stations by bad-air days',
    'For each <code>station</code>, count how many rows have <code>aqi &gt; 100</code>, then show stations ordered from most to fewest unhealthy days.',
    'Filter to <code>aqi &gt; 100</code>, then <code>group_by(station)</code> and <code>summarise(bad_days = n())</code>, then <code>arrange(desc(bad_days))</code>. Or use <code>count(station, sort = TRUE)</code> after filtering.',
    { lang: 'r', code: 'aq |>\n  filter(aqi > 100) |>\n  count(station, sort = TRUE)' }
  ));
  C.push(exercise(
    'Summarise CalEnviroScreen by county',
    'Load CalEnviroScreen data and compute, for each county: mean PM2.5 percentile, mean poverty score, and number of census tracts. Show the 5 counties with highest mean PM2.5.',
    'Use <code>group_by(County)</code>, <code>summarise()</code> with <code>na.rm = TRUE</code>, and <code>slice_max()</code> or <code>arrange(desc()) |> head(5)</code>.',
    { lang: 'r', code: 'ces <- read_csv("calenviroscreen_4_0.csv")\n\nces |>\n  group_by(County) |>\n  summarise(\n    mean_pm25 = mean(PM2.5, na.rm = TRUE),\n    mean_poverty = mean(Poverty, na.rm = TRUE),\n    n_tracts = n()\n  ) |>\n  slice_max(mean_pm25, n = 5)' }
  ));
  C.push(exercise(
    'Pivot Climate TRACE emissions to long format',
    'Given a wide CSV with columns <code>facility</code>, <code>2019</code>, <code>2020</code>, <code>2021</code>, <code>2022</code> (CO2e tonnes), pivot to long format and compute total emissions per facility across all years.',
    'Use <code>pivot_longer(cols = starts_with("20"), ...)</code>, then <code>group_by(facility) |> summarise(total = sum(co2e_tonnes))</code>.',
    { lang: 'r', code: 'facilities <- read_csv("climate_trace_facilities.csv")\n\nfacilities |>\n  pivot_longer(starts_with("20"), names_to = "year", values_to = "co2e") |>\n  group_by(facility) |>\n  summarise(total_co2e = sum(co2e, na.rm = TRUE)) |>\n  arrange(desc(total_co2e))' }
  ));
  C.push(h2('Recap'));
  C.push(list([
    'Load data with <code>read_csv()</code>; inspect with <code>glimpse()</code>.',
    'Chain steps with the pipe <code>|></code> for readable top-to-bottom recipes.',
    'Five verbs: <code>filter</code>, <code>select</code>, <code>mutate</code>, <code>arrange</code>, <code>summarise</code>.',
    '<code>case_when()</code> labels categories; <code>group_by()</code> + <code>summarise()</code> aggregates.',
    '<code>left_join()</code> merges tables; <code>pivot_longer()</code> / <code>pivot_wider()</code> reshape.',
    'Always use <code>na.rm = TRUE</code> in summary functions unless NAs should propagate.'
  ]));
  C.push(callout('tip', 'Apply these skills in the <a class="inline" href="projects.html">Who carries the pollution burden?</a> project using CalEnviroScreen data.', 'Next up.'));

  return {
    title: 'Data wrangling with the tidyverse',
    track: 'data',
    tool: 'R',
    level: 'beginner',
    time: '~6-8 hrs',
    lede: 'The tidyverse is a family of R packages that make data manipulation read like a sentence. With dplyr verbs and the pipe, you can express complex CalEnviroScreen rankings, NOAA summaries, and Climate TRACE reshaping as a clear, top-to-bottom recipe.',
    learn: [
      'Use the pipe to chain steps readably',
      'Apply the five core dplyr verbs',
      'Filter, sort, mutate, and summarise environmental tables',
      'Join tables and pivot between wide and long formats',
      'Clean text and dates with stringr and lubridate'
    ],
    prereqs: [{ id: 'r-fundamentals', label: 'R fundamentals' }],
    resources: [
      { name: 'R for Data Science: transform', url: 'https://r4ds.hadley.nz/data-transform', kind: 'book' },
      { name: 'dplyr cheat sheet', url: 'https://rstudio.github.io/cheatsheets/data-transformation.pdf', kind: 'pdf' },
      { name: 'dplyr documentation', url: 'https://dplyr.tidyverse.org/', kind: 'docs' },
      { name: 'CalEnviroScreen data', url: 'https://oehha.ca.gov/calenviroscreen', kind: 'docs' }
    ],
    unlock: { label: 'Who carries the pollution burden?', url: 'projects.html', blurb: 'Use dplyr on CalEnviroScreen to rank communities and summarise the burden.' },
    content: C
  };
}

// ---------------------------------------------------------------------------
// DATA CLEANING
// ---------------------------------------------------------------------------
function buildDataCleaning() {
  const C = [];

  C.push(p('Real environmental data is messy: missing sensor readings, inconsistent station labels, wrong column types, duplicate rows, and sentinel values disguised as real numbers. Cleaning is where most analysis time actually goes \u2014 and doing it carefully separates a trustworthy result from a misleading one.'));
  C.push(callout('note', 'This lesson uses both Python (pandas) and R (tidyverse) side by side. Complete the <a class="inline" href="lesson.html?id=pandas">pandas</a> and <a class="inline" href="lesson.html?id=tidyverse">tidyverse</a> lessons first.', 'Prerequisites.'));
  C.push(callout('warn', 'Never overwrite your raw file. Load it, clean into a new variable or file, and keep every step in code so the process is reproducible and reviewable.', 'Golden rule.'));
  C.push(h2('Why environmental data is especially messy'));
  C.push(list([
    'Sensors go offline and encode gaps as <code>-999</code>, <code>9999</code>, or empty strings.',
    'Agency exports change column names between versions (AirNow, NOAA, USGS).',
    'Text labels vary: "Los Angeles", "LA", "los angeles county".',
    'Multiple readings per station per hour from overlapping monitors.',
    'Climate TRACE and CalEnviroScreen mix census geography with varying precision.'
  ]));
  C.push(h2('Step 1: Diagnose before you fix'));
  C.push(p('Spend time understanding problems before changing anything.'));
  C.push(h3('Python diagnosis checklist'));
  C.push(code('python', 'import pandas as pd\n\ndf = pd.read_csv("raw_air_quality.csv")\n\nprint("Shape:", df.shape)\nprint(df.dtypes)\nprint(df.isna().sum())\nprint(df.describe())\nprint("Unique stations:", df["station"].nunique())\nprint(df["station"].unique()[:20])\nprint("Duplicates:", df.duplicated().sum())'));
  C.push(h3('R diagnosis checklist'));
  C.push(code('r', 'library(tidyverse)\n\ndf <- read_csv("raw_air_quality.csv")\n\nglimpse(df)\nsummary(df)\ndf |> summarise(across(everything(), ~sum(is.na(.))))\ndf |> count(station, sort = TRUE)'));
  C.push(h3('Questions to ask every new dataset'));
  C.push(olist([
    'How many rows and columns? Does that match the documentation?',
    'Are numeric columns actually numeric (<code>dtypes</code> / <code>glimpse</code>)?',
    'How many missing values per column?',
    'Are min/max values plausible (no -999 AQI)?',
    'Are category labels consistent?',
    'Are there duplicate rows?'
  ]));
  C.push(h2('Step 2: Fix column types'));
  C.push(p('Numbers stored as text block math. Dates stored as strings block time-series analysis.'));
  C.push(h3('Python'));
  C.push(code('python', 'df["aqi"] = pd.to_numeric(df["aqi"], errors="coerce")\ndf["date"] = pd.to_datetime(df["date"], errors="coerce")\ndf["station_id"] = df["station_id"].astype(str)  # IDs must not be floats'));
  C.push(h3('R'));
  C.push(code('r', 'df <- df |>\n  mutate(\n    aqi = parse_number(aqi),\n    date = ymd(date),\n    station_id = as.character(station_id)\n  )'));
  C.push(callout('tip', 'Use <code>errors="coerce"</code> (Python) or <code>parse_number()</code> (R) so invalid values become NA instead of crashing your script.', 'Coerce, do not crash.'));
  C.push(h2('Step 3: Handle sentinel values'));
  C.push(p('Agencies use placeholder numbers for missing readings. Treat them as NA before any summary.'));
  C.push(h3('Python'));
  C.push(code('python', 'SENTINELS = [-999, -9999, 9999, -8888]\n\nfor col in ["aqi", "pm25", "temp_c"]:\n    df[col] = df[col].replace(SENTINELS, pd.NA)\n\n# or on load:\ndf = pd.read_csv("noaa.csv", na_values=SENTINELS)'));
  C.push(h3('R'));
  C.push(code('r', 'SENTINELS <- c(-999, -9999, 9999, -8888)\n\ndf <- df |>\n  mutate(across(c(aqi, pm25, temp_c), ~na_if(.x, SENTINELS)))'));
  C.push(h2('Step 4: Standardise text labels'));
  C.push(p('"Downtown LA", "downtown la", and " Downtown LA " are three different values to a computer.'));
  C.push(h3('Python'));
  C.push(code('python', 'df["station"] = df["station"].str.strip().str.title()\n\nRENAME = {\n    "Dtla": "Downtown La",\n    "La": "Los Angeles",\n    "Long Beach, Ca": "Long Beach"\n}\ndf["station"] = df["station"].replace(RENAME)'));
  C.push(h3('R'));
  C.push(code('r', 'df <- df |>\n  mutate(\n    station = str_trim(station),\n    station = str_to_title(station),\n    station = recode(station,\n      "Dtla" = "Downtown La",\n      "La" = "Los Angeles"\n    )\n  )'));
  C.push(h2('Step 5: Handle missing values'));
  C.push(p('There is no default-correct choice. Decide based on your research question and document the decision.'));
  C.push(table(['Strategy', 'When it fits', 'Python', 'R'], [
    ['Drop rows', 'Few gaps; analysis requires complete rows', 'dropna(subset=["aqi"])', 'filter(!is.na(aqi))'],
    ['Fill with statistic', 'Median/mean is a reasonable stand-in', 'fillna(median())', 'replace_na(median())'],
    ['Forward-fill', 'Time series; last reading still valid', 'ffill()', 'fill(aqi, .direction = "down")'],
    ['Flag', 'Missingness itself is informative', 'New column was_missing', 'mutate(was_missing = is.na(aqi))'],
    ['Leave as NA', 'Your stats already skip NA', 'Do nothing', 'Use na.rm = TRUE']
  ]));
  C.push(h3('Forward-fill by station (Python)'));
  C.push(code('python', 'df = df.sort_values(["station", "date"])\ndf["aqi"] = df.groupby("station")["aqi"].ffill()'));
  C.push(h3('Group median fill (R)'));
  C.push(code('r', 'df <- df |>\n  group_by(station) |>\n  mutate(aqi = if_else(is.na(aqi), median(aqi, na.rm = TRUE), aqi)) |>\n  ungroup()'));
  C.push(h2('Step 6: Remove duplicates'));
  C.push(h3('Python'));
  C.push(code('python', 'df = df.drop_duplicates()\ndf = df.drop_duplicates(subset=["station", "date"], keep="first")'));
  C.push(h3('R'));
  C.push(code('r', 'df <- df |> distinct()\ndf <- df |> distinct(station, date, .keep_all = TRUE)'));
  C.push(h2('Step 7: Detect and handle outliers'));
  C.push(p('Not every extreme value is an error \u2014 wildfire smoke genuinely pushes AQI above 300. But instrument glitches happen.'));
  C.push(h3('Visual check'));
  C.push(p('Plot histograms or boxplots before deleting anything. The <a class="inline" href="lesson.html?id=matplotlib-seaborn">matplotlib lesson</a> covers this in depth.'));
  C.push(h3('IQR rule (Python)'));
  C.push(code('python', 'q1 = df["pm25"].quantile(0.25)\nq3 = df["pm25"].quantile(0.75)\niqr = q3 - q1\nlower = q1 - 1.5 * iqr\nupper = q3 + 1.5 * iqr\n\noutliers = df[(df["pm25"] < lower) | (df["pm25"] > upper)]\nprint(f"Flagged {len(outliers)} outlier rows")'));
  C.push(h3('IQR rule (R)'));
  C.push(code('r', 'q1 <- quantile(df$pm25, 0.25, na.rm = TRUE)\nq3 <- quantile(df$pm25, 0.75, na.rm = TRUE)\niqr <- q3 - q1\n\noutliers <- df |>\n  filter(pm25 < q1 - 1.5 * iqr | pm25 > q3 + 1.5 * iqr)'));
  C.push(callout('warn', 'Do not blindly delete outliers in environmental data. A PM2.5 reading of 200 during a wildfire may be real. Flag outliers, investigate, then decide.', 'Outliers are not always errors.'));
  C.push(h2('Step 8: Reshape to tidy format'));
  C.push(p('Tidy data: one observation per row, one variable per column. Climate TRACE facility tables often arrive wide.'));
  C.push(h3('Python: melt and pivot'));
  C.push(code('python', 'long = df.melt(\n    id_vars=["facility", "sector"],\n    value_vars=["2019", "2020", "2021"],\n    var_name="year", value_name="co2e_tonnes"\n)\n\nwide = long.pivot_table(\n    index="facility", columns="year", values="co2e_tonnes"\n)'));
  C.push(h3('R: pivot_longer and pivot_wider'));
  C.push(code('r', 'long <- df |>\n  pivot_longer(\n    starts_with("20"),\n    names_to = "year",\n    values_to = "co2e_tonnes"\n  )\n\nwide <- long |>\n  pivot_wider(names_from = year, values_from = co2e_tonnes)'));
  C.push(h2('Step 9: Validate your cleaned data'));
  C.push(p('After cleaning, confirm the result makes sense:'));
  C.push(olist([
    'Row count changed? Know why (duplicates removed, NAs dropped).',
    'Summary stats plausible? Mean AQI between 0 and 500, not -999.',
    'No remaining sentinel values?',
    'Date range covers the period you expect?',
    'Join keys match (no orphaned rows after merge)?'
  ]));
  C.push(h3('Python validation snippet'));
  C.push(code('python', 'assert df["aqi"].min() >= 0, "AQI should not be negative"\nassert df["aqi"].max() <= 500, "Check for sentinel values"\nassert df["date"].notna().all(), "Dates should all be parsed"\nprint("Validation passed.")'));
  C.push(h2('Real-world example: cleaning AirNow exports'));
  C.push(steps([
    'Load raw CSV with <code>na_values=[-999]</code>.',
    'Parse dates; check for unparseable rows.',
    'Standardise station names (strip, title-case).',
    'Drop exact duplicate rows on station + timestamp.',
    'Forward-fill short gaps within each station (< 3 hours).',
    'Flag rows where AQI exceeds 200 for manual review.',
    'Export to <code>airnow_clean.csv</code>; keep raw file untouched.'
  ]));
  C.push(code('python', 'import pandas as pd\n\nraw = pd.read_csv("airnow_raw.csv", na_values=[-999, ""])\nclean = raw.copy()\n\nclean["date"] = pd.to_datetime(clean["date"], errors="coerce")\nclean["station"] = clean["station"].str.strip().str.title()\nclean = clean.drop_duplicates(subset=["station", "date"])\nclean = clean.sort_values(["station", "date"])\nclean["aqi"] = clean.groupby("station")["aqi"].ffill()\nclean["high_aqi_flag"] = clean["aqi"] > 200\n\nclean.to_csv("airnow_clean.csv", index=False)\nprint(clean.info())'));
  C.push(h2('Real-world example: CalEnviroScreen in R'));
  C.push(code('r', 'library(tidyverse)\n\nraw <- read_csv("calenviroscreen_4_0.csv")\n\nclean <- raw |>\n  mutate(\n    across(where(is.character), str_trim),\n    PM2.5 = parse_number(as.character(PM2.5)),\n    Poverty = parse_number(as.character(Poverty))\n  ) |>\n  filter(!is.na(CensusTract)) |>\n  distinct(CensusTract, .keep_all = TRUE)\n\nwrite_csv(clean, "ces_clean.csv")'));
  C.push(h2('Document your cleaning decisions'));
  C.push(p('In a notebook, write a Markdown cell above each cleaning step explaining what you did and why. Future you (and reviewers) need to trust the pipeline.'));
  C.push(list([
    'What sentinel values did you replace?',
    'Why did you drop vs fill missing readings?',
    'How many rows were removed at each step?',
    'Did you verify against the data dictionary?'
  ]));
  C.push(exercise(
    'Clean a messy AirNow CSV',
    'Load a raw AirNow CSV with sentinel values and inconsistent station names. Write a cleaning pipeline that: (1) replaces sentinels with NA, (2) parses dates, (3) standardises station names, (4) removes duplicates, and (5) reports final row count and mean AQI.',
    'Work step by step in separate cells. Use <code>na_values</code> on load, <code>.str.strip().str.title()</code> for names, and <code>drop_duplicates(subset=[...])</code>. Print before/after row counts.',
    { lang: 'python', code: 'import pandas as pd\n\nraw = pd.read_csv("airnow_raw.csv", na_values=[-999, -9999])\nclean = raw.copy()\n\nclean["date"] = pd.to_datetime(clean["date"], errors="coerce")\nclean["station"] = clean["station"].str.strip().str.title()\nclean = clean.drop_duplicates(subset=["station", "date"])\nclean = clean.dropna(subset=["aqi"])\n\nprint("Rows before:", len(raw), "after:", len(clean))\nprint("Mean AQI:", round(clean["aqi"].mean(), 1))' }
  ));
  C.push(exercise(
    'Standardise county names in CalEnviroScreen',
    'CalEnviroScreen county names may include trailing spaces or inconsistent casing. Write an R pipeline that trims, title-cases, and recodes known variants, then counts tracts per county.',
    'Use <code>str_trim()</code>, <code>str_to_title()</code>, and <code>count(County, sort = TRUE)</code>.',
    { lang: 'r', code: 'library(tidyverse)\n\nces <- read_csv("calenviroscreen_4_0.csv")\n\nces |>\n  mutate(County = str_to_title(str_trim(County))) |>\n  count(County, sort = TRUE)' }
  ));
  C.push(exercise(
    'Build a reusable cleaning checklist',
    'Pick any dataset from the <a class="inline" href="datasets.html">dataset library</a> (NOAA, USGS, or Climate TRACE). Create a notebook with cells for: diagnose, fix types, handle sentinels, standardise text, handle missing values, remove duplicates, validate, and export.',
    'Keep raw data untouched. Add a Markdown note above each code cell explaining your decision. Print summary stats before and after.',
    { lang: 'python', code: '# Template structure — adapt to your chosen dataset\nimport pandas as pd\n\nraw = pd.read_csv("YOUR_FILE.csv")\nprint("=== DIAGNOSE ===")\nprint(raw.info())\nprint(raw.isna().sum())\n\n# ... cleaning steps ...\n\nprint("=== VALIDATE ===")\nprint(clean.describe())\nclean.to_csv("YOUR_FILE_clean.csv", index=False)' }
  ));
  C.push(h2('Recap'));
  C.push(list([
    '<strong>Diagnose first</strong>: types, missing counts, labels, duplicates, impossible values.',
    'Replace sentinel values (-999, 9999) with NA before summarising.',
    'Fix types explicitly; never assume CSVs loaded correctly.',
    'Standardise text before grouping or joining.',
    'Choose a missing-data strategy on purpose and document it.',
    'Reshape to tidy (long) format for grouping and plotting.',
    'Validate after cleaning; keep raw data raw.'
  ]));

  return {
    title: 'Cleaning & preparing real-world data',
    track: 'data',
    tool: 'Both',
    level: 'intermediate',
    time: '~5-6 hrs',
    lede: 'Real environmental data is messy: missing readings, inconsistent labels, wrong types, sneaky duplicates. Cleaning is where most analysis time actually goes — and doing it carefully is what separates a trustworthy result from a misleading one.',
    learn: [
      'Diagnose common data-quality problems systematically',
      'Fix types, dates, and inconsistent text in Python and R',
      'Handle sentinel values and missing data deliberately',
      'Find outliers and remove duplicates safely',
      'Reshape, validate, and document a reproducible cleaning pipeline'
    ],
    prereqs: [{ id: 'pandas', label: 'pandas' }, { id: 'tidyverse', label: 'tidyverse' }],
    resources: [
      { name: 'Tidy Data (Wickham)', url: 'https://vita.had.co.nz/papers/tidy-data.pdf', kind: 'paper' },
      { name: 'pandas: working with text', url: 'https://pandas.pydata.org/docs/user_guide/text.html', kind: 'docs' },
      { name: 'Kaggle: data cleaning', url: 'https://www.kaggle.com/learn/data-cleaning', kind: 'course' },
      { name: 'NOAA data documentation', url: 'https://www.ncei.noaa.gov/support/access-data-service-api-user-documentation', kind: 'docs' }
    ],
    unlock: { label: 'Track California\u2019s emitters', url: 'projects.html', blurb: 'A facility dataset with the full menu of real-world messiness — perfect cleaning practice.' },
    content: C
  };
}

// ---------------------------------------------------------------------------
// APIS / CSV / JSON
// ---------------------------------------------------------------------------
function buildApisCsvJson() {
  const C = [];

  C.push(p('Before you can analyse air quality, streamflow, or emissions, you have to get the data. Environmental scientists pull from downloadable CSV files, REST APIs returning JSON, and direct URLs. This lesson covers all three using AirNow, NOAA, USGS, and Climate TRACE as examples.'));
  C.push(callout('note', 'Complete the <a class="inline" href="lesson.html?id=pandas">pandas lesson</a> first. All examples use Python.', 'Prerequisites.'));
  C.push(h2('Three ways data arrives'));
  C.push(table(['Source type', 'Examples', 'How you load it'], [
    ['Static file (CSV/Excel)', 'CalEnviroScreen download, NOAA daily summaries', 'pd.read_csv() or pd.read_excel()'],
    ['URL (no API key)', 'Public CSV hosted on agency server', 'pd.read_csv(url)'],
    ['REST API (JSON)', 'AirNow, USGS Water Services, OpenAQ', 'requests.get() then pd.json_normalize()']
  ]));
  C.push(h2('Reading CSV files robustly'));
  C.push(code('python', 'import pandas as pd\n\ndf = pd.read_csv("data/stations.csv")\ndf = pd.read_csv("https://example.org/noaa_daily.csv")\nprint(df.head())'));
  C.push(h3('Common read_csv parameters'));
  C.push(code('python', 'df = pd.read_csv(\n    "usgs_streamflow.csv",\n    parse_dates=["datetime"],\n    na_values=[-999, "", "NA", "null"],\n    skiprows=1,\n    sep=",",\n    encoding="utf-8",\n    dtype={"site_no": str}   # keep IDs as strings\n)'));
  C.push(h3('Reading Excel files'));
  C.push(code('python', 'xl = pd.read_excel("climate_report.xlsx", sheet_name="2024")\n\n# list all sheet names\nimport openpyxl\nwb = openpyxl.load_workbook("climate_report.xlsx")\nprint(wb.sheetnames)'));
  C.push(callout('tip', 'Excel files from agencies often have title rows above the header. Use <code>skiprows=</code> or <code>header=</code> to point pandas at the real column names.', 'Excel gotchas.'));
  C.push(h2('Reading directly from URLs'));
  C.push(p('Many Terrain datasets are hosted CSVs. No download step needed:'));
  C.push(code('python', 'url = "https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/2024/72503099999.csv"\ndf = pd.read_csv(url, parse_dates=["DATE"], na_values=[9999.9])\ndf.head()'));
  C.push(h2('Understanding JSON'));
  C.push(p('APIs return <strong>JSON</strong> \u2014 nested dictionaries and lists that mirror Python data structures.'));
  C.push(code('text', '{\n  "city": "Los Angeles",\n  "count": 2,\n  "results": [\n    {"parameter": "pm25", "value": 18.4, "unit": "ug/m3", "date": "2024-06-01"},\n    {"parameter": "o3", "value": 0.042, "unit": "ppm", "date": "2024-06-01"}\n  ]\n}'));
  C.push(p('Navigate JSON like Python dicts: <code>data["results"][0]["value"]</code> gives <code>18.4</code>.'));
  C.push(h3('JSON data types'));
  C.push(table(['JSON', 'Python', 'Example'], [
    ['string', 'str', '"Los Angeles"'],
    ['number', 'int / float', '18.4'],
    ['boolean', 'bool', 'true'],
    ['null', 'None', 'null'],
    ['array', 'list', '[1, 2, 3]'],
    ['object', 'dict', '{"key": "value"}']
  ]));
  C.push(h2('The requests library'));
  C.push(code('python', 'import requests\n\nurl = "https://api.openaq.org/v2/latest"\nparams = {"city": "Los Angeles", "limit": 100}\n\nresp = requests.get(url, params=params)\nprint(resp.status_code)   # 200 means success\nresp.raise_for_status()   # raises an error if not 200\ndata = resp.json()        # parse JSON into Python dict\nprint(type(data))         # dict'));
  C.push(callout('note', 'The <code>params</code> dict becomes the <code>?city=Los+Angeles&amp;limit=100</code> query string. requests handles URL encoding for you.', 'Query parameters.'));
  C.push(h2('Exploring an API response'));
  C.push(p('Always inspect the JSON shape before building a DataFrame:'));
  C.push(code('python', 'import json\n\n# pretty-print the top level\nprint(data.keys())\nprint(json.dumps(data["results"][0], indent=2)[:500])'));
  C.push(h2('JSON to DataFrame with json_normalize'));
  C.push(code('python', 'records = data["results"]\ndf = pd.json_normalize(records)\ndf.head()'));
  C.push(h3('Nested JSON'));
  C.push(p('Some APIs nest records inside records. Use <code>record_path</code> and <code>meta</code>:'));
  C.push(code('python', 'df = pd.json_normalize(\n    data["results"],\n    record_path="measurements",\n    meta=["location", "city", "country"],\n    errors="ignore"\n)\ndf.head()'));
  C.push(h2('AirNow API example'));
  C.push(p('AirNow provides current and forecast AQI via a free API key. Register at airnowapi.org.'));
  C.push(code('python', 'import os\nimport requests\nimport pandas as pd\n\nAPI_KEY = os.environ.get("AIRNOW_API_KEY")\nurl = "https://www.airnowapi.org/aq/observation/latLong/current/"\n\nparams = {\n    "format": "application/json",\n    "latitude": 34.05,\n    "longitude": -118.25,\n    "distance": 25,\n    "API_KEY": API_KEY\n}\n\nresp = requests.get(url, params=params, timeout=30)\nresp.raise_for_status()\nrecords = resp.json()\n\ndf = pd.json_normalize(records)\nprint(df[["ParameterName", "AQI", "DateObserved"]].head())'));
  C.push(h2('USGS Water Services API'));
  C.push(p('USGS publishes streamflow and water quality as JSON time series:'));
  C.push(code('python', 'url = "https://waterservices.usgs.gov/nwis/iv/"\nparams = {\n    "format": "json",\n    "sites": "11023000",       # LA River at Sepulveda Dam\n    "parameterCd": "00060",    # discharge, cubic feet per second\n    "period": "P7D"            # past 7 days\n}\n\nresp = requests.get(url, params=params, timeout=30)\nresp.raise_for_status()\nraw = resp.json()\n\n# navigate nested structure\nts = raw["value"]["timeSeries"][0]["values"][0]["value"]\ndf = pd.json_normalize(ts)\ndf["dateTime"] = pd.to_datetime(df["dateTime"])\ndf["value"] = pd.to_numeric(df["value"])\nprint(df.head())'));
  C.push(h2('NOAA climate data access'));
  C.push(p('NOAA NCEI offers both bulk CSV downloads and a token-based API. For many projects, reading the hosted CSV directly is simpler:'));
  C.push(code('python', 'station = "USW00023174"  # Los Angeles Intl Airport\nurl = f"https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/2024/{station}.csv"\n\ndf = pd.read_csv(url, parse_dates=["DATE"], na_values=[9999.9, 999.9])\ndf = df.rename(columns={"DATE": "date", "TEMP": "temp_f"})\nprint(df[["date", "temp_f"]].head())'));
  C.push(callout('warn', 'Avoid f-strings with URLs in shared notebooks if they embed secrets. For public NOAA URLs this is fine; for keyed APIs use environment variables.', 'URL construction.'));
  C.push(h2('Climate TRACE bulk downloads'));
  C.push(p('Climate TRACE publishes facility-level emissions as CSV downloads \u2014 no API needed for many use cases:'));
  C.push(code('python', 'df = pd.read_csv(\n    "climate_trace_oil_gas_facilities.csv",\n    dtype={"source_id": str},\n    na_values=["", "NA"]\n)\nprint(df.columns.tolist())\nprint(df.head())'));
  C.push(h2('Authentication and API keys'));
  C.push(p('Many APIs require a free key. Never hard-code it in a notebook you will share.'));
  C.push(code('python', 'import os\n\napi_key = os.environ["AIRNOW_API_KEY"]\n\n# Colab: use the Secrets panel (key icon) and load with:\n# from google.colab import userdata\n# api_key = userdata.get("AIRNOW_API_KEY")\n\nheaders = {"X-API-Key": api_key}\nresp = requests.get(url, headers=headers, params=params)'));
  C.push(callout('warn', 'Hard-coding a key and pushing to GitHub leaks it to the world. Use environment variables, Colab Secrets, or a <code>.env</code> file listed in <code>.gitignore</code>.', 'Keep keys secret.'));
  C.push(h2('Error handling and retries'));
  C.push(code('python', 'import time\n\ndef fetch_with_retry(url, params=None, max_retries=3):\n    for attempt in range(max_retries):\n        try:\n            resp = requests.get(url, params=params, timeout=30)\n            resp.raise_for_status()\n            return resp.json()\n        except requests.RequestException as e:\n            print(f"Attempt {attempt + 1} failed: {e}")\n            time.sleep(2 ** attempt)  # exponential backoff\n    raise RuntimeError("All retries failed")'));
  C.push(h2('Caching responses'));
  C.push(p('While developing, save API responses to disk so you do not re-download on every run:'));
  C.push(code('python', 'import json\nfrom pathlib import Path\n\ncache = Path("cache_openaq.json")\n\nif cache.exists():\n    data = json.loads(cache.read_text())\nelse:\n    resp = requests.get(url, params=params)\n    resp.raise_for_status()\n    data = resp.json()\n    cache.write_text(json.dumps(data))'));
  C.push(h2('Pagination: getting more than one page'));
  C.push(p('APIs often limit results per request. Loop with an offset or page parameter:'));
  C.push(code('python', 'all_records = []\noffset = 0\nlimit = 100\n\nwhile True:\n    resp = requests.get(url, params={"limit": limit, "offset": offset})\n    resp.raise_for_status()\n    batch = resp.json()["results"]\n    if not batch:\n        break\n    all_records.extend(batch)\n    offset += limit\n    time.sleep(0.5)  # be polite\n\ndf = pd.json_normalize(all_records)'));
  C.push(h2('Be a good API citizen'));
  C.push(list([
    '<strong>Read the docs</strong> for rate limits, required parameters, and response formats.',
    '<strong>Do not hammer</strong> the server \u2014 add <code>time.sleep()</code> between calls in loops.',
    '<strong>Cache</strong> responses locally while developing and debugging.',
    '<strong>Handle failures</strong> with <code>raise_for_status()</code>, timeouts, and retries.',
    '<strong>Credit the source</strong> in your reports and README files.'
  ]));
  C.push(h2('Combining API data with local files'));
  C.push(code('python', 'live = pd.json_normalize(api_records)\nmeta = pd.read_csv("station_metadata.csv")\n\ncombined = live.merge(meta, on="station_id", how="left")\ncombined.head()'));
  C.push(h2('Saving fetched data'));
  C.push(code('python', 'df.to_csv("fetched_aqi.csv", index=False)\n\n# save raw JSON for reproducibility\nimport json\nwith open("raw_response.json", "w") as f:\n    json.dump(data, f, indent=2)'));
  C.push(h2('End-to-end workflow'));
  C.push(steps([
    'Find the data source in the <a class="inline" href="datasets.html">dataset library</a> or agency docs.',
    'Decide: static file, URL, or API?',
    'If API: register for a key; read the endpoint documentation.',
    'Fetch with <code>requests.get()</code> or <code>pd.read_csv(url)</code>.',
    'Inspect the raw response (JSON keys or CSV head).',
    'Normalise to a DataFrame with <code>pd.json_normalize()</code> or <code>read_csv()</code>.',
    'Apply cleaning from the <a class="inline" href="lesson.html?id=data-cleaning">data cleaning lesson</a>.',
    'Cache or save the result; document the source and retrieval date.'
  ]));
  C.push(h2('Common mistakes'));
  C.push(list([
    'Assuming all API responses have the same JSON shape \u2014 always inspect first.',
    'Forgetting <code>timeout=</code> on requests (hangs forever on slow servers).',
    'Not handling HTTP errors (404, 429 rate limit, 500 server error).',
    'Parsing nested JSON with the wrong <code>record_path</code>.',
    'Committing API keys to GitHub.'
  ]));
  C.push(exercise(
    'Pull live air quality into a table',
    'Using the OpenAQ API (no key required), request the latest measurements for Los Angeles, parse the JSON, normalise the results into a DataFrame, and print the average value per parameter.',
    'Steps: <code>requests.get</code> with params, <code>.json()</code>, find the records list, <code>pd.json_normalize</code>, then <code>groupby("parameter")["value"].mean()</code>.',
    { lang: 'python', code: 'import requests\nimport pandas as pd\n\nresp = requests.get(\n    "https://api.openaq.org/v2/latest",\n    params={"city": "Los Angeles", "limit": 100}\n)\nresp.raise_for_status()\nrecords = resp.json()["results"]\n\ndf = pd.json_normalize(records, record_path="measurements", meta=["location"])\nprint(df.groupby("parameter")["value"].mean())', note: 'Real API shapes vary. Inspect with print() first, then adjust record_path and meta.' }
  ));
  C.push(exercise(
    'Fetch USGS streamflow for the LA River',
    'Call the USGS instantaneous values API for site 11023000 (discharge, parameter 00060, past 7 days). Parse the nested JSON into a DataFrame with columns dateTime and value. Plot or print the daily mean discharge.',
    'Navigate <code>raw["value"]["timeSeries"][0]["values"][0]["value"]</code>, then <code>pd.json_normalize</code>, parse dates, convert values to numeric.',
    { lang: 'python', code: 'import requests\nimport pandas as pd\n\nresp = requests.get(\n    "https://waterservices.usgs.gov/nwis/iv/",\n    params={"format": "json", "sites": "11023000", "parameterCd": "00060", "period": "P7D"}\n)\nresp.raise_for_status()\nts = resp.json()["value"]["timeSeries"][0]["values"][0]["value"]\n\ndf = pd.json_normalize(ts)\ndf["dateTime"] = pd.to_datetime(df["dateTime"])\ndf["value"] = pd.to_numeric(df["value"])\nprint(df.groupby(df["dateTime"].dt.date)["value"].mean())' }
  ));
  C.push(exercise(
    'Read NOAA daily temps from a URL and summarise',
    'Load Los Angeles International Airport (station USW00023174) daily summary CSV for 2024 directly from NOAA NCEI. Parse dates, handle missing values (9999.9), and compute the mean, min, and max temperature.',
    'Use <code>pd.read_csv(url, parse_dates=["DATE"], na_values=[9999.9])</code>. Summary with <code>df["TEMP"].describe()</code> or explicit agg.',
    { lang: 'python', code: 'import pandas as pd\n\nurl = "https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/2024/USW00023174.csv"\ndf = pd.read_csv(url, parse_dates=["DATE"], na_values=[9999.9, 999.9])\n\nprint(df["TEMP"].describe())\nprint("Mean temp (F):", round(df["TEMP"].mean(), 1))' }
  ));
  C.push(h2('Recap'));
  C.push(list([
    '<code>pd.read_csv()</code> and <code>read_excel()</code> handle local files and URLs.',
    'JSON mirrors Python dicts and lists \u2014 inspect keys before normalising.',
    '<code>requests.get(url, params=...)</code> calls REST APIs; <code>.json()</code> parses the response.',
    '<code>pd.json_normalize()</code> flattens nested records into a tidy DataFrame.',
    'Protect API keys, respect rate limits, cache responses, and handle errors gracefully.'
  ]));
  C.push(callout('tip', 'Browse the <a class="inline" href="datasets.html">dataset library</a> \u2014 each page lists exactly how to pull that source via file, URL, or API.', 'Next up.'));

  return {
    title: 'Getting data: files, APIs & JSON',
    track: 'data',
    tool: 'Python',
    level: 'intermediate',
    time: '~4-5 hrs',
    lede: 'Before you can analyse anything you have to get the data. This lesson covers downloadable files, REST APIs that return JSON, and reading directly from URLs — using AirNow, NOAA, USGS, and Climate TRACE as worked examples.',
    learn: [
      'Read CSV and Excel files robustly with pandas',
      'Understand JSON structure and navigate nested responses',
      'Call REST APIs with requests and handle errors',
      'Turn JSON responses into tidy DataFrames',
      'Use API keys safely and cache responses responsibly'
    ],
    prereqs: [{ id: 'pandas', label: 'pandas' }],
    resources: [
      { name: 'requests quickstart', url: 'https://requests.readthedocs.io/en/latest/user/quickstart/', kind: 'docs' },
      { name: 'AirNow API docs', url: 'https://docs.airnowapi.org/', kind: 'api' },
      { name: 'USGS Water Services', url: 'https://waterservices.usgs.gov/', kind: 'api' },
      { name: 'What is a REST API?', url: 'https://developer.mozilla.org/en-US/docs/Glossary/REST', kind: 'guide' }
    ],
    unlock: { label: 'Explore the dataset library', url: 'datasets.html', blurb: 'Each dataset page lists exactly how to pull it — file, API, or direct URL.' },
    content: C
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const lessons = {
  pandas: buildPandas(),
  tidyverse: buildTidyverse(),
  'data-cleaning': buildDataCleaning(),
  'apis-csv-json': buildApisCsvJson()
};

for (const [id, lesson] of Object.entries(lessons)) {
  const n = lesson.content.length;
  if (n < 55 || n > 85) {
    console.warn('WARNING:', id, 'has', n, 'blocks (target 55-85)');
  }
  writeLesson(id, lesson);
}

console.log('\nDone. Run: node --check scripts/lesson-patches/*.js');
