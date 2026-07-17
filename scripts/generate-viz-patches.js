#!/usr/bin/env node
/**
 * One-shot generator for viz lesson patch files.
 * Run: node scripts/generate-viz-patches.js
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'lesson-patches');

function w(id, obj) {
  const file = path.join(OUT, id + '.js');
  const body = 'module.exports = ' + JSON.stringify(obj, null, 2) + ';\n';
  fs.writeFileSync(file, body);
  console.log('Wrote', file, 'blocks:', obj.content.length);
}

// ---------------------------------------------------------------------------
// matplotlib-seaborn
// ---------------------------------------------------------------------------
const matplotlibSeaborn = {
  title: 'Plotting with matplotlib & seaborn',
  track: 'viz',
  tool: 'Python',
  level: 'beginner',
  time: '~5-6 hrs',
  lede: 'A chart turns a wall of numbers into an insight you can see. matplotlib is Python\u2019s foundational plotting library; seaborn sits on top for beautiful statistical charts in one line. Together they cover almost everything you\u2019ll need for environmental data \u2014 AQI trends, emissions comparisons, climate time series, and burden distributions.',
  learn: [
    'Make line, bar, scatter and histogram charts',
    'Label axes, titles and legends properly',
    'Use seaborn for fast statistical plots',
    'Plot straight from a DataFrame',
    'Style charts for reports and colour-blind readers',
    'Save publication-ready figures'
  ],
  prereqs: [{ id: 'pandas', label: 'pandas' }],
  resources: [
    { name: 'matplotlib quick start', url: 'https://matplotlib.org/stable/users/explain/quick_start.html', kind: 'docs' },
    { name: 'seaborn tutorial', url: 'https://seaborn.pydata.org/tutorial.html', kind: 'docs' },
    { name: 'Python Graph Gallery', url: 'https://python-graph-gallery.com/', kind: 'gallery' }
  ],
  unlock: {
    label: 'Map LA\u2019s air quality',
    url: 'projects.html',
    blurb: 'Chart AQI over time and across stations to see the story in the data.'
  },
  content: []
};

(function buildMatplotlib() {
  const c = matplotlibSeaborn.content;
  const push = (...blocks) => blocks.forEach((b) => c.push(b));

  push(
    { type: 'p', html: 'Import the two libraries by convention. In a Jupyter or Colab notebook, charts appear inline automatically after <code>plt.show()</code> or the last expression.' },
    { type: 'code', lang: 'python', code: 'import matplotlib.pyplot as plt\nimport seaborn as sns\nimport pandas as pd\n\nsns.set_theme(style="whitegrid", palette="colorblind")' },
    { type: 'callout', variant: 'note', title: 'How to read this lesson.', html: 'Each dark code block is runnable. Environmental examples use familiar columns \u2014 <code>aqi</code>, <code>month</code>, <code>station</code>, <code>emissions_mtco2e</code> \u2014 but the plotting patterns work on any tidy table.' },

    { type: 'h2', text: 'Figure and axes: the building blocks' },
    { type: 'p', html: 'Every matplotlib chart starts with a <strong>figure</strong> (the canvas) and one or more <strong>axes</strong> (the plot area). The pattern <code>fig, ax = plt.subplots()</code> gives you both; you draw on <code>ax</code>.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(8, 4))\nax.plot([1, 2, 3], [55, 72, 95], marker="o", color="#2F6B4F")\nax.set_title("Example AQI trend")\nax.set_xlabel("Month")\nax.set_ylabel("AQI")\nplt.tight_layout()\nplt.show()' },
    { type: 'callout', variant: 'note', title: 'Figure vs. axes.', html: 'Confusingly, <code>axes</code> means the plot panel, not the x/y axis lines. One figure can hold several axes via <code>plt.subplots(2, 1)</code> for stacked panels.' },
    { type: 'table', head: ['Object', 'What it is', 'Typical methods'], rows: [
      ['<code>fig</code>', 'Whole image / canvas', '<code>fig.savefig()</code>, <code>fig.suptitle()</code>'],
      ['<code>ax</code>', 'One plot panel', '<code>ax.plot()</code>, <code>ax.set_title()</code>, <code>ax.legend()</code>']
    ]},

    { type: 'h2', text: 'Line charts: trends over time' },
    { type: 'p', html: 'Line charts answer <em>how does this change over time?</em> \u2014 monthly AQI, annual emissions, decadal temperature. Plot x as time (or ordered categories) and y as the measured value.' },
    { type: 'code', lang: 'python', code: 'monthly = df.groupby("month")["aqi"].mean()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(monthly.index, monthly.values, marker="o", linewidth=2, color="#2F6B4F")\nax.axhline(100, color="gray", linestyle="--", linewidth=1, label="Unhealthy threshold")\nax.set_title("LA air quality worsens through summer")\nax.set_xlabel("Month")\nax.set_ylabel("Average AQI")\nax.legend()\nplt.tight_layout()\nplt.show()' },
    { type: 'callout', variant: 'tip', title: 'Reference lines add context.', html: '<code>ax.axhline(100)</code> draws a horizontal line at AQI 100 \u2014 the EPA "Unhealthy for Sensitive Groups" breakpoint. Thresholds turn a trend into a policy story.' },
    { type: 'h3', text: 'Multiple series on one chart' },
    { type: 'p', html: 'Loop over stations or call <code>plot</code> once per group. A legend tells readers which line is which.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(9, 4))\nfor station, grp in df.groupby("station"):\n    m = grp.groupby("month")["aqi"].mean()\n    ax.plot(m.index, m.values, marker="o", label=station)\nax.set_title("Seasonal AQI varies by monitoring station")\nax.set_xlabel("Month")\nax.set_ylabel("Average AQI")\nax.legend(title="Station", bbox_to_anchor=(1.02, 1), loc="upper left")\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'Bar charts: compare categories' },
    { type: 'p', html: 'Bar charts compare discrete groups \u2014 emissions by sector, mean AQI by neighbourhood, facility counts by county. Sort bars by value so the ranking is obvious.' },
    { type: 'code', lang: 'python', code: 'sector = df.groupby("sector")["emissions_mtco2e"].sum().sort_values(ascending=True)\n\nfig, ax = plt.subplots(figsize=(7, 5))\nax.barh(sector.index, sector.values, color="#5B8BB0")\nax.set_xlabel("Total emissions (MtCO2e)")\nax.set_title("Transport dominates California sector emissions")\nplt.tight_layout()\nplt.show()' },
    { type: 'callout', variant: 'warn', title: 'Bar charts must start at zero.', html: 'Truncating the y-axis exaggerates small differences. Line charts can zoom; bar charts should not \u2014 the bar length is the visual argument.' },
    { type: 'h3', text: 'Grouped and stacked bars' },
    { type: 'p', html: 'Use grouped bars to compare sub-categories side by side; stacked bars show part-to-whole (e.g. emissions sources within a sector).' },
    { type: 'code', lang: 'python', code: 'pivot = df.pivot_table(index="year", columns="fuel", values="emissions_mtco2e", aggfunc="sum")\npivot.plot(kind="bar", stacked=True, figsize=(8, 4), colormap="YlOrRd")\nplt.ylabel("Emissions (MtCO2e)")\nplt.title("Fossil emissions by fuel type over time")\nplt.xticks(rotation=0)\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'Scatter plots: relationships between variables' },
    { type: 'p', html: 'Scatter plots reveal correlation \u2014 temperature vs AQI, population vs burden score, wind speed vs particulate matter. Each point is one observation.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(6, 5))\nax.scatter(df["temp_c"], df["pm25"], alpha=0.5, s=30, color="#2F6B4F")\nax.set_xlabel("Temperature (\u00b0C)")\nax.set_ylabel("PM2.5 (\u00b5g/m\u00b3)")\nax.set_title("Warmer days tend toward higher particulate levels")\nplt.tight_layout()\nplt.show()' },
    { type: 'h3', text: 'Colour a third variable' },
    { type: 'p', html: 'Map a third column to colour with the <code>c</code> argument and add a colour bar. Great for showing AQI category or land-use type on a temp\u2013pollution scatter.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(7, 5))\nsc = ax.scatter(df["temp_c"], df["pm25"], c=df["aqi"], cmap="YlOrRd", alpha=0.6, s=40)\nplt.colorbar(sc, ax=ax, label="AQI")\nax.set_xlabel("Temperature (\u00b0C)")\nax.set_ylabel("PM2.5")\nax.set_title("Pollution–temperature relationship coloured by AQI")\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'Histograms and distributions' },
    { type: 'p', html: 'Histograms show how values spread \u2014 the distribution of daily AQI readings, facility emission sizes, or tract-level burden scores.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(7, 4))\nax.hist(df["aqi"], bins=30, color="#5B8BB0", edgecolor="white")\nax.axvline(df["aqi"].median(), color="crimson", linestyle="--", label="Median")\nax.set_xlabel("AQI")\nax.set_ylabel("Number of days")\nax.set_title("Most LA days fall in the Moderate AQI range")\nax.legend()\nplt.tight_layout()\nplt.show()' },
    { type: 'h3', text: 'Overlaid distributions by group' },
    { type: 'p', html: 'Compare distributions across categories with side-by-side histograms or KDE curves. seaborn makes this one line.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(8, 4))\nsns.histplot(data=df, x="burden_score", hue="region", kde=True, ax=ax, alpha=0.5)\nax.set_title("Pollution burden score distribution by region")\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'seaborn: statistical plots from DataFrames' },
    { type: 'p', html: 'seaborn understands tidy DataFrames. Pass <code>data=df</code> plus column names for <code>x</code>, <code>y</code>, and <code>hue</code>; it handles legends, palettes, and sensible defaults.' },
    { type: 'code', lang: 'python', code: 'sns.lineplot(data=df, x="month", y="aqi", hue="station", marker="o")\nplt.title("Monthly AQI by station")\nplt.show()' },
    { type: 'table', head: ['Function', 'Shows', 'Environmental example'], rows: [
      ['<code>sns.lineplot</code>', 'Trend over x', 'AQI by month'],
      ['<code>sns.barplot</code>', 'Mean per category', 'Mean PM2.5 by land use'],
      ['<code>sns.boxplot</code>', 'Spread by group', 'AQI distribution per station'],
      ['<code>sns.scatterplot</code>', 'Two numeric vars', 'Temp vs ozone'],
      ['<code>sns.heatmap</code>', 'Matrix of values', 'Correlation of pollutants']
    ]},
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(7, 4))\nsns.boxplot(data=df, x="station", y="aqi", ax=ax, palette="colorblind")\nax.set_title("AQI spread differs across monitoring stations")\nplt.xticks(rotation=45, ha="right")\nplt.tight_layout()\nplt.show()' },
    { type: 'callout', variant: 'tip', title: 'Fast exploration.', html: '<code>sns.pairplot(df[["temp_c","pm25","aqi","wind_kmh"]])</code> grids every variable against every other \u2014 noisy with many columns, brilliant for four or five.' },

    { type: 'h2', text: 'Colour, style and accessibility' },
    { type: 'list', items: [
      '<strong>Use colour with intent</strong> \u2014 one highlight colour on grey context beats a rainbow.',
      '<strong>Colour-blind safe palettes</strong> \u2014 <code>sns.set_palette("colorblind")</code> or matplotlib\u2019s <code>tab10</code>.',
      '<strong>Sequential scales</strong> (YlOrRd) for low-to-high values like AQI or burden.',
      '<strong>Diverging scales</strong> (RdBu) for anomalies above/below a baseline.',
      '<strong>Avoid jet / rainbow</strong> \u2014 it invents false boundaries and fails accessibility tests.'
    ]},
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(8, 4))\nfor i, (name, grp) in enumerate(df.groupby("station")):\n    ax.plot(grp["month"], grp["aqi"], label=name, color=plt.cm.tab10(i))\nax.set_title("Stations coloured with tab10 (colour-blind friendly)")\nax.legend()\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'Labels, legends and annotations' },
    { type: 'p', html: 'An unlabelled chart cannot be trusted. Title the finding, not just the axes. Annotate spikes \u2014 wildfire smoke, heat waves, policy changes.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(9, 4))\nax.plot(df["date"], df["aqi"], color="#2F6B4F")\nax.annotate("Wildfire smoke event", xy=(df["date"].iloc[180], df["aqi"].iloc[180]),\n            xytext=(df["date"].iloc[150], df["aqi"].iloc[180] + 30),\n            arrowprops=dict(arrowstyle="->", color="gray"))\nax.set_title("September spike driven by regional wildfire smoke")\nax.set_xlabel("Date")\nax.set_ylabel("Daily AQI")\nplt.tight_layout()\nplt.show()' },
    { type: 'olist', items: [
      '<code>ax.set_title()</code> \u2014 state the finding.',
      '<code>ax.set_xlabel()</code> / <code>ax.set_ylabel()</code> \u2014 include units.',
      '<code>ax.legend()</code> \u2014 identify coloured series.',
      '<code>ax.annotate()</code> \u2014 point at the event that matters.'
    ]},

    { type: 'h2', text: 'Multiple panels with subplots' },
    { type: 'p', html: 'Compare pollutants or regions side by side with <code>plt.subplots(nrows, ncols)</code>. Share an axis when scales match.' },
    { type: 'code', lang: 'python', code: 'fig, axes = plt.subplots(1, 2, figsize=(10, 4), sharey=True)\nfor ax, col, title in zip(axes, ["pm25", "ozone"], ["PM2.5", "Ozone"]):\n    ax.plot(df["month"], df.groupby("month")[col].mean(), marker="o", color="#2F6B4F")\n    ax.set_title(title)\n    ax.set_xlabel("Month")\naxes[0].set_ylabel("Concentration")\nfig.suptitle("Summer peaks in both PM2.5 and ozone")\nplt.tight_layout()\nplt.show()' },
    { type: 'callout', variant: 'note', title: 'When to facet instead.', html: 'If you have many groups, seaborn\u2019s <code>relplot(..., col="station")</code> or <code>FacetGrid</code> auto-layouts small multiples \u2014 less boilerplate than manual subplots.' },

    { type: 'h2', text: 'Plot straight from pandas' },
    { type: 'p', html: 'For quick exploration, DataFrames expose <code>.plot()</code> which wraps matplotlib. Fine for notebooks; switch to explicit <code>ax</code> methods when you need fine control.' },
    { type: 'code', lang: 'python', code: 'df.groupby("year")["emissions_mtco2e"].sum().plot(kind="bar", color="#5B8BB0", figsize=(7, 4))\nplt.ylabel("MtCO2e")\nplt.title("Annual reported emissions trend")\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'Date axes and formatting' },
    { type: 'p', html: 'Environmental time series need readable date ticks. Parse dates first, then use matplotlib\u2019s date locator and formatter.' },
    { type: 'code', lang: 'python', code: 'import matplotlib.dates as mdates\n\ndf["date"] = pd.to_datetime(df["date"])\nfig, ax = plt.subplots(figsize=(10, 4))\nax.plot(df["date"], df["co2_ppm"], color="#2F6B4F")\nax.xaxis.set_major_locator(mdates.YearLocator(5))\nax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))\nax.set_title("Mauna Loa CO2 trend")\nax.set_ylabel("CO2 (ppm)")\nplt.tight_layout()\nplt.show()' },

    { type: 'h2', text: 'Saving figures for reports' },
    { type: 'p', html: 'Save vector PDF for print, PNG for slides and web. Always use <code>bbox_inches="tight"</code> so labels are not clipped.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(8, 4))\nax.plot(monthly.index, monthly.values, marker="o", color="#2F6B4F")\nax.set_title("Air quality worsens through summer")\nfig.savefig("aqi_by_month.png", dpi=150, bbox_inches="tight")\nfig.savefig("aqi_by_month.pdf", bbox_inches="tight")\nplt.show()' },
    { type: 'list', items: [
      '<code>dpi=150</code> or higher for crisp PNG slides.',
      '<code>bbox_inches="tight"</code> trims whitespace.',
      'Save <em>before</em> <code>plt.show()</code> in scripts; order matters less in notebooks.',
      'Name files descriptively: <code>la_aqi_summer_2024.png</code>.'
    ]},

    { type: 'h2', text: 'Common mistakes and fixes' },
    { type: 'table', head: ['Symptom', 'Likely cause', 'Fix'], rows: [
      ['Empty plot', 'Wrong column names or all NaN', 'Print <code>df.head()</code> and check dtypes'],
      ['Overlapping x labels', 'Too many categories', '<code>plt.xticks(rotation=45, ha="right")</code>'],
      ['Legend covers data', 'Default position', '<code>bbox_to_anchor</code> outside the plot'],
      ['Different scales compared', 'Dual y-axis temptation', 'Two panels with <code>sharex=True</code>'],
      ['Tiny bars look huge', 'Y-axis not at zero', 'Reset ylim to include 0']
    ]},

    { type: 'exercise', title: 'Tell the summer AQI story',
      html: 'Using a dataset with <code>month</code> and <code>aqi</code>, compute the monthly average and make a clearly titled line chart that shows when air quality is worst. Add axis labels, a reference line at AQI 100, and save it as a PNG.',
      hint: '<code>df.groupby("month")["aqi"].mean()</code> gives the y-values; use <code>ax.axhline(100)</code> for the threshold.',
      solution: { lang: 'python', code: 'monthly = df.groupby("month")["aqi"].mean()\n\nfig, ax = plt.subplots(figsize=(8, 4))\nax.plot(monthly.index, monthly.values, marker="o", color="#2F6B4F", linewidth=2)\nax.axhline(100, color="gray", linestyle="--", label="Unhealthy threshold")\nax.set_title("Air quality worsens through the summer")\nax.set_xlabel("Month")\nax.set_ylabel("Average AQI")\nax.legend()\nfig.savefig("aqi_by_month.png", dpi=150, bbox_inches="tight")\nplt.show()' } },

    { type: 'exercise', title: 'Compare sector emissions',
      html: 'From a table with <code>sector</code> and <code>emissions_mtco2e</code>, create a horizontal bar chart sorted by total emissions. Title it with the finding (which sector dominates), label the x-axis with units, and ensure bars start at zero.',
      hint: 'Group with <code>.groupby("sector")["emissions_mtco2e"].sum().sort_values()</code>, then <code>ax.barh()</code>.',
      solution: { lang: 'python', code: 'sector = df.groupby("sector")["emissions_mtco2e"].sum().sort_values()\n\nfig, ax = plt.subplots(figsize=(7, 5))\nax.barh(sector.index, sector.values, color="#5B8BB0")\nax.set_xlabel("Total emissions (MtCO2e)")\nax.set_title("Transport accounts for the largest share of emissions")\nplt.tight_layout()\nplt.show()' } },

    { type: 'exercise', title: 'Explore pollutant correlations',
      html: 'Select numeric pollution and weather columns (<code>pm25</code>, <code>ozone</code>, <code>temp_c</code>, <code>wind_kmh</code>, <code>aqi</code>). Plot a seaborn heatmap of their correlation matrix with annotations. Write one sentence about the strongest relationship you see.',
      hint: '<code>df[["pm25","ozone","temp_c","wind_kmh","aqi"]].corr()</code> then <code>sns.heatmap(..., annot=True, cmap="RdBu_r", center=0)</code>.',
      solution: { lang: 'python', code: 'cols = ["pm25", "ozone", "temp_c", "wind_kmh", "aqi"]\ncorr = df[cols].corr()\n\nfig, ax = plt.subplots(figsize=(6, 5))\nsns.heatmap(corr, annot=True, cmap="RdBu_r", center=0, ax=ax)\nax.set_title("Pollutant and weather correlations")\nplt.tight_layout()\nplt.show()\n# Example finding: PM2.5 and AQI are strongly positively correlated.' } },

    { type: 'h2', text: 'Recap' },
    { type: 'list', items: [
      'Build plots on an <code>ax</code> from <code>fig, ax = plt.subplots()</code>.',
      'Match chart to question: line for trends, bar to compare, scatter for relationships, hist for distributions.',
      'seaborn plots DataFrames in one line with <code>x</code>, <code>y</code>, <code>hue</code>.',
      'Title the finding, label with units, use accessible colours, and save with <code>fig.savefig()</code>.'
    ]}
  );
})();

// ---------------------------------------------------------------------------
// ggplot2
// ---------------------------------------------------------------------------
const ggplot2 = {
  title: 'Visualization with ggplot2',
  track: 'viz',
  tool: 'R',
  level: 'beginner',
  time: '~5-6 hrs',
  lede: 'ggplot2 is one of the best-designed plotting tools anywhere. It is built on a grammar of graphics: you describe a chart as data + mappings + layers, and ggplot composes it. Learn the grammar and you can build any environmental chart \u2014 burden maps as choropleths, emissions bars, climate trend lines.',
  learn: [
    'Understand the grammar of graphics',
    'Map data to aesthetics (x, y, colour)',
    'Add geoms: points, lines, bars, boxes',
    'Facet into small multiples',
    'Control scales and colour palettes',
    'Polish with labels and themes'
  ],
  prereqs: [{ id: 'tidyverse', label: 'tidyverse' }],
  resources: [
    { name: 'R for Data Science: viz', url: 'https://r4ds.hadley.nz/data-visualize', kind: 'book' },
    { name: 'ggplot2 cheat sheet', url: 'https://rstudio.github.io/cheatsheets/data-visualization.pdf', kind: 'pdf' },
    { name: 'R Graph Gallery', url: 'https://r-graph-gallery.com/', kind: 'gallery' }
  ],
  unlock: {
    label: 'Who carries the pollution burden?',
    url: 'projects.html',
    blurb: 'Visualise CalEnviroScreen burden scores across communities with ggplot2.'
  },
  content: []
};

(function buildGgplot2() {
  const c = ggplot2.content;
  const push = (...blocks) => blocks.forEach((b) => c.push(b));

  push(
    { type: 'p', html: 'ggplot2 ships with the tidyverse. Load it once per session. Every chart follows the same recipe: <code>ggplot(data) + aes(mappings) + geom_*()</code>, with extra <code>+</code> layers for labels, scales, and themes.' },
    { type: 'code', lang: 'r', code: 'library(tidyverse)\n\naq <- read_csv("la_air_quality.csv")\nglimpse(aq)' },
    { type: 'callout', variant: 'note', title: 'The + adds layers.', html: 'Each <code>+</code> stacks another layer. Put <code>+</code> at the end of the line so you can break code across rows. Build simple first, then add polish.' },

    { type: 'h2', text: 'The three core pieces' },
    { type: 'olist', items: [
      '<strong>Data</strong> \u2014 the data frame you are plotting.',
      '<strong>Aesthetics</strong> (<code>aes</code>) \u2014 which columns map to x, y, colour, size, shape.',
      '<strong>Geoms</strong> \u2014 the geometric shape: points, lines, bars.'
    ]},
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = month, y = aqi)) +\n  geom_point(color = "#2F6B4F")' },

    { type: 'h2', text: 'Mapping vs. setting' },
    { type: 'p', html: 'Inside <code>aes()</code> you <em>map</em> a column to a property (colour varies by data and produces a legend). Outside <code>aes()</code> you <em>set</em> a fixed value (everything one colour).' },
    { type: 'code', lang: 'r', code: '# colour VARIES by station (mapping -> inside aes)\nggplot(aq, aes(x = month, y = aqi, color = station)) +\n  geom_line()\n\n# colour is FIXED (setting -> outside aes)\nggplot(aq, aes(x = month, y = aqi)) +\n  geom_line(color = "steelblue")' },
    { type: 'callout', variant: 'warn', title: 'Common beginner bug.', html: 'Putting <code>color = station</code> outside <code>aes()</code> tries to use a literal colour name "station" and fails. Column names belong inside <code>aes()</code>.' },

    { type: 'h2', text: 'Line charts: climate and AQI trends' },
    { type: 'p', html: '<code>geom_line()</code> connects observations in row order. Sort by time first if your data are not already ordered.' },
    { type: 'code', lang: 'r', code: 'aq |>\n  group_by(month) |>\n  summarise(mean_aqi = mean(aqi)) |>\n  ggplot(aes(x = month, y = mean_aqi)) +\n  geom_line(linewidth = 1, color = "#2F6B4F") +\n  geom_point(size = 2, color = "#2F6B4F") +\n  labs(title = "LA air quality worsens in summer",\n       x = "Month", y = "Average AQI")' },
    { type: 'h3', text: 'Multiple series with colour' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = month, y = aqi, color = station)) +\n  geom_line(linewidth = 0.9) +\n  labs(title = "Seasonal AQI by monitoring station",\n       color = "Station")' },

    { type: 'h2', text: 'Bar charts: emissions and categories' },
    { type: 'p', html: '<code>geom_col()</code> draws bars from values you supply. <code>geom_bar()</code> counts rows \u2014 use it for frequency charts.' },
    { type: 'code', lang: 'r', code: 'emissions |>\n  group_by(sector) |>\n  summarise(total = sum(emissions_mtco2e)) |>\n  arrange(total) |>\n  ggplot(aes(x = total, y = reorder(sector, total))) +\n  geom_col(fill = "#5B8BB0") +\n  labs(title = "Transport leads sector emissions",\n       x = "MtCO2e", y = NULL)' },
    { type: 'callout', variant: 'tip', title: 'reorder() sorts bars.', html: '<code>reorder(sector, total)</code> arranges bars by value automatically \u2014 essential for readable category charts.' },

    { type: 'h2', text: 'Scatter plots and relationships' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = temp_c, y = pm25)) +\n  geom_point(alpha = 0.4, color = "#2F6B4F") +\n  geom_smooth(method = "lm", se = TRUE, color = "crimson") +\n  labs(title = "Higher temperatures associate with more PM2.5",\n       x = "Temperature (\u00b0C)", y = "PM2.5 (\u00b5g/m\u00b3)")' },
    { type: 'p', html: '<code>geom_smooth()</code> adds a trend line with a confidence ribbon \u2014 useful for exploring correlation, not proof of causation.' },

    { type: 'h2', text: 'Distributions with histograms and density' },
    { type: 'code', lang: 'r', code: 'ggplot(burden, aes(x = burden_score)) +\n  geom_histogram(bins = 30, fill = "#5B8BB0", color = "white") +\n  geom_vline(aes(xintercept = median(burden_score)),\n             linetype = "dashed", color = "crimson") +\n  labs(title = "Distribution of CalEnviroScreen burden scores",\n       x = "Burden score", y = "Number of tracts")' },
    { type: 'code', lang: 'r', code: 'ggplot(burden, aes(x = burden_score, fill = region)) +\n  geom_density(alpha = 0.4) +\n  labs(title = "Burden score density by region", fill = "Region")' },

    { type: 'h2', text: 'Box plots and violin plots' },
    { type: 'p', html: 'Compare distributions across groups \u2014 AQI by station, emissions by facility type.' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = station, y = aqi, fill = station)) +\n  geom_boxplot(show.legend = FALSE) +\n  labs(title = "AQI variability differs by station", y = "AQI") +\n  theme(axis.text.x = element_text(angle = 45, hjust = 1))' },
    { type: 'table', head: ['Geom', 'Chart type'], rows: [
      ['<code>geom_point()</code>', 'Scatter'],
      ['<code>geom_line()</code>', 'Line / trend'],
      ['<code>geom_col()</code>', 'Bar from values'],
      ['<code>geom_bar()</code>', 'Bar from counts'],
      ['<code>geom_boxplot()</code>', 'Distribution by group'],
      ['<code>geom_smooth()</code>', 'Trend with uncertainty']
    ]},

    { type: 'h2', text: 'Faceting: small multiples' },
    { type: 'p', html: '<code>facet_wrap()</code> splits one chart into panels by a categorical variable \u2014 one mini-chart per station or year.' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = month, y = aqi, color = category)) +\n  geom_line() +\n  facet_wrap(~ station, scales = "free_y") +\n  labs(title = "AQI seasonality by station and category")' },
    { type: 'callout', variant: 'note', title: 'scales = "free_y".', html: 'When stations have very different AQI ranges, free y-scales per panel make patterns visible. Use fixed scales when you want direct magnitude comparison.' },

    { type: 'h2', text: 'Scales and colour palettes' },
    { type: 'p', html: 'Environmental data needs honest colour. Use sequential palettes for increasing intensity (burden, AQI), diverging for anomalies.' },
    { type: 'code', lang: 'r', code: 'ggplot(tracts, aes(x = burden_score, y = pop_density)) +\n  geom_point(aes(color = burden_score), alpha = 0.6) +\n  scale_color_viridis_c(option = "magma") +\n  labs(title = "Higher burden tracts cluster at higher density",\n       color = "Burden")' },
    { type: 'list', items: [
      '<code>scale_color_viridis_c()</code> \u2014 colour-blind safe continuous scale.',
      '<code>scale_fill_brewer(palette = "YlOrRd")</code> \u2014 sequential ColorBrewer.',
      '<code>scale_color_manual()</code> \u2014 your own category colours.',
      '<code>scale_x_continuous(limits = c(0, NA))</code> \u2014 bar charts from zero.'
    ]},

    { type: 'h2', text: 'Labels and themes' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = month, y = aqi, color = station)) +\n  geom_line(linewidth = 1) +\n  labs(\n    title = "Air quality worsens in summer",\n    subtitle = "Monthly average AQI by station, 2024",\n    caption = "Source: South Coast AQMD monitoring network",\n    x = "Month", y = "Average AQI", color = "Station"\n  ) +\n  theme_minimal()' },
    { type: 'h3', text: 'Themes change everything' },
    { type: 'p', html: 'Swap <code>theme_minimal()</code>, <code>theme_bw()</code>, or <code>theme_classic()</code> to restyle instantly. Set a global default with <code>theme_set(theme_minimal())</code>.' },
    { type: 'code', lang: 'r', code: 'theme_set(theme_minimal(base_size = 12))' },

    { type: 'h2', text: 'Saving plots' },
    { type: 'code', lang: 'r', code: 'p <- ggplot(aq, aes(month, aqi)) + geom_line()\nggsave("aqi_trend.png", p, width = 8, height = 4, dpi = 150)\nggsave("aqi_trend.pdf", p, width = 8, height = 4)' },
    { type: 'list', items: [
      'Assign the plot to <code>p</code> before saving.',
      '<code>width</code> and <code>height</code> are in inches.',
      '<code>dpi = 150</code> for crisp PNG output.'
    ]},

    { type: 'h2', text: 'Working with dates' },
    { type: 'code', lang: 'r', code: 'climate |>\n  mutate(date = as.Date(date)) |>\n  ggplot(aes(x = date, y = temp_anomaly_c)) +\n  geom_line(color = "#2F6B4F") +\n  geom_hline(yintercept = 0, linetype = "dashed", color = "gray50") +\n  labs(title = "Regional temperature anomaly trend",\n       x = NULL, y = "Anomaly (\u00b0C)")' },

    { type: 'h2', text: 'Layering geoms' },
    { type: 'p', html: 'Stack multiple geoms on one chart \u2014 points plus trend line, bars plus text labels.' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = temp_c, y = aqi)) +\n  geom_point(alpha = 0.3, color = "#2F6B4F") +\n  geom_smooth(method = "loess", color = "crimson", se = FALSE) +\n  labs(title = "AQI rises with temperature (nonlinear fit)")' },

    { type: 'h2', text: 'Coordinate transforms' },
    { type: 'p', html: 'Flip axes with <code>coord_flip()</code> for long bar labels. Use <code>coord_fixed()</code> when x and y share the same units (rare outside maps).' },
    { type: 'code', lang: 'r', code: 'emissions |>\n  count(sector, sort = TRUE) |>\n  ggplot(aes(x = n, y = reorder(sector, n))) +\n  geom_col(fill = "#5B8BB0") +\n  coord_flip() +\n  labs(title = "Facility count by sector", x = "Count", y = NULL)' },

    { type: 'h2', text: 'Common mistakes' },
    { type: 'table', head: ['Problem', 'Cause', 'Fix'], rows: [
      ['Legends say "aqi" oddly', 'Continuous mapped to color', 'Use <code>scale_color_viridis_c()</code> or bin'],
      ['Lines zigzag', 'Data not sorted by x', '<code>arrange(month)</code> before plotting'],
      ['Bars float above zero', 'Wrong stat or transform', 'Use <code>geom_col()</code> with raw values'],
      ['Facet panels empty', 'Factor levels with no data', '<code>drop = TRUE</code> in facet or filter first'],
      ['Saved plot missing labels', 'Cropped margins', 'Increase <code>ggsave</code> width/height']
    ]},

    { type: 'exercise', title: 'Faceted AQI trends',
      html: 'Build a ggplot that shows AQI over <code>month</code> as a line, coloured by <code>category</code>, faceted by <code>station</code>, with a proper title, axis labels, and <code>theme_minimal()</code>.',
      hint: 'Start from <code>ggplot(aq, aes(month, aqi, color = category))</code>, then add <code>geom_line()</code>, <code>facet_wrap(~ station)</code>, <code>labs(...)</code>.',
      solution: { lang: 'r', code: 'ggplot(aq, aes(x = month, y = aqi, color = category)) +\n  geom_line(linewidth = 1) +\n  facet_wrap(~ station) +\n  labs(title = "AQI through the year by station",\n       x = "Month", y = "AQI", color = "Category") +\n  theme_minimal()' } },

    { type: 'exercise', title: 'Burden score bar chart',
      html: 'Using a table with <code>neighborhood</code> and <code>burden_score</code>, plot the top 10 neighborhoods by burden as a horizontal bar chart. Use <code>reorder()</code>, title the finding, and label axes.',
      hint: '<code>slice_max(burden_score, n = 10)</code> then <code>ggplot(aes(x = burden_score, y = reorder(neighborhood, burden_score))) + geom_col()</code>.',
      solution: { lang: 'r', code: 'top10 <- burden |>\n  slice_max(burden_score, n = 10)\n\nggplot(top10, aes(x = burden_score, y = reorder(neighborhood, burden_score))) +\n  geom_col(fill = "#C44E52") +\n  labs(title = "These ten neighborhoods face the highest pollution burden",\n       x = "CalEnviroScreen burden score", y = NULL) +\n  theme_minimal()' } },

    { type: 'exercise', title: 'Emissions trend with annotation',
      html: 'Plot annual total emissions as a line chart. Add a vertical line or annotate the year with the largest drop. Write a subtitle explaining what might have caused it.',
      hint: 'Summarise with <code>group_by(year) |> summarise(total = sum(emissions_mtco2e))</code>. Use <code>geom_vline</code> or <code>annotate("text", ...)</code>.',
      solution: { lang: 'r', code: 'annual <- emissions |>\n  group_by(year) |>\n  summarise(total = sum(emissions_mtco2e))\n\nggplot(annual, aes(x = year, y = total)) +\n  geom_line(linewidth = 1, color = "#2F6B4F") +\n  geom_point(size = 2, color = "#2F6B4F") +\n  labs(\n    title = "California emissions declined over the decade",\n    subtitle = "Sharp drop in 2020 reflects pandemic travel reduction",\n    x = "Year", y = "Total emissions (MtCO2e)"\n  ) +\n  theme_minimal()' } },

    { type: 'h2', text: 'Recap' },
    { type: 'list', items: [
      'Charts = <code>ggplot(data) + aes(...) + geom_*()</code>, layered with <code>+</code>.',
      'Map inside <code>aes()</code> (varies by data); set outside (fixed value).',
      'Pick a geom per chart type; add <code>geom_smooth()</code> for trends.',
      '<code>facet_wrap()</code> makes small multiples; <code>labs()</code> + themes polish output.'
    ]}
  );
})();

// ---------------------------------------------------------------------------
// maps
// ---------------------------------------------------------------------------
const maps = {
  title: 'Making maps',
  track: 'viz',
  tool: 'Both',
  level: 'intermediate',
  time: '~5-6 hrs',
  lede: 'Environmental data is almost always tied to place. A good map answers "where?" instantly \u2014 where the heat is worst, which communities bear the pollution, where emitters cluster. This lesson gets you from coordinates to clear thematic maps in Python and R.',
  learn: [
    'Plot points from latitude and longitude',
    'Understand the choropleth (shaded-area) map',
    'Join tabular data to geographic boundaries',
    'Choose colour scales that do not mislead',
    'Build interactive maps with Folium',
    'Make static maps with ggplot2 and sf'
  ],
  prereqs: [{ id: 'pandas', label: 'pandas' }, { id: 'matplotlib-seaborn', label: 'matplotlib' }],
  resources: [
    { name: 'GeoPandas: mapping', url: 'https://geopandas.org/en/stable/docs/user_guide/mapping.html', kind: 'docs' },
    { name: 'Folium (interactive maps)', url: 'https://python-visualization.github.io/folium/', kind: 'docs' },
    { name: 'ColorBrewer palettes', url: 'https://colorbrewer2.org/', kind: 'tool' }
  ],
  unlock: {
    label: 'Map LA\u2019s air quality',
    url: 'projects.html',
    blurb: 'Plot monitoring stations and shade neighbourhoods by pollution \u2014 a map-first project.'
  },
  content: []
};

(function buildMaps() {
  const c = maps.content;
  const push = (...blocks) => blocks.forEach((b) => c.push(b));

  push(
    { type: 'p', html: 'There are two maps you will make most often: <strong>point maps</strong> (a dot per location) and <strong>choropleths</strong> (areas shaded by a value). Python uses GeoPandas and Folium; R uses the <code>sf</code> package with ggplot2. The geospatial deep-dive is in the <a class="inline" href="lesson.html?id=geospatial">geospatial lesson</a>.' },
    { type: 'callout', variant: 'note', title: 'Maps are joins plus geometry.', html: 'Every thematic map combines a spatial layer (points or polygons) with a data column to colour or size by. If the map looks wrong, check the join key before tweaking colours.' },

    { type: 'h2', text: 'Coordinates: latitude and longitude' },
    { type: 'p', html: 'Latitude measures north\u2013south (equator = 0). Longitude measures east\u2013west (Greenwich = 0). In plotting, <strong>longitude is x</strong> and <strong>latitude is y</strong>.' },
    { type: 'table', head: ['Column', 'Axis', 'LA example'], rows: [
      ['<code>lon</code> / <code>longitude</code>', 'x (horizontal)', '-118.24'],
      ['<code>lat</code> / <code>latitude</code>', 'y (vertical)', '34.05']
    ]},
    { type: 'callout', variant: 'warn', title: 'Lon is x, lat is y.', html: 'Swapping them is the classic mapping bug \u2014 your data ends up in the wrong ocean.' },

    { type: 'h2', text: 'Quick point map with matplotlib' },
    { type: 'p', html: 'If you have lat/lon columns, a scatter plot is already a map. Colour points by AQI or emissions for instant spatial context.' },
    { type: 'code', lang: 'python', code: 'import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(7, 7))\nsc = ax.scatter(stations["lon"], stations["lat"],\n                c=stations["aqi"], cmap="YlOrRd", s=60, edgecolors="white", linewidth=0.5)\nplt.colorbar(sc, ax=ax, label="AQI")\nax.set_xlabel("Longitude")\nax.set_ylabel("Latitude")\nax.set_title("Air-quality stations coloured by AQI")\nax.set_aspect("equal")\nplt.tight_layout()\nplt.show()' },
    { type: 'h3', text: 'Size points by a third variable' },
    { type: 'code', lang: 'python', code: 'sizes = stations["emissions_mtco2e"] / stations["emissions_mtco2e"].max() * 200\nax.scatter(stations["lon"], stations["lat"], s=sizes, c=stations["aqi"],\n           cmap="YlOrRd", alpha=0.7)\nax.set_title("Station AQI (colour) and facility size (area)")' },

    { type: 'h2', text: 'GeoPandas: spatial data frames' },
    { type: 'p', html: 'A <strong>GeoDataFrame</strong> is a pandas DataFrame plus a <code>geometry</code> column (points, lines, or polygons). Read shapefiles and GeoJSON directly.' },
    { type: 'code', lang: 'python', code: 'import geopandas as gpd\n\ntracts = gpd.read_file("la_tracts.geojson")\nprint(tracts.crs)       # coordinate reference system\nprint(tracts.head())\ntracts.plot(figsize=(6, 6), edgecolor="gray", facecolor="none")' },
    { type: 'callout', variant: 'note', title: 'CRS matters.', html: 'Every spatial layer has a CRS (coordinate system). Layers in different CRS must be reprojected before joining or measuring distance. The geospatial lesson covers this in depth.' },

    { type: 'h2', text: 'Choropleths: shading areas' },
    { type: 'p', html: 'A choropleth shades regions \u2014 census tracts, counties, zip codes \u2014 by a value like burden score or asthma rate. You need boundary geometry plus a data value per region, joined on a shared ID.' },
    { type: 'steps', items: [
      { title: 'Load boundaries', text: 'Read a GeoJSON or shapefile with one row per region and a geometry column.' },
      { title: 'Prepare tabular data', text: 'Ensure your burden or AQI table has the same ID format as the boundaries.' },
      { title: 'Join', text: 'Merge on the shared key (e.g. tract_id, GEOID, FIPS).' },
      { title: 'Plot', text: 'Call .plot(column="burden_score", cmap="YlOrRd", legend=True).' }
    ]},
    { type: 'code', lang: 'python', code: 'merged = tracts.merge(burden_df, on="tract_id", how="left")\n\nfig, ax = plt.subplots(figsize=(8, 8))\nmerged.plot(column="burden_score", cmap="YlOrRd", legend=True,\n            ax=ax, edgecolor="white", linewidth=0.3)\nax.set_axis_off()\nax.set_title("Pollution burden by census tract, Los Angeles")\nplt.tight_layout()\nplt.show()' },
    { type: 'callout', variant: 'warn', title: 'The join is everything.', html: 'If the map is blank or patchy, IDs did not match. A common gotcha: <code>6037</code> (integer) vs <code>"06037"</code> (zero-padded string). Standardise before merging.' },

    { type: 'h2', text: 'Colour scales that tell the truth' },
    { type: 'list', items: [
      '<strong>Sequential</strong> (YlOrRd, Blues) for low-to-high values like AQI or burden.',
      '<strong>Diverging</strong> (RdBu, BrBG) for values above/below a meaningful midpoint like temperature anomaly.',
      '<strong>Qualitative</strong> (Set2, tab10) for categories \u2014 land use type, facility class.',
      '<strong>Avoid rainbow / jet</strong> \u2014 it invents boundaries not in the data and fails colour-blind readers.'
    ]},
    { type: 'code', lang: 'python', code: 'merged.plot(column="burden_score", cmap="YlOrRd", legend=True,\n            scheme="quantiles", k=5)   # 5-class quantile bins' },
    { type: 'p', html: 'Binning into classes (quantiles, equal intervals) can clarify or distort. Large polygons dominate visually even when few people live there \u2014 always note that choropleths show area, not people.' },

    { type: 'h2', text: 'Classified vs. continuous choropleths' },
    { type: 'table', head: ['Approach', 'Pros', 'Cons'], rows: [
      ['Continuous colour', 'Preserves full range', 'Hard to read exact values'],
      ['Quantile bins', 'Every class has data', 'Hides absolute scale'],
      ['Equal interval', 'Simple legend', 'Empty classes possible'],
      ['Natural breaks', 'Finds clusters', 'Opaque without explanation']
    ]},

    { type: 'h2', text: 'Interactive maps with Folium' },
    { type: 'p', html: 'Folium builds Leaflet web maps you can pan and zoom. Ideal for embedding station networks or facility locations in a notebook or HTML page.' },
    { type: 'code', lang: 'python', code: 'import folium\n\nm = folium.Map(location=[34.05, -118.24], zoom_start=10, tiles="CartoDB positron")\nfor _, row in stations.iterrows():\n    folium.CircleMarker(\n        location=[row["lat"], row["lon"]],\n        radius=6,\n        color="#2F6B4F",\n        fill=True,\n        fill_opacity=0.7,\n        popup=row["station"] + ": AQI " + str(row["aqi"])\n    ).add_to(m)\nm' },
    { type: 'h3', text: 'Choropleth layers in Folium' },
    { type: 'code', lang: 'python', code: 'folium.Choropleth(\n    geo_data=tracts.__geo_interface__,\n    data=burden_df,\n    columns=["tract_id", "burden_score"],\n    key_on="feature.properties.tract_id",\n    fill_color="YlOrRd",\n    legend_name="Burden score"\n).add_to(m)' },

    { type: 'h2', text: 'Maps in R with sf and ggplot2' },
    { type: 'p', html: 'The <code>sf</code> package stores simple features. Read with <code>st_read()</code>, join with dplyr, and plot with <code>geom_sf()</code>.' },
    { type: 'code', lang: 'r', code: 'library(tidyverse)\nlibrary(sf)\n\ntracts <- st_read("la_tracts.geojson")\nburden <- read_csv("burden_scores.csv")\n\njoined <- tracts |>\n  left_join(burden, by = "tract_id")\n\nggplot(joined) +\n  geom_sf(aes(fill = burden_score), color = "white", linewidth = 0.2) +\n  scale_fill_viridis_c(option = "magma", name = "Burden") +\n  labs(title = "Pollution burden across LA census tracts") +\n  theme_void()' },
    { type: 'callout', variant: 'tip', title: 'theme_void() for maps.', html: 'Remove axes and grid with <code>theme_void()</code> \u2014 maps do not need x/y tick labels when the geography is recognisable.' },

    { type: 'h2', text: 'Point maps in ggplot2' },
    { type: 'code', lang: 'r', code: 'ggplot() +\n  geom_sf(data = tracts, fill = "gray95", color = "gray70", linewidth = 0.2) +\n  geom_point(data = stations, aes(x = lon, y = lat, color = aqi), size = 3) +\n  scale_color_viridis_c(option = "inferno", name = "AQI") +\n  coord_sf() +\n  labs(title = "Monitoring stations on LA tract boundaries") +\n  theme_minimal()' },

    { type: 'h2', text: 'Basemaps and context' },
    { type: 'p', html: 'Bare scatter maps float in space. Adding city boundaries, roads, or a muted basemap helps readers orient. In GeoPandas, plot boundaries underneath points with layered <code>plot()</code> calls.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(8, 8))\ntracts.plot(ax=ax, facecolor="none", edgecolor="lightgray", linewidth=0.4)\nstations.plot(ax=ax, column="aqi", cmap="YlOrRd", markersize=40, legend=True)\nax.set_axis_off()\nax.set_title("AQI stations within LA census tracts")\nplt.show()' },

    { type: 'h2', text: 'Map design checklist' },
    { type: 'olist', items: [
      'Title states the finding, not just "Map of X".',
      'Legend shows units and bin breaks if classified.',
      'North arrow or recognisable geography for orientation.',
      'Source line: where boundaries and data came from.',
      'Note caveats: unmeasured areas, edge effects, MAUP.'
    ]},
    { type: 'callout', variant: 'warn', title: 'The Modifiable Areal Unit Problem.', html: 'Choropleth patterns depend on how boundaries are drawn. A "high burden" tract next to a "low burden" tract may average very different lived experiences block by block. Maps summarise \u2014 they do not replace local knowledge.' },

    { type: 'h2', text: 'Emissions facility maps' },
    { type: 'p', html: 'Point maps of industrial emitters reveal clustering near ports, refineries, and freight corridors. Combine with population or burden choropleths to tell an environmental justice story.' },
    { type: 'code', lang: 'python', code: 'fig, ax = plt.subplots(figsize=(9, 9))\ntracts.plot(ax=ax, column="burden_score", cmap="YlOrRd", legend=True, alpha=0.8)\nfacilities.plot(ax=ax, color="black", markersize=15, marker="x", label="Major emitter")\nax.legend()\nax.set_title("High-burden tracts overlap industrial emitter clusters")\nax.set_axis_off()\nplt.show()' },

    { type: 'h2', text: 'Heat and climate raster previews' },
    { type: 'p', html: 'Gridded temperature or precipitation data can be shown as a smoothed surface. For quick maps, treat grid cell centres as points or use dedicated raster tools (see the gridded-remote-sensing lesson).' },
    { type: 'code', lang: 'python', code: 'ax = heat_df.plot.scatter(x="lon", y="lat", c="temp_anomaly_c",\n                          cmap="RdBu_r", figsize=(8, 6), s=10)\nax.set_title("Western US temperature anomaly, summer 2023")\nplt.colorbar(ax.collections[0], label="\u00b0C anomaly")\nplt.show()' },

    { type: 'h2', text: 'Exporting maps' },
    { type: 'list', items: [
      'Static: <code>fig.savefig("burden_map.png", dpi=200, bbox_inches="tight")</code> in Python.',
      'Static: <code>ggsave("burden_map.png", width = 8, height = 8, dpi = 200)</code> in R.',
      'Interactive: <code>m.save("stations_map.html")</code> for Folium.',
      'Use higher DPI for print; 150\u2013200 for slides.'
    ]},

    { type: 'h2', text: 'Troubleshooting' },
    { type: 'table', head: ['Symptom', 'Likely cause', 'Fix'], rows: [
      ['Map in wrong location', 'Swapped lat/lon', 'Lon on x, lat on y'],
      ['All one colour', 'Join failed (NaN values)', 'Check merge keys and dtypes'],
      ['Tiny squished map', 'Aspect ratio wrong', '<code>ax.set_aspect("equal")</code> or <code>coord_sf()</code>'],
      ['Folium blank tiles', 'No internet in sandbox', 'Use offline tiles or static GeoPandas'],
      ['R geom_sf error', 'Not an sf object', 'Wrap with <code>st_as_sf()</code> or read via <code>st_read</code>']
    ]},

    { type: 'exercise', title: 'Map the monitoring network',
      html: 'From a table of stations with <code>lat</code>, <code>lon</code>, and <code>aqi</code>, make a static point map coloured by AQI with a colour bar and a descriptive title. Bonus: rebuild as an interactive Folium map with popups.',
      hint: 'For the static version: <code>ax.scatter(lon, lat, c=aqi, cmap="YlOrRd")</code> plus <code>plt.colorbar</code>. Watch the lon/lat order.',
      solution: { lang: 'python', code: 'import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(7, 7))\nsc = ax.scatter(stations["lon"], stations["lat"],\n                c=stations["aqi"], cmap="YlOrRd", s=60)\nplt.colorbar(sc, ax=ax, label="AQI")\nax.set_aspect("equal")\nax.set_title("LA monitoring stations: highest AQI inland and near freeways")\nax.set_xlabel("Longitude")\nax.set_ylabel("Latitude")\nplt.tight_layout()\nplt.show()' } },

    { type: 'exercise', title: 'Choropleth burden map',
      html: 'Join tract boundaries to a burden-score table on <code>tract_id</code>. Plot a choropleth with a sequential palette and a legend. Title the finding. How many tracts failed to join? Investigate mismatched IDs.',
      hint: 'Use <code>merge(..., how="left", indicator=True)</code> or <code>anti_join</code> in R to find unmatched rows.',
      solution: { lang: 'python', code: 'merged = tracts.merge(burden_df, on="tract_id", how="left", indicator=True)\nprint(merged["_merge"].value_counts())\n\nfig, ax = plt.subplots(figsize=(8, 8))\nmerged.plot(column="burden_score", cmap="YlOrRd", legend=True,\n            ax=ax, edgecolor="white", linewidth=0.2, missing_kwds={"color": "lightgray"})\nax.set_axis_off()\nax.set_title("South LA and port-adjacent tracts carry the highest burden")\nplt.show()' } },

    { type: 'exercise', title: 'R choropleth with ggplot2',
      html: 'In R, read tract polygons and burden data, join with dplyr, and plot with <code>geom_sf(aes(fill = burden_score))</code>. Use a viridis fill scale and <code>theme_void()</code>. Add a title stating which region stands out.',
      hint: 'library(sf); library(tidyverse); st_read(); left_join(); ggplot() + geom_sf() + scale_fill_viridis_c().',
      solution: { lang: 'r', code: 'library(tidyverse)\nlibrary(sf)\n\ntracts <- st_read("la_tracts.geojson")\njoined <- tracts |> left_join(burden, by = "tract_id")\n\nggplot(joined) +\n  geom_sf(aes(fill = burden_score), color = "white", linewidth = 0.15) +\n  scale_fill_viridis_c(option = "inferno", name = "Burden") +\n  labs(title = "Pollution burden concentrates in southern and eastern LA") +\n  theme_void()' } },

    { type: 'h2', text: 'Recap' },
    { type: 'list', items: [
      'Point maps are scatter plots of (lon, lat) \u2014 colour or size by a value.',
      'Choropleths = region geometry + a value per region, joined on a shared ID.',
      'Match colour scale to data: sequential, diverging \u2014 never rainbow.',
      'Folium for interactive web maps; GeoPandas/sf + ggplot2 for publication static maps.'
    ]}
  );
})();

// ---------------------------------------------------------------------------
// data-storytelling
// ---------------------------------------------------------------------------
const dataStorytelling = {
  title: 'Communicating with data',
  track: 'viz',
  tool: 'Both',
  level: 'intermediate',
  time: '~4-5 hrs',
  lede: 'Analysis only matters if someone understands and acts on it. This lesson is about the craft of turning correct results into a clear, honest story \u2014 the difference between a chart that informs and one that confuses or misleads. Works in Python, R, slides, or prose.',
  learn: [
    'Lead with the message, not the method',
    'Design charts that guide the eye',
    'Avoid the most common misleading patterns',
    'Add context that makes numbers meaningful',
    'Structure a short data narrative',
    'Choose chart types for environmental questions'
  ],
  prereqs: [{ id: 'matplotlib-seaborn', label: 'matplotlib' }],
  resources: [
    { name: 'Storytelling with Data', url: 'https://www.storytellingwithdata.com/books', kind: 'book' },
    { name: 'Financial Times Visual Vocabulary', url: 'https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary', kind: 'guide' },
    { name: 'Data Viz Project (chart chooser)', url: 'https://datavizproject.com/', kind: 'gallery' }
  ],
  unlock: {
    label: 'Browse projects to practise on',
    url: 'projects.html',
    blurb: 'Take any project\u2019s output and write a three-sentence story around its key chart.'
  },
  content: []
};

(function buildStorytelling() {
  const c = dataStorytelling.content;
  const push = (...blocks) => blocks.forEach((b) => c.push(b));

  push(
    { type: 'p', html: 'You can have a flawless analysis and still fail if the audience walks away confused. Communication is a skill you can learn with reliable principles \u2014 independent of whether you chart in matplotlib, ggplot2, or a slide deck.' },
    { type: 'callout', variant: 'note', title: 'Correct is not enough.', html: 'Terrain projects expect a chart <em>and</em> a short narrative. This lesson bridges the gap between code that runs and a message that lands.' },

    { type: 'h2', text: 'Start with the so-what' },
    { type: 'p', html: 'Before making a chart, finish this sentence: "The one thing I want you to take away is ___." That sentence becomes your <strong>title</strong>. "Summer AQI is double the winter average" beats "AQI by month" because it tells the reader what to see.' },
    { type: 'callout', variant: 'tip', title: 'Title = headline.', html: 'The reader should grasp your point from the title alone, then look at the chart for evidence. Subtitles carry method and timeframe.' },

    { type: 'h2', text: 'Match the chart to the question' },
    { type: 'table', head: ['Question', 'Chart type', 'Environmental example'], rows: [
      ['How does it change over time?', 'Line chart', 'Decadal CO2 trend'],
      ['Which category is largest?', 'Sorted bar chart', 'Emissions by sector'],
      ['How are values distributed?', 'Histogram / box plot', 'AQI reading spread'],
      ['Where is it worst?', 'Map (choropleth / points)', 'Burden by tract'],
      ['How do two variables relate?', 'Scatter plot', 'Temperature vs ozone'],
      ['What shares make the whole?', 'Stacked bar (few categories)', 'Energy mix over years']
    ]},
    { type: 'p', html: 'Choosing wrong chart types is the fastest way to hide your finding. When in doubt, sketch on paper before opening code.' },

    { type: 'h2', text: 'Design to guide the eye' },
    { type: 'list', items: [
      '<strong>Declutter:</strong> remove gridlines, borders, and legends you do not need.',
      '<strong>Highlight with colour:</strong> grey out context; one bold colour for what matters.',
      '<strong>Label directly:</strong> put labels on lines instead of forcing legend decoding.',
      '<strong>Order intentionally:</strong> sort bars by value so ranking is instant.',
      '<strong>Annotate:</strong> a short note ("wildfire smoke") on a spike beats a paragraph.'
    ]},
    { type: 'h3', text: 'Spotlight technique in Python' },
    { type: 'code', lang: 'python', code: 'import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(8, 4))\nfor station in stations:\n    color = "#C44E52" if station == "Downtown" else "#cccccc"\n    lw = 2 if station == "Downtown" else 1\n    ax.plot(months, data[station], color=color, linewidth=lw, label=station)\nax.set_title("Downtown LA exceeds unhealthy AQI thresholds each summer")\nplt.tight_layout()\nplt.show()' },
    { type: 'h3', text: 'Spotlight technique in R' },
    { type: 'code', lang: 'r', code: 'ggplot(aq, aes(x = month, y = aqi, group = station)) +\n  geom_line(color = "gray80") +\n  geom_line(data = filter(aq, station == "Downtown"),\n            aes(x = month, y = aqi), color = "#C44E52", linewidth = 1.2) +\n  labs(title = "Downtown drives the region\u2019s worst summer air quality")' },

    { type: 'h2', text: 'Do not mislead (even by accident)' },
    { type: 'table', head: ['Trap', 'Why it misleads', 'Fix'], rows: [
      ['Truncated bar axis', 'Tiny differences look huge', 'Start bar axes at zero'],
      ['Dual y-axes', 'Implies a relationship you chose', 'Two charts or normalise'],
      ['Cherry-picked range', 'Hides the fuller trend', 'Show enough time/context'],
      ['Rainbow colour map', 'Invents fake categories', 'Sequential / diverging scales'],
      ['Pie with many slices', 'Angles hard to compare', 'Sorted bar chart'],
      ['Choropleth without caveat', 'Area dominates perception', 'Note population / density']
    ]},
    { type: 'callout', variant: 'warn', title: 'The honesty test.', html: 'Ask: "Could a smart, skeptical reader feel tricked once they look closely?" If yes, fix it. Trust is spent in a single misleading chart.' },

    { type: 'h2', text: 'Give numbers context' },
    { type: 'p', html: '"AQI of 110" lands only next to a reference: the healthy threshold (100), last year (85), or another city. Comparisons, baselines, and benchmarks turn data into meaning.' },
    { type: 'olist', items: [
      'Compared to <strong>what</strong>? (threshold, target, prior period)',
      'Is it <strong>a lot</strong>? (per person, per area, as a percentage)',
      'Is it <strong>real</strong>? (signal or noise; confidence interval)'
    ]},
    { type: 'code', lang: 'python', code: 'avg_summer = df.loc[df["season"] == "summer", "aqi"].mean()\navg_winter = df.loc[df["season"] == "winter", "aqi"].mean()\nratio = avg_summer / avg_winter\nprint("Summer AQI is", round(ratio, 1), "x winter")' },

    { type: 'h2', text: 'Annotations that explain events' },
    { type: 'p', html: 'Environmental time series have spikes with stories \u2014 wildfires, heat waves, policy changes, monitor outages. Mark them on the chart.' },
    { type: 'code', lang: 'python', code: 'ax.annotate("Station offline\\n(maintenance)",\n            xy=(event_date, aqi_value),\n            xytext=(event_date, aqi_value + 40),\n            arrowprops=dict(arrowstyle="->", color="gray"),\n            fontsize=9)' },
    { type: 'callout', variant: 'tip', title: 'Caption the caveat.', html: 'If data are incomplete or uncertain, say so in the subtitle or a footnote. Transparency builds trust.' },

    { type: 'h2', text: 'Colour as meaning, not decoration' },
    { type: 'list', items: [
      'One semantic colour: red for danger, green for safe \u2014 but never rely on colour alone.',
      'Grey for background series; saturated hue for the hero series.',
      'Colour-blind safe palettes (viridis, ColorBrewer) for reports with wide audiences.',
      'Maps: sequential for intensity, diverging for anomaly \u2014 never jet.'
    ]},

    { type: 'h2', text: 'Small multiples vs. one busy chart' },
    { type: 'p', html: 'When comparing many stations or pollutants, facet into small panels instead of overlapping twelve lines in one tangled mess.' },
    { type: 'code', lang: 'python', code: 'import seaborn as sns\n\ng = sns.FacetGrid(df, col="pollutant", col_wrap=2, sharey=False)\ng.map_dataframe(sns.lineplot, x="month", y="value", hue="station")\ng.add_legend()\ng.fig.suptitle("Each pollutant peaks in a different season", y=1.02)' },

    { type: 'h2', text: 'Structure a short narrative' },
    { type: 'p', html: 'A durable arc for a notebook write-up, slide, or README:' },
    { type: 'steps', items: [
      { title: 'Context', text: 'What question are we answering, and why does it matter for communities or policy?' },
      { title: 'Finding', text: 'The headline result, stated plainly, with your clearest chart.' },
      { title: 'Evidence', text: 'Supporting detail \u2014 how you know, sample size, time range, caveats.' },
      { title: 'So what', text: 'What this implies or what should happen next.' }
    ]},
    { type: 'p', html: 'Example three-sentence story for an AQI project: "Los Angeles summer air quality routinely exceeds federal health guidelines. Average June\u2013August AQI is 95, with inland stations hitting 120 during heat events. Cities should expand cooling centres and smoke alert systems in the highest-burden zip codes."' },

    { type: 'h2', text: 'Before / after: a bar chart makeover' },
    { type: 'h3', text: 'Before (weak)' },
    { type: 'list', items: [
      'Title: "Emissions data"',
      'Rainbow bars, unsorted categories',
      'Y-axis starts at 50 MtCO2e',
      'No units in axis label'
    ]},
    { type: 'h3', text: 'After (strong)' },
    { type: 'list', items: [
      'Title: "Transport emits more than power and industry combined"',
      'Single hue, sorted horizontal bars',
      'X-axis starts at zero with units (MtCO2e)',
      'Source line: CARB 2023 inventory'
    ]},

    { type: 'h2', text: 'Writing for different audiences' },
    { type: 'table', head: ['Audience', 'Emphasise', 'De-emphasise'], rows: [
      ['Course instructor', 'Methods, reproducibility, caveats', 'Jargon-free policy calls'],
      ['Community partner', 'Lived impact, plain language', 'Statistical machinery'],
      ['Policy briefing', 'Actionable finding, comparison to standard', 'Code and file formats'],
      ['Technical peer', 'Uncertainty, spatial joins, data lineage', 'Motivational framing']
    ]},

    { type: 'h2', text: 'Maps need map-specific honesty' },
    { type: 'p', html: 'Choropleths of burden or asthma rates look authoritative but aggregate within arbitrary boundaries. Pair maps with bar charts of affected population, or note that small dense tracts are hard to see.' },
    { type: 'callout', variant: 'note', title: 'Show people, not just polygons.', html: 'When possible, add a second chart ranked by population exposed \u2014 the map shows where; the bar chart shows how many.' },

    { type: 'h2', text: 'Climate trend communication' },
    { type: 'p', html: 'Temperature and CO2 trends are slow signals. Show the full record, use anomaly baselines, and avoid cherry-picked start years. Rolling averages reveal direction without erasing year-to-year noise.' },
    { type: 'code', lang: 'r', code: 'ggplot(climate, aes(x = year, y = temp_anomaly_c)) +\n  geom_line(color = "gray60") +\n  geom_smooth(se = FALSE, color = "#C44E52", linewidth = 1) +\n  geom_hline(yintercept = 0, linetype = "dashed") +\n  labs(title = "California warmed roughly 1.5\u00b0C since 1900",\n       subtitle = "Annual anomaly relative to 1901\u20131960 baseline",\n       y = "Anomaly (\u00b0C)")' },

    { type: 'h2', text: 'Accessibility checklist' },
    { type: 'olist', items: [
      'Do not encode meaning by colour alone \u2014 add labels or patterns.',
      'Use sufficient contrast (dark on light or vice versa).',
      'Provide alt text or a text summary for each figure in HTML exports.',
      'Test charts in greyscale \u2014 does the story still read?'
    ]},

    { type: 'h2', text: 'Slides vs. notebooks vs. reports' },
    { type: 'list', items: [
      '<strong>Slides:</strong> one finding per slide; giant title; minimal ink.',
      '<strong>Notebooks:</strong> interleave code, chart, and interpretation cells.',
      '<strong>Reports:</strong> figure number, caption with takeaway, source line.',
      'All three: same honesty test, different density.'
    ]},

    { type: 'h2', text: 'Common student mistakes' },
    { type: 'table', head: ['Mistake', 'Why it hurts', 'Better move'], rows: [
      ['Chart with no title', 'Reader must guess the point', 'Headline title with finding'],
      ['Paragraph before the chart', 'Buries the lede', 'Chart first, then evidence'],
      ['Every series equally bold', 'No focal point', 'Grey context + one highlight'],
      ['Precision false exactness', '0.0001 on a rough estimate', 'Match sig figs to uncertainty'],
      ['Ignoring missing data', 'Silent gaps mislead', 'Mark gaps or explain exclusion']
    ]},

    { type: 'h2', text: 'Pairing charts for stronger stories' },
    { type: 'p', html: 'One chart rarely answers every question. A map plus a time series, or a bar chart plus a table of top outliers, gives both "where" and "how much".' },
    { type: 'steps', items: [
      { title: 'Map', text: 'Show spatial pattern of burden or AQI.' },
      { title: 'Bar chart', text: 'Rank the top ten tracts or stations by the same metric.' },
      { title: 'Line chart', text: 'Show whether the problem is worsening over time.' }
    ]},

    { type: 'exercise', title: 'Rewrite a chart as a story',
      html: 'Take a chart you have made. (1) Replace its title with the one finding you want remembered. (2) Grey out everything except the key element and highlight that in one colour. (3) Add one annotation explaining an event or outlier. (4) Write the three-sentence story: context, finding, so-what.',
      hint: 'If you cannot state the finding in one sentence, the chart is trying to say too much \u2014 split it.',
      solution: { lang: 'python', code: '# Example makeover (conceptual steps applied to AQI line chart):\n# 1. Title -> "Inland stations see triple the unhealthy days of coastal sites"\n# 2. Grey all stations except Pasadena in #C44E52\n# 3. Annotate August spike: "Bobcat Fire smoke"\n# 4. Story:\n#    Context: We compared unhealthy-day counts across the LA network.\n#    Finding: Pasadena recorded 45 unhealthy days vs 15 at Long Beach.\n#    So what: Inland residents face disproportionate smoke exposure during fire season.' } },

    { type: 'exercise', title: 'Audit a misleading chart',
      html: 'Find a chart online (news, report, or project) that you think could mislead. List three specific design choices that help or hurt honesty. Sketch a improved version on paper or rebuild it with corrected axis, title, and colour.',
      hint: 'Look for truncated axes, dual y-axes, cherry-picked dates, or rainbow maps.',
      solution: { lang: 'python', code: '# Example audit notes (truncated bar chart in a news article):\n# 1. Y-axis starts at 50 -> exaggerates 5% difference; fix: start at 0.\n# 2. Title is vague ("Energy use") -> fix: state finding.\n# 3. Missing source and year -> fix: add subtitle with data source.\n# Rebuild with honest scale and sorted bars.' } },

    { type: 'exercise', title: 'Three-chart narrative',
      html: 'Using any Terrain project dataset, produce three charts (e.g. map, time trend, ranked bar) that together answer one environmental justice question. Write a four-step narrative (context, finding, evidence, so-what) referencing each chart.',
      hint: 'Pick one question first: "Who breathes the worst air?" or "Where are emitters relative to burden?"',
      solution: { lang: 'r', code: '# Example structure (not runnable without your data):\n# Chart 1: choropleth of burden_score by tract\n# Chart 2: line of monthly AQI at worst station\n# Chart 3: bar of top 10 tracts by population in high-burden areas\n#\n# Narrative:\n# Context: CalEnviroScreen identifies tracts with cumulative pollution burden.\n# Finding: Port-adjacent tracts combine high burden with dense population.\n# Evidence: [map] shows spatial cluster; [bar] lists 1.2M residents in top decile;\n#           [line] shows AQI exceeded 100 for 60 summer days.\n# So what: Freight electrification should prioritise these corridors.' } },

    { type: 'h2', text: 'Recap' },
    { type: 'list', items: [
      'Lead with the message; make the <strong>title the finding</strong>.',
      'Declutter and use colour as a spotlight to guide the eye.',
      'Avoid misleading patterns \u2014 pass the honesty test.',
      'Give numbers context; structure narratives as context, finding, evidence, so-what.'
    ]}
  );
})();

w('matplotlib-seaborn', matplotlibSeaborn);
w('ggplot2', ggplot2);
w('maps', maps);
w('data-storytelling', dataStorytelling);
