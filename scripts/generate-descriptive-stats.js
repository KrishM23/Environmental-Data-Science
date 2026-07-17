function p(html) { return { type: 'p', html }; }
function h2(text) { return { type: 'h2', text }; }
function h3(text) { return { type: 'h3', text }; }
function list(items) { return { type: 'list', items }; }
function olist(items) { return { type: 'olist', items }; }
function steps(items) { return { type: 'steps', items }; }
function code(lang, codeStr) { return { type: 'code', lang, code: codeStr }; }
function callout(variant, title, html) { return { type: 'callout', variant, title, html }; }
function table(head, rows) { return { type: 'table', head, rows }; }
function exercise(title, html, hint, solution) {
  const b = { type: 'exercise', title, html };
  if (hint) b.hint = hint;
  if (solution) b.solution = solution;
  return b;
}

function buildDescriptiveStats() {
  const c = [];
  c.push(p('Environmental datasets are rarely tidy single numbers. An air-quality file might hold hourly AQI from dozens of stations; a census tract table lists median income and diesel burden for thousands of polygons. <strong>Descriptive statistics</strong> summarise centre, spread, and shape before any model. This lesson uses AQI, temperature, and tract data in Python and R.'));
  c.push(callout('note', 'How to use this lesson.', 'Python examples use pandas; R examples use dplyr and base stats. You do not need both languages — seeing the same idea twice builds intuition.'));

  c.push(h2('The three questions'));
  c.push(p('For any numeric column: where is the <strong>centre</strong>, how <strong>spread out</strong> are values, and what <strong>shape</strong> does the distribution have?'));
  c.push(list([
    '<strong>Centre:</strong> mean, median, mode',
    '<strong>Spread:</strong> range, IQR, standard deviation',
    '<strong>Shape:</strong> symmetric, skewed, bimodal'
  ]));
  c.push(callout('tip', 'Plot first, summarise second.', 'A histogram takes seconds and prevents reporting a mean when wildfire days dominate the average.'));

  c.push(h2('Loading environmental data'));
  c.push(code('python', 'import pandas as pd\naqi = pd.read_csv("la_aqi_hourly.csv", parse_dates=["timestamp"])\ntemp = pd.read_csv("western_daily_temp.csv", parse_dates=["date"])\ntracts = pd.read_csv("la_tracts_env.csv")'));
  c.push(code('r', 'library(readr)\nlibrary(dplyr)\naqi <- read_csv("la_aqi_hourly.csv")\ntemp <- read_csv("western_daily_temp.csv")\ntracts <- read_csv("la_tracts_env.csv")'));
  c.push(p('Notice different grains: AQI is hourly per station; temperature is daily; tracts are one row per polygon. The right summary depends on the grain.'));

  c.push(h2('One-line summaries'));
  c.push(h3('Python: describe()'));
  c.push(code('python', 'aqi["aqi"].describe()'));
  c.push(h3('R: summary()'));
  c.push(code('r', 'summary(aqi$aqi)'));
  c.push(table(['Statistic', 'Meaning', 'Robust?'], [
    ['Mean', 'Arithmetic average', 'No'],
    ['Median', 'Middle value', 'Yes'],
    ['Std dev', 'Typical distance from mean', 'No'],
    ['IQR', 'Spread of middle 50%', 'Yes']
  ]));

  c.push(h2('Centre: mean vs median'));
  c.push(p('The mean is the sum divided by count; the median is the middle sorted value. They agree for symmetric data but diverge when skewed.'));
  c.push(code('python', 'print("mean:", aqi["aqi"].mean())\nprint("median:", aqi["aqi"].median())\nprint("gap:", aqi["aqi"].mean() - aqi["aqi"].median())'));
  c.push(code('r', 'mean(aqi$aqi, na.rm = TRUE)\nmedian(aqi$aqi, na.rm = TRUE)'));
  c.push(callout('warn', 'The mean is fragile.', 'One wildfire day at AQI 300 raises the monthly mean while the median barely moves. For skewed pollution data, lead with the <strong>median</strong> as typical.'));

  c.push(h3('Mode for categories'));
  c.push(code('python', 'aqi["station_id"].value_counts().head()'));
  c.push(code('r', 'sort(table(aqi$station_id), decreasing = TRUE)[1:5]'));

  c.push(h2('Grouping by station or tract'));
  c.push(p('A global mean hides geography. Group first — mean AQI per station, median diesel burden per district.'));
  c.push(code('python', 'by_station = aqi.groupby("station_id")["aqi"].agg(["count","mean","median","std"])\nby_station.sort_values("mean", ascending=False).head(10)'));
  c.push(code('r', 'aqi %>% group_by(station_id) %>%\n  summarise(n=n(), mean_aqi=mean(aqi, na.rm=TRUE),\n            median_aqi=median(aqi, na.rm=TRUE)) %>%\n  arrange(desc(mean_aqi))'));

  c.push(h2('Spread measures'));
  c.push(code('python', 's = aqi["aqi"]\nq1, q3 = s.quantile([0.25, 0.75])\niqr = q3 - q1\nprint("range:", s.max()-s.min(), "IQR:", iqr, "std:", s.std())'));
  c.push(code('r', 'IQR(aqi$aqi)\nsd(aqi$aqi, na.rm=TRUE)'));
  c.push(p('Standard deviation is in the same units as the data — typical distance from the mean. IQR describes the middle half and resists outliers.'));

  c.push(h2('Boxplots for comparison'));
  c.push(code('python', 'import matplotlib.pyplot as plt\naqi.boxplot(column="aqi", by="season", figsize=(8,4))\nplt.suptitle(""); plt.title("AQI by season")'));
  c.push(code('r', 'library(ggplot2)\nggplot(aqi, aes(x=season, y=aqi)) + geom_boxplot()'));
  c.push(callout('note', 'Boxplot whiskers.', 'Points beyond 1.5 times IQR are flagged — a visual convention, not a command to delete data.'));

  c.push(h2('Shape: histograms'));
  c.push(code('python', 'aqi["aqi"].plot(kind="hist", bins=40, edgecolor="white")'));
  c.push(list([
    '<strong>Right-skewed:</strong> long tail of high values; mean &gt; median — common for AQI.',
    '<strong>Symmetric:</strong> mean approximates median.',
    '<strong>Bimodal:</strong> two humps — two regimes (weekday vs weekend, dry vs wet).'
  ]));

  c.push(h2('Temperature distributions'));
  c.push(code('python', 'summer = temp[temp["month"].isin([6,7,8])]\nwinter = temp[temp["month"].isin([12,1,2])]\nprint("summer median:", summer["tmax_c"].median())\nprint("winter median:", winter["tmax_c"].median())'));
  c.push(code('python', 'temp.groupby("month")["tmax_c"].agg(["mean","median","std"])'));
  c.push(callout('note', 'Units matter.', 'Confirm Celsius vs Fahrenheit at load time and document column names (tmax_c).'));

  c.push(h2('Percentiles'));
  c.push(p('The 90th percentile of daily AQI is exceeded only 10% of the time — a natural bad-air threshold.'));
  c.push(code('python', 'aqi["aqi"].quantile([0.5, 0.9, 0.95, 0.99])'));
  c.push(code('r', 'quantile(aqi$aqi, c(0.5, 0.9, 0.95, 0.99), na.rm=TRUE)'));

  c.push(h2('Outliers: detect, do not delete'));
  c.push(code('python', 'q1, q3 = aqi["aqi"].quantile([0.25, 0.75])\niqr = q3 - q1\nlow, high = q1 - 1.5*iqr, q3 + 1.5*iqr\noutliers = aqi[(aqi["aqi"] < low) | (aqi["aqi"] > high)]\nprint(len(outliers), "flagged hours")'));
  c.push(steps([
    'Plot the column — is the outlier isolated or part of a cluster?',
    'Check metadata — sensor error or unit mismatch?',
    'Cross-reference events — wildfire, inversion layer?',
    'Decide: keep, cap, or exclude with documentation.'
  ]));
  c.push(callout('warn', 'Do not auto-delete.', 'In environmental data, the outlier is often the whole point — the heat wave or smoke event. Investigate before removing.'));

  c.push(h2('Z-scores'));
  c.push(p('z = (x - mean) / std measures standardised distance from centre. Useful for comparing extremes across variables.'));
  c.push(code('python', 'aqi["z"] = (aqi["aqi"] - aqi["aqi"].mean()) / aqi["aqi"].std()\naqi[aqi["z"].abs() > 3][["timestamp","station_id","aqi","z"]].head()'));

  c.push(h2('Census tract summaries'));
  c.push(code('python', 'tracts[["population","median_income","diesel_pm","tree_pct"]].describe()'));
  c.push(code('python', 'tracts.groupby("supervisor_district")["diesel_pm"].median()'));
  c.push(p('When summarising tracts, decide whether each tract counts equally or you weight by population. Unweighted median tract income is not median income of residents.'));

  c.push(h2('Correlation'));
  c.push(p('Pearson r from -1 to +1 measures linear co-movement. Positive: both rise together.'));
  c.push(code('python', 'tracts["tree_pct"].corr(tracts["median_income"])\ntracts.corr(numeric_only=True)'));
  c.push(code('r', 'cor(tracts$tree_pct, tracts$median_income, use="complete.obs")'));
  c.push(code('python', 'import matplotlib.pyplot as plt\nplt.scatter(tracts["tree_pct"], tracts["median_income"], alpha=0.5)'));
  c.push(callout('warn', 'Two caveats.', 'Correlation is not causation. r only captures linear relationships — always scatter-plot the pair.'));

  c.push(h2('Missing data'));
  c.push(code('python', 'print(aqi["aqi"].isna().sum(), "missing")\nprint(aqi["aqi"].count(), "valid")'));
  c.push(callout('tip', 'Report n.', 'Every summary needs sample size: "Median AQI was 52 (n = 18,400 hours)".'));

  c.push(h2('Comparing two groups'));
  c.push(code('python', 'coastal = aqi[aqi["region"]=="coastal"]["aqi"]\ninland = aqi[aqi["region"]=="inland"]["aqi"]\nprint("coastal median:", coastal.median(), "inland median:", inland.median())'));
  c.push(p('A difference in medians is descriptive evidence. Formal significance tests come later — description comes first.'));

  c.push(h2('Writing up findings'));
  c.push(olist([
    'State dataset, time range, and unit of observation.',
    'Report centre, spread, and n; prefer median for skewed data.',
    'Include one plot showing shape.',
    'Mention outliers and whether they are kept.',
    'Avoid causal language.'
  ]));
  c.push(callout('note', 'Anscombe\'s quartet.', 'Four datasets can share identical mean, std, and correlation yet look completely different. Numbers summarise; plots reveal.'));

  c.push(exercise(
    'Profile LA air quality',
    'For hourly AQI with station and season: report mean, median, IQR; explain mean-median gap; plot histogram; compute 95th percentile; flag IQR outliers and inspect top 5. Is the distribution skewed? Which centre is typical?',
    'describe() and quantile(); large mean-median gap signals right skew.',
    { lang: 'python', code: 's = aqi["aqi"]\nprint(s.describe())\nq1,q3 = s.quantile([0.25,0.75]); iqr=q3-q1\ns.plot(kind="hist", bins=40)\nout = aqi[(aqi["aqi"]<q1-1.5*iqr)|(aqi["aqi"]>q3+1.5*iqr)]\nprint(out.nlargest(5,"aqi")[["timestamp","station_id","aqi"]])', note: 'Report median as typical; discuss high outliers as episodic pollution.' }
  ));

  c.push(exercise(
    'Compare census tracts by burden',
    'Using diesel_pm and population: median and IQR of diesel_pm; population-weighted mean; median diesel_pm per supervisor_district; scatter diesel_pm vs median_income with correlation.',
    'Weighted mean: sum(diesel_pm * population) / sum(population).',
    { lang: 'python', code: 'd = tracts["diesel_pm"]\nprint("median:", d.median(), "IQR:", d.quantile(0.75)-d.quantile(0.25))\nwmean = (tracts["diesel_pm"]*tracts["population"]).sum()/tracts["population"].sum()\nprint(tracts.groupby("supervisor_district")["diesel_pm"].median())\nprint("r:", tracts["diesel_pm"].corr(tracts["median_income"]))', note: 'Correlation does not imply income causes diesel exposure.' }
  ));

  c.push(exercise(
    'Seasonal temperature characterisation',
    'From daily tmax_c with month column: mean, median, std for summer and winter; density plot overlay; 99th percentile of summer daily maxima.',
    'Filter by month; quantile(0.99) contextualises record heat.',
    { lang: 'r', code: 'summer <- filter(temp, month %in% c(6,7,8))\nwinter <- filter(temp, month %in% c(12,1,2))\nsummary(summer$tmax_c)\nggplot(temp, aes(x=tmax_c, color=month %in% c(6,7,8))) + geom_density()\nquantile(summer$tmax_c, 0.99)', note: 'Compare record daily max to P99 — a large gap means a true extreme.' }
  ));

  c.push(h2('Recap'));
  c.push(list([
    'Describe centre, spread, and shape before modelling.',
    'Prefer median for skewed pollution and rainfall data.',
    'Group summaries reveal geography and seasonality.',
    'Investigate outliers — never silent-delete.',
    'Correlation measures linear co-movement only; scatter-plot pairs.'
  ]));

  return {
    title: 'Descriptive statistics',
    track: 'stats', tool: 'Both', level: 'beginner', time: '~4-5 hrs',
    lede: 'Before any fancy model, you describe what you have. Descriptive statistics summarise a dataset\u2019s centre, spread and shape \u2014 and knowing which summary to trust (and which lies) is a genuine skill. This comprehensive lesson works through AQI distributions, temperature profiles, and census-tract comparisons in Python and R.',
    learn: [
      'Summarise centre: mean vs. median vs. mode',
      'Measure spread: range, IQR, standard deviation',
      'Read distributions and spot skew with histograms and boxplots',
      'Detect and reason about outliers',
      'Group and compare environmental data by station, season, or tract',
      'Interpret correlation (and its limits)'
    ],
    prereqs: [{ id: 'pandas', label: 'pandas' }],
    resources: [
      { name: 'Khan Academy: statistics', url: 'https://www.khanacademy.org/math/statistics-probability', kind: 'course' },
      { name: 'Seeing Theory (visual stats)', url: 'https://seeing-theory.brown.edu/', kind: 'interactive' },
      { name: 'pandas describe()', url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html', kind: 'docs' }
    ],
    unlock: { label: 'Western heat waves', url: 'projects.html', blurb: 'Summarise temperature distributions and quantify how extreme a heat wave really is.' },
    content: c
  };
}

module.exports = { buildDescriptiveStats };
