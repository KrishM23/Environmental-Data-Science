function p(html) { return { type: 'p', html }; }
function h2(text) { return { type: 'h2', text }; }
function h3(text) { return { type: 'h3', text }; }
function list(items) { return { type: 'list', items }; }
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

function buildTimeSeries() {
  const c = [];
  c.push(p('Climate and environmental data is overwhelmingly time-stamped: hourly AQI, daily temperatures, monthly emissions inventories. Time series have structure — trend, seasonality, autocorrelation — that ordinary methods ignore. This lesson shows how to parse dates, resample, smooth, decompose, and avoid classic pitfalls with Western US temperature and LA air-quality examples.'));
  c.push(callout('note', 'Time is not just another column.', 'Treating dated rows as independent samples breaks regression assumptions and inflates confidence. Respect ordering from the start.'));

  c.push(h2('Parse dates and set the index'));
  c.push(p('First move: convert date strings to datetime and set them as the index. Sort ascending — out-of-order timestamps cause silent bugs.'));
  c.push(code('python', 'import pandas as pd\ndf = pd.read_csv("western_daily_temp.csv", parse_dates=["date"])\ndf = df.set_index("date").sort_index()\ndf.head()'));
  c.push(code('r', 'library(readr)\nlibrary(lubridate)\ntemp <- read_csv("western_daily_temp.csv") %>%\n  mutate(date = ymd(date)) %>%\n  arrange(date)'));
  c.push(code('python', 'df.loc["2024-07"]           # whole month\ndf.loc["2020":"2023"]       # year range\ndf.loc["2024-06-01":"2024-08-31"]  # summer slice'));

  c.push(h2('Datetime components'));
  c.push(p('Extract year, month, dayofyear for grouping and seasonal analysis.'));
  c.push(code('python', 'df["year"] = df.index.year\ndf["month"] = df.index.month\ndf["doy"] = df.index.dayofyear'));
  c.push(code('r', 'temp <- temp %>%\n  mutate(year = year(date), month = month(date), doy = yday(date))'));

  c.push(h2('Frequency and regular grids'));
  c.push(p('Environmental sensors may miss hours or days. Resample to a regular grid before modelling — daily, monthly, annual — and decide how to fill gaps.'));
  c.push(table(['Code', 'Meaning'], [
    ['"D"', 'Calendar day'],
    ['"W"', 'Week ending'],
    ['"ME"', 'Month end'],
    ['"QE"', 'Quarter end'],
    ['"YE"', 'Year end']
  ]));

  c.push(h2('Resampling: change the time step'));
  c.push(p('<strong>Resampling</strong> aggregates to a new frequency. Hourly AQI to daily mean; daily temperature to annual max.'));
  c.push(code('python', 'hourly = pd.read_csv("la_aqi_hourly.csv", parse_dates=["timestamp"])\nhourly = hourly.set_index("timestamp").sort_index()\ndaily_aqi = hourly["aqi"].resample("D").mean()\nmonthly_max = hourly["aqi"].resample("ME").max()\nyearly_mean = df["tmax_c"].resample("YE").mean()'));
  c.push(code('r', 'library(xts)\nlibrary(dplyr)\ndaily <- temp %>%\n  group_by(date = floor_date(date, "day")) %>%\n  summarise(tmax_c = max(tmax_c, na.rm = TRUE))'));
  c.push(callout('tip', 'Pick frequency to match the question.', 'Heat-wave detection needs daily data. Long-term warming trends often use annual means. Do not over-aggregate before you have explored daily structure.'));

  c.push(h2('Aggregation choices'));
  c.push(list([
    '<strong>mean:</strong> typical value over the period — daily mean AQI.',
    '<strong>max:</strong> worst case — daily peak AQI or annual hottest day.',
    '<strong>sum:</strong> totals — monthly rainfall accumulation.',
    '<strong>median:</strong> robust centre for skewed hourly data.'
  ]));
  c.push(code('python', 'daily = hourly["aqi"].resample("D").agg(["mean", "max", "median", "count"])'));

  c.push(h2('Rolling windows and smoothing'));
  c.push(p('Raw series are noisy. A <strong>rolling mean</strong> averages each point with neighbours to reveal underlying movement.'));
  c.push(code('python', 'daily_t = df["tmax_c"]\nroll_7 = daily_t.rolling(window=7, center=True).mean()\nroll_30 = daily_t.rolling(window=30, center=True).mean()\nax = daily_t.plot(alpha=0.3, figsize=(10,4), label="daily")\nroll_30.plot(ax=ax, color="crimson", label="30-day avg")\nax.legend()'));
  c.push(callout('note', 'Window size trade-off.', 'Wider windows are smoother but lag more and hide short events. Narrow windows track closely but stay noisy. Match window to the pattern scale you care about.'));

  c.push(h2('Centered vs trailing windows'));
  c.push(p('center=True uses past and future neighbours — fine for exploration, forbidden for forecasting. For prediction, use trailing windows only.'));
  c.push(code('python', 'trailing = daily_t.rolling(window=7, center=False).mean()  # safe for forecasts'));
  c.push(callout('warn', 'Look-ahead leakage.', 'A centred rolling mean at time t uses future values. Never put centred smoothers into features for forward prediction.'));

  c.push(h2('Shifting and lag features'));
  c.push(p('Yesterday\'s AQI predicts today\'s. Create lags with shift() — positive shift pulls past values forward.'));
  c.push(code('python', 'daily_aqi_lag = daily_aqi.to_frame("aqi")\ndaily_aqi_lag["lag1"] = daily_aqi_lag["aqi"].shift(1)\ndaily_aqi_lag["lag7"] = daily_aqi_lag["aqi"].shift(7)'));

  c.push(h2('Trend vs seasonality vs noise'));
  c.push(p('Most environmental series combine a long-run <strong>trend</strong>, repeating <strong>seasonal</strong> cycle, and <strong>noise</strong>. Decomposition separates them.'));
  c.push(code('python', 'monthly = df["tmax_c"].resample("ME").mean()\nfrom statsmodels.tsa.seasonal import seasonal_decompose\nresult = seasonal_decompose(monthly.dropna(), model="additive", period=12)\nresult.plot()'));
  c.push(p('Additive model: observed = trend + seasonal + residual. Multiplicative when seasonal amplitude grows with level — common for emissions.'));
  c.push(code('python', 'result_mul = seasonal_decompose(monthly.dropna(), model="multiplicative", period=12)'));

  c.push(h2('Detrending and anomalies'));
  c.push(p('A <strong>climatology</strong> is the long-term average for each calendar month or day. <strong>Anomaly</strong> = value minus climatology — removes seasonal cycle so trends stand out.'));
  c.push(code('python', 'monthly_anom = monthly - monthly.groupby(monthly.index.month).transform("mean")\nmonthly_anom.plot(title="Temperature anomaly vs monthly climatology")'));
  c.push(callout('tip', 'Anomalies are the climate staple.', 'Western heat-wave projects use anomalies to ask: how far above normal was this summer?'));

  c.push(h2('Autocorrelation'));
  c.push(p('Today\'s temperature correlates with yesterday\'s — <strong>autocorrelation</strong>. High autocorrelation means points are not independent; regression p-values get over-confident.'));
  c.push(code('python', 'from statsmodels.graphics.tsaplots import plot_acf\nplot_acf(daily_t.dropna(), lags=40)'));
  c.push(p('ACF plot shows correlation at lag 1, 2, 3 days. Slow decay indicates strong persistence — heat spells linger.'));
  c.push(callout('warn', 'Do not shuffle time series.', 'Random train/test splits leak the future into the past. Always split chronologically for forecasting.'));

  c.push(h2('Spurious correlation'));
  c.push(p('Two series both trending upward — CO2 and smartphone sales — correlate strongly while unrelated. Detrend or use anomalies before correlating.'));
  c.push(code('python', 'spurious = daily_aqi.corr(daily_t)  # may reflect shared seasonality\n# better: correlate anomalies or deseasonalised series'));

  c.push(h2('Time zones and daylight saving'));
  c.push(p('Hourly environmental data hits timezone and DST bugs. Store UTC or document local timezone. Pandas tz_localize and tz_convert handle conversions.'));
  c.push(code('python', 'hourly.index = hourly.index.tz_localize("America/Los_Angeles", ambiguous="NaT")'));
  c.push(callout('warn', 'Ambiguous hours.', 'DST fall-back repeats an hour — ambiguous="NaT" flags it instead of guessing wrong.'));

  c.push(h2('Gaps and interpolation'));
  c.push(p('Sensors fail. Small gaps might be interpolated; large gaps should stay missing. Never interpolate across months without thought.'));
  c.push(code('python', 'daily_filled = daily_t.interpolate(method="time", limit=3)  # max 3-day gap'));
  c.push(list([
    '<strong>Forward fill:</strong> carry last value — OK for slow-changing state.',
    '<strong>Linear interpolate:</strong> straight line between points — OK for short gaps.',
    '<strong>Leave NaN:</strong> safest default for analysis.'
  ]));

  c.push(h2('Hourly AQI patterns'));
  c.push(h3('Diurnal cycle'));
  c.push(p('Pollution often peaks morning and evening rush hours. Group by hour-of-day to see the diurnal fingerprint.'));
  c.push(code('python', 'hourly["hour"] = hourly.index.hour\ndiurnal = hourly.groupby("hour")["aqi"].median()\ndiurnal.plot(kind="bar")'));
  c.push(h3('Day-of-week effects'));
  c.push(code('python', 'hourly["dow"] = hourly.index.dayofweek\nhourly.boxplot(column="aqi", by="dow")'));

  c.push(h2('Annual warming trend'));
  c.push(p('Resample daily temperature to annual mean, plot with rolling decade average. Is the West warming beyond year-to-year noise?'));
  c.push(code('python', 'annual = df["tmax_c"].resample("YE").mean()\ndecade = annual.rolling(window=10, center=True).mean()\nax = annual.plot(label="annual mean", alpha=0.6)\ndecade.plot(ax=ax, color="darkred", linewidth=2, label="10-yr rolling")\nax.legend()'));
  c.push(code('r', 'annual <- temp %>%\n  group_by(year) %>%\n  summarise(tmax = mean(tmax_c, na.rm = TRUE))\nggplot(annual, aes(x = year, y = tmax)) + geom_line() + geom_smooth(method = "loess")'));

  c.push(h2('Change-point thinking'));
  c.push(p('Trends need not be linear. A step change after a policy or fire season is a different story than gradual warming. Plot first; do not force one line through everything.'));
  c.push(callout('note', 'Policy and events.', 'A sudden AQI drop might be a new filter rule, not weather. Annotate plots with known events when you can.'));

  c.push(h2('Simple forecasting preview'));
  c.push(p('Chronological split: train on early years, test on recent years. Compare persistence forecast (tomorrow = today) to rolling mean baseline.'));
  c.push(code('python', 'train = daily_t["2010":"2019"]\ntest = daily_t["2020":"2024"]\npersist = test.shift(1)  # naive: yesterday predicts today\nrmse = ((test - persist) ** 2).mean() ** 0.5\nprint("persistence RMSE:", rmse)'));
  c.push(p('Full forecasting is its own field — this lesson equips you to prepare series correctly before reaching for ARIMA or Prophet.'));

  c.push(h2('Merging time series'));
  c.push(p('Join daily AQI with daily weather on the date index. Use inner join to keep overlapping dates only.'));

  c.push(h2('Reporting time-series findings'));
  c.push(steps([
    'State time range, frequency, and timezone.',
    'Plot raw and smoothed series on the same axes.',
    'Separate trend from seasonality when claiming warming or improvement.',
    'Report autocorrelation awareness if using regression.',
    'Split chronologically for any predictive claim.'
  ]));

  c.push(exercise(
    'Find the warming signal',
    'From a multi-decade daily tmax_c series: set datetime index, compute annual means, overlay a 10-year rolling average, decompose monthly data into trend and seasonality. Is there warming beyond the seasonal cycle? Quantify the change in annual mean between first and last decade.',
    'resample("YE").mean() for annual; seasonal_decompose(..., period=12) on monthly.',
    { lang: 'python', code: 'df = pd.read_csv("western_daily_temp.csv", parse_dates=["date"]).set_index("date").sort_index()\nannual = df["tmax_c"].resample("YE").mean()\nannual.rolling(10, center=True).mean().plot()\nmonthly = df["tmax_c"].resample("ME").mean()\nfrom statsmodels.tsa.seasonal import seasonal_decompose\nseasonal_decompose(monthly.dropna(), period=12).plot()\nprint("first decade mean:", annual["1980":"1989"].mean())\nprint("last decade mean:", annual["2015":"2024"].mean())', note: 'Trend panel should rise if warming is present; compare decades for a simple numeric summary.' }
  ));

  c.push(exercise(
    'AQI seasonality and bad-day rate',
    'Using hourly LA AQI: resample to daily max, compute monthly median AQI, count fraction of days with max AQI >= 100 per year, plot both. Which month has worst typical air? Is the bad-day rate increasing?',
    'resample("D").max() then groupby month or year.',
    { lang: 'python', code: 'h = pd.read_csv("la_aqi_hourly.csv", parse_dates=["timestamp"]).set_index("timestamp")\ndaily_max = h["aqi"].resample("D").max()\nmonthly_med = daily_max.resample("ME").median()\nbad = (daily_max >= 100).astype(int)\nby_year = bad.resample("YE").mean()\nmonthly_med.plot(title="Monthly median of daily max AQI")\nby_year.plot(title="Fraction of bad days per year")', note: 'Daily max captures worst-hour exposure; fraction bad days is an actionable public-health summary.' }
  ));

  c.push(exercise(
    'Autocorrelation check in R',
    'In R, load daily temperature, compute ACF for up to 30 lags, fit lm(tmax_c ~ year(doy)) on day-of-year — note inflated significance. Compare to lm on annual means instead.',
    'acf() for autocorrelation; aggregate before regression for trend.',
    { lang: 'r', code: 'library(lubridate)\ntemp <- read_csv("western_daily_temp.csv") %>% mutate(date = ymd(date))\nacf(temp$tmax_c, lag.max = 30)\nm_daily <- lm(tmax_c ~ yday(date), data = temp)\nsummary(m_daily)\nannual <- temp %>% group_by(year = year(date)) %>% summarise(tmax = mean(tmax_c))\nm_annual <- lm(tmax ~ year, data = annual)\nsummary(m_annual)', note: 'Daily regression p-values are optimistic when residuals autocorrelate; annual aggregation reduces dependence.' }
  ));

  c.push(h2('Recap'));
  c.push(list([
    'Parse dates, sort, and set a datetime index first.',
    'resample() changes frequency; rolling() smooths noise — mind center=False for forecasting.',
    'Decompose into trend + seasonality + residual; anomalies remove seasonal cycle.',
    'Respect autocorrelation; avoid leakage and random splits.',
    'Document timezone, gaps, and aggregation choices in every report.'
  ]));

  return {
    title: 'Time-series analysis',
    track: 'stats', tool: 'Both', level: 'advanced', time: '~5-6 hrs',
    lede: 'Climate and environmental data is overwhelmingly time-stamped. Time series have trend, seasonality, and autocorrelation that ordinary methods ignore. This comprehensive lesson covers resampling, smoothing, decomposition, and pitfalls with temperature and AQI examples.',
    learn: [
      'Work with datetime indexes and time slicing',
      'Resample to different frequencies with sensible aggregations',
      'Smooth with rolling windows without look-ahead leakage',
      'Separate trend from seasonality and build anomalies',
      'Recognize autocorrelation and time-series pitfalls'
    ],
    prereqs: [{ id: 'pandas', label: 'pandas' }, { id: 'descriptive-stats', label: 'Descriptive statistics' }],
    resources: [
      { name: 'pandas time series guide', url: 'https://pandas.pydata.org/docs/user_guide/timeseries.html', kind: 'docs' },
      { name: 'Forecasting: Principles & Practice', url: 'https://otexts.com/fpp3/', kind: 'book' },
      { name: 'statsmodels: seasonal decompose', url: 'https://www.statsmodels.org/stable/generated/statsmodels.tsa.seasonal.seasonal_decompose.html', kind: 'docs' }
    ],
    unlock: { label: 'Western heat waves', url: 'projects.html', blurb: 'Decades of daily temperature — resample, smooth, and find the warming trend.' },
    content: c
  };
}

module.exports = { buildTimeSeries };
