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

function buildRegression() {
  const c = [];
  c.push(p('Regression models how one variable depends on others. In environmental work you might ask: does daily temperature predict AQI? Do wind speed and season explain pollution after accounting for temperature? This lesson builds intuition first, then fits models in Python and R with air-quality and emissions examples.'));
  c.push(callout('note', 'Plot before you model.', 'Always scatter your outcome against each predictor. A straight line only makes sense if the cloud looks roughly linear. Curves, thresholds, and clusters need different tools.'));

  c.push(h2('The idea: a line through the cloud'));
  c.push(p('Simple linear regression fits the best straight line through scatter points: <strong>y = intercept + slope * x</strong>. "Best" means minimising the sum of squared vertical distances (ordinary least squares, OLS).'));
  c.push(code('python', 'import matplotlib.pyplot as plt\nplt.scatter(aq["temp_c"], aq["aqi"], alpha=0.4)\nplt.xlabel("Temperature (C)"); plt.ylabel("AQI")'));
  c.push(list([
    '<strong>Outcome (y):</strong> what you are trying to explain — AQI, emissions, stream flow.',
    '<strong>Predictor (x):</strong> what you think helps explain y — temperature, wind, land cover.',
    '<strong>Residual:</strong> actual minus predicted — what the model misses.'
  ]));

  c.push(h2('Loading and preparing data'));
  c.push(p('Merge daily AQI with weather on date. Drop rows with missing values before fitting — OLS ignores NaN but your n should be explicit.'));
  c.push(code('python', 'import pandas as pd\naq = pd.read_csv("la_daily_aqi_weather.csv", parse_dates=["date"])\naq = aq.dropna(subset=["aqi", "temp_c", "wind_ms"])\nprint(len(aq), "complete days")'));
  c.push(code('r', 'library(readr)\naq <- read_csv("la_daily_aqi_weather.csv") %>%\n  filter(!is.na(aqi), !is.na(temp_c), !is.na(wind_ms))'));

  c.push(h2('Fitting simple linear regression'));
  c.push(h3('Python with statsmodels'));
  c.push(p('statsmodels formula API reads like the question. It returns a full statistical summary.'));
  c.push(code('python', 'import statsmodels.formula.api as smf\nmodel = smf.ols("aqi ~ temp_c", data=aq).fit()\nprint(model.summary())'));
  c.push(h3('R with lm()'));
  c.push(code('r', 'model <- lm(aqi ~ temp_c, data = aq)\nsummary(model)'));

  c.push(h2('Reading the output'));
  c.push(table(['Quantity', 'What it tells you'], [
    ['<strong>Slope</strong>', 'Predicted change in y per one-unit increase in x'],
    ['<strong>Intercept</strong>', 'Predicted y when x = 0 (often not meaningful alone)'],
    ['<strong>p-value</strong>', 'Evidence the slope is not just noise (small = stronger)'],
    ['<strong>R-squared</strong>', 'Fraction of variance in y explained (0 to 1)'],
    ['<strong>Std err / CI</strong>', 'Uncertainty around the slope estimate']
  ]));
  c.push(p('Example: "Each +1 degree C is associated with +2.8 AQI points (p &lt; 0.001), and temperature explains 38% of daily AQI variation (R2 = 0.38)." Use <em>associated with</em>, not <em>causes</em>.'));
  c.push(callout('warn', 'R-squared is not everything.', 'High R2 does not mean the model is correct. Low R2 can still describe a real effect — environmental relationships are noisy. Do not chase R2 at the expense of sense.'));

  c.push(h2('Interpreting slope in context'));
  c.push(p('Slope units matter. A slope of 2.8 on AQI per degree C is modest day-to-day but large over a 10-degree heat wave. Translate coefficients into scenarios your audience understands.'));
  c.push(code('python', 'slope = model.params["temp_c"]\nprint("At +5C:", slope * 5, "AQI points")\nprint("At +10C:", slope * 10, "AQI points")'));
  c.push(callout('note', 'Intercept traps.', 'Intercept is predicted AQI at 0C — outside your data range and not meaningful. Focus on slope and confidence interval.'));

  c.push(h2('Confidence intervals'));
  c.push(p('A 95% confidence interval for the slope is the range of values consistent with the data. If it excludes zero, evidence for an association is stronger.'));
  c.push(code('python', 'ci = model.conf_int().loc["temp_c"]\nprint("95% CI:", ci[0], "to", ci[1])'));
  c.push(code('r', 'confint(model, "temp_c", level = 0.95)'));

  c.push(h2('Multiple regression'));
  c.push(p('Add predictors with +. Each slope is the effect of that variable <em>holding others constant</em> — separating tangled influences like temperature and wind.'));
  c.push(code('python', 'model2 = smf.ols("aqi ~ temp_c + wind_ms + C(season)", data=aq).fit()\nprint(model2.summary())'));
  c.push(code('r', 'model2 <- lm(aqi ~ temp_c + wind_ms + season, data = aq)\nsummary(model2)'));
  c.push(callout('note', 'Categorical predictors.', 'Wrap categories in C(...) in Python. R treats factors automatically. Coefficients compare each level to a baseline season.'));

  c.push(h3('When slopes change'));
  c.push(p('Adding a correlated predictor can shrink another slope — the new variable explains part of the original effect (confounding). Temperature and season overlap; adding season may reduce the temperature coefficient.'));
  c.push(list([
    '<strong>Confounding:</strong> a third variable drives both x and y.',
    '<strong>Mediation:</strong> x affects a middle variable that affects y.',
    '<strong>Collinearity:</strong> predictors are nearly redundant — unstable coefficients.'
  ]));

  c.push(h2('Standardised coefficients'));
  c.push(p('Compare predictors on different scales by standardising (z-scoring) first. A larger absolute standardised coefficient suggests a stronger linear association in standard-deviation units.'));
  c.push(code('python', 'aq_std = aq.copy()\nfor col in ["aqi", "temp_c", "wind_ms"]:\n    aq_std[col] = (aq[col] - aq[col].mean()) / aq[col].std()\nm_std = smf.ols("aqi ~ temp_c + wind_ms", data=aq_std).fit()\nprint(m_std.params)'));

  c.push(h2('Model assumptions'));
  c.push(p('OLS assumes linearity, independent errors, constant variance, and normally distributed residuals (for inference). Check with plots, not trust alone.'));
  c.push(steps([
    'Scatter y vs each x — linear pattern?',
    'Plot residuals vs fitted values — random cloud, no curve?',
    'Plot residuals vs each predictor — no funnel shape?',
    'Check influential points — does one day swing the line?'
  ]));

  c.push(h2('Residual diagnostics'));
  c.push(code('python', 'import matplotlib.pyplot as plt\nfig, axes = plt.subplots(1, 2, figsize=(10, 4))\naxes[0].scatter(model.fittedvalues, model.resid, alpha=0.4)\naxes[0].axhline(0, color="red")\naxes[0].set_xlabel("Fitted"); axes[0].set_ylabel("Residual")\naxes[1].scatter(aq["temp_c"], model.resid, alpha=0.4)\naxes[1].axhline(0, color="red")\nplt.tight_layout()'));
  c.push(list([
    '<strong>Linearity:</strong> residuals vs fitted should show no curve.',
    '<strong>Homoscedasticity:</strong> spread should not fan out with fitted values.',
    '<strong>Independence:</strong> time series violate this — see the time-series lesson.',
    '<strong>Outliers:</strong> large residuals warrant investigation.'
  ]));
  c.push(callout('warn', 'Independence and time.', 'Daily AQI rows are not independent — yesterday affects today. Regression p-values may be over-confident. For time-stamped data, consider time-series methods or clustered errors.'));

  c.push(h2('Influential points'));
  c.push(p('One wildfire day can lever the whole line. Compare coefficients with and without high-leverage points.'));
  c.push(code('python', 'aq_no_fire = aq[aq["aqi"] < 200]\nm_clean = smf.ols("aqi ~ temp_c", data=aq_no_fire).fit()\nprint("full slope:", model.params["temp_c"])\nprint("no extreme slope:", m_clean.params["temp_c"])'));

  c.push(h2('Polynomial and log transforms'));
  c.push(h3('Curved relationships'));
  c.push(p('If the scatter curves, add polynomial terms: temp_c + I(temp_c**2) in Python, or poly(temp_c, 2) in R.'));
  c.push(code('python', 'model_poly = smf.ols("aqi ~ temp_c + I(temp_c**2)", data=aq).fit()\nprint(model_poly.rsquared)'));
  c.push(h3('Log transforms for skew'));
  c.push(p('Right-skewed outcomes (emissions, concentration) often model better on log scale. Interpret slope as approximate percent change.'));
  c.push(code('python', 'import numpy as np\naq["log_emit"] = np.log1p(aq["co2_tons"])\nsmf.ols("log_emit ~ capacity_mw", data=facilities).fit().summary()'));

  c.push(h2('Interactions'));
  c.push(p('An interaction lets the slope of one predictor depend on another — e.g. temperature effect on AQI might be stronger in summer.'));
  c.push(code('python', 'smf.ols("aqi ~ temp_c * C(season)", data=aq).fit().summary()'));
  c.push(callout('note', 'Interaction interpretation.', 'With temp_c * season, each season gets its own temperature slope relative to the baseline. Plot separate lines by season to verify.'));

  c.push(h2('Categorical outcomes? Use logistic regression'));
  c.push(p('Binary outcomes — exceedance of AQI 100 yes/no — need logistic regression, not OLS. This lesson focuses on numeric outcomes; the idea of coefficients and p-values carries over.'));
  c.push(code('python', 'import statsmodels.api as sm\naq["bad_day"] = (aq["aqi"] >= 100).astype(int)\nlogit = sm.Logit(aq["bad_day"], sm.add_constant(aq[["temp_c", "wind_ms"]])).fit()\nprint(logit.summary())'));

  c.push(h2('Prediction'));
  c.push(p('Use predict() on new rows with the same columns the model was trained on.'));
  c.push(code('python', 'new = pd.DataFrame({"temp_c": [32, 38], "wind_ms": [2, 1], "season": ["summer", "summer"]})\nmodel2.predict(new)'));
  c.push(callout('warn', 'Do not extrapolate.', 'A model fit on 10-35C says little about 50C. Predicting outside the data range is guesswork. Check new data falls within training ranges.'));

  c.push(h2('Emissions example: facility data'));
  c.push(p('California emitter inventories pair facility capacity with annual CO2. Multiple regression can ask whether capacity predicts emissions after controlling for sector.'));
  c.push(code('python', 'fac = pd.read_csv("ca_emitters.csv")\nm_fac = smf.ols("co2_tons ~ capacity_mw + C(sector)", data=fac).fit()\nprint(m_fac.params.head())'));
  c.push(p('Sector indicators capture baseline differences — a megawatt of power plant is not the same as a megawatt of refining capacity.'));

  c.push(h2('Reporting regression results'));
  c.push(olist([
    'State the question and unit of observation (daily, facility, tract).',
    'Report slope, 95% CI, p-value, and R2 with units.',
    'Mention which predictors were included and why.',
    'Show residual plot or note diagnostics.',
    'Use cautious language — associated with, not causes.'
  ]));

  c.push(h2('What regression cannot do'));
  c.push(list([
    'Prove causation without design or strong assumptions.',
    'Fix bad data or missing important predictors.',
    'Extrapolate beyond observed ranges.',
    'Ignore time dependence in sequential data.',
    'Replace domain knowledge — a significant p-value can still be trivial.'
  ]));

  c.push(exercise(
    'Temperature and AQI',
    'Fit aqi ~ temp_c on daily LA data. Report slope, p-value, and R2 in plain English. Plot scatter with fitted line. Check residuals vs fitted. Add wind_ms as a second predictor — how does the temperature slope change? Why?',
    'Use model.summary() and plot. Confounding: wind may explain part of temperature effect.',
    { lang: 'python', code: 'import statsmodels.formula.api as smf\nm1 = smf.ols("aqi ~ temp_c", data=aq).fit()\nprint(m1.summary())\nplt.scatter(aq["temp_c"], aq["aqi"], alpha=0.3)\nplt.plot(aq["temp_c"], m1.predict(aq), color="red")\nm2 = smf.ols("aqi ~ temp_c + wind_ms", data=aq).fit()\nprint("temp slope alone:", m1.params["temp_c"])\nprint("temp slope + wind:", m2.params["temp_c"])', note: 'If temperature slope shrinks after adding wind, wind explains some co-variation — not necessarily that temperature is unimportant.' }
  ));

  c.push(exercise(
    'Facility emissions model',
    'Using facility data with co2_tons, capacity_mw, and sector: fit log(co2_tons+1) ~ capacity_mw + C(sector). Interpret the capacity coefficient. Plot residuals. Which sector has the highest baseline intercept?',
    'log1p for skew; C(sector) for categories.',
    { lang: 'python', code: 'import numpy as np\nfac["log_co2"] = np.log1p(fac["co2_tons"])\nm = smf.ols("log_co2 ~ capacity_mw + C(sector)", data=fac).fit()\nprint(m.summary())\nplt.scatter(m.fittedvalues, m.resid, alpha=0.4)', note: 'On log scale, slope approximates percent change in emissions per MW — valid for small coefficients.' }
  ));

  c.push(exercise(
    'Seasonal interaction in R',
    'In R, fit aqi ~ temp_c * season. Plot predicted lines by season using expand.grid and predict. Does temperature matter more in summer than winter?',
    'expand.grid builds prediction grid; interaction term changes slope by season.',
    { lang: 'r', code: 'm <- lm(aqi ~ temp_c * season, data = aq)\nsummary(m)\ngrid <- expand.grid(temp_c = seq(15, 40, 1), season = unique(aq$season))\ngrid$pred <- predict(m, newdata = grid)\nlibrary(ggplot2)\nggplot(grid, aes(x = temp_c, y = pred, color = season)) + geom_line()', note: 'Different slopes by season suggest chemistry and mixing differ — not just higher summer temperatures.' }
  ));

  c.push(h2('Recap'));
  c.push(list([
    'Regression fits y = intercept + slope*x by least squares.',
    'Read slope (effect size), p-value (evidence), R2 (variance explained), and CI (uncertainty).',
    'Multiple regression isolates each effect holding others constant.',
    'Check residual plots; watch independence with time series.',
    'Say associated with, not causes; do not extrapolate.'
  ]));

  return {
    title: 'Regression & relationships',
    track: 'stats', tool: 'Both', level: 'intermediate', time: '~5-6 hrs',
    lede: 'Regression is the workhorse of quantitative environmental analysis: model how AQI depends on weather, how emissions scale with capacity, and how predictors combine. This comprehensive lesson builds intuition, diagnostics, and interpretation in Python and R.',
    learn: [
      'Fit and read a simple linear regression',
      'Interpret slope, intercept, confidence intervals, and R-squared',
      'Extend to multiple predictors and categorical variables',
      'Diagnose models with residual plots',
      'Use transforms, interactions, and know what regression cannot claim'
    ],
    prereqs: [{ id: 'descriptive-stats', label: 'Descriptive statistics' }],
    resources: [
      { name: 'StatQuest: linear regression', url: 'https://www.youtube.com/watch?v=nk2CQITm_eo', kind: 'video' },
      { name: 'Introduction to Statistical Learning', url: 'https://www.statlearning.com/', kind: 'book' },
      { name: 'statsmodels OLS guide', url: 'https://www.statsmodels.org/stable/regression.html', kind: 'docs' }
    ],
    unlock: { label: 'Track California\u2019s emitters', url: 'projects.html', blurb: 'Model what predicts a facility\u2019s emissions and quantify the relationships.' },
    content: c
  };
}

module.exports = { buildRegression };
