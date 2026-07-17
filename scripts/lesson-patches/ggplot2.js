module.exports = {
  "title": "Visualization with ggplot2",
  "track": "viz",
  "tool": "R",
  "level": "beginner",
  "time": "~5-6 hrs",
  "lede": "ggplot2 is one of the best-designed plotting tools anywhere. It is built on a grammar of graphics: you describe a chart as data + mappings + layers, and ggplot composes it. Learn the grammar and you can build any environmental chart — burden maps as choropleths, emissions bars, climate trend lines.",
  "learn": [
    "Understand the grammar of graphics",
    "Map data to aesthetics (x, y, colour)",
    "Add geoms: points, lines, bars, boxes",
    "Facet into small multiples",
    "Control scales and colour palettes",
    "Polish with labels and themes"
  ],
  "prereqs": [
    {
      "id": "tidyverse",
      "label": "tidyverse"
    }
  ],
  "resources": [
    {
      "name": "R for Data Science: viz",
      "url": "https://r4ds.hadley.nz/data-visualize",
      "kind": "book"
    },
    {
      "name": "ggplot2 cheat sheet",
      "url": "https://rstudio.github.io/cheatsheets/data-visualization.pdf",
      "kind": "pdf"
    },
    {
      "name": "R Graph Gallery",
      "url": "https://r-graph-gallery.com/",
      "kind": "gallery"
    }
  ],
  "unlock": {
    "label": "Who carries the pollution burden?",
    "url": "projects.html",
    "blurb": "Visualise CalEnviroScreen burden scores across communities with ggplot2."
  },
  "content": [
    {
      "type": "p",
      "html": "ggplot2 ships with the tidyverse. Load it once per session. Every chart follows the same recipe: <code>ggplot(data) + aes(mappings) + geom_*()</code>, with extra <code>+</code> layers for labels, scales, and themes."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "library(tidyverse)\n\naq <- read_csv(\"la_air_quality.csv\")\nglimpse(aq)"
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "The + adds layers.",
      "html": "Each <code>+</code> stacks another layer. Put <code>+</code> at the end of the line so you can break code across rows. Build simple first, then add polish."
    },
    {
      "type": "h2",
      "text": "The three core pieces"
    },
    {
      "type": "olist",
      "items": [
        "<strong>Data</strong> — the data frame you are plotting.",
        "<strong>Aesthetics</strong> (<code>aes</code>) — which columns map to x, y, colour, size, shape.",
        "<strong>Geoms</strong> — the geometric shape: points, lines, bars."
      ]
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = month, y = aqi)) +\n  geom_point(color = \"#2F6B4F\")"
    },
    {
      "type": "h2",
      "text": "Mapping vs. setting"
    },
    {
      "type": "p",
      "html": "Inside <code>aes()</code> you <em>map</em> a column to a property (colour varies by data and produces a legend). Outside <code>aes()</code> you <em>set</em> a fixed value (everything one colour)."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "# colour VARIES by station (mapping -> inside aes)\nggplot(aq, aes(x = month, y = aqi, color = station)) +\n  geom_line()\n\n# colour is FIXED (setting -> outside aes)\nggplot(aq, aes(x = month, y = aqi)) +\n  geom_line(color = \"steelblue\")"
    },
    {
      "type": "callout",
      "variant": "warn",
      "title": "Common beginner bug.",
      "html": "Putting <code>color = station</code> outside <code>aes()</code> tries to use a literal colour name \"station\" and fails. Column names belong inside <code>aes()</code>."
    },
    {
      "type": "h2",
      "text": "Line charts: climate and AQI trends"
    },
    {
      "type": "p",
      "html": "<code>geom_line()</code> connects observations in row order. Sort by time first if your data are not already ordered."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "aq |>\n  group_by(month) |>\n  summarise(mean_aqi = mean(aqi)) |>\n  ggplot(aes(x = month, y = mean_aqi)) +\n  geom_line(linewidth = 1, color = \"#2F6B4F\") +\n  geom_point(size = 2, color = \"#2F6B4F\") +\n  labs(title = \"LA air quality worsens in summer\",\n       x = \"Month\", y = \"Average AQI\")"
    },
    {
      "type": "h3",
      "text": "Multiple series with colour"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = month, y = aqi, color = station)) +\n  geom_line(linewidth = 0.9) +\n  labs(title = \"Seasonal AQI by monitoring station\",\n       color = \"Station\")"
    },
    {
      "type": "h2",
      "text": "Bar charts: emissions and categories"
    },
    {
      "type": "p",
      "html": "<code>geom_col()</code> draws bars from values you supply. <code>geom_bar()</code> counts rows — use it for frequency charts."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "emissions |>\n  group_by(sector) |>\n  summarise(total = sum(emissions_mtco2e)) |>\n  arrange(total) |>\n  ggplot(aes(x = total, y = reorder(sector, total))) +\n  geom_col(fill = \"#5B8BB0\") +\n  labs(title = \"Transport leads sector emissions\",\n       x = \"MtCO2e\", y = NULL)"
    },
    {
      "type": "callout",
      "variant": "tip",
      "title": "reorder() sorts bars.",
      "html": "<code>reorder(sector, total)</code> arranges bars by value automatically — essential for readable category charts."
    },
    {
      "type": "h2",
      "text": "Scatter plots and relationships"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = temp_c, y = pm25)) +\n  geom_point(alpha = 0.4, color = \"#2F6B4F\") +\n  geom_smooth(method = \"lm\", se = TRUE, color = \"crimson\") +\n  labs(title = \"Higher temperatures associate with more PM2.5\",\n       x = \"Temperature (°C)\", y = \"PM2.5 (µg/m³)\")"
    },
    {
      "type": "p",
      "html": "<code>geom_smooth()</code> adds a trend line with a confidence ribbon — useful for exploring correlation, not proof of causation."
    },
    {
      "type": "h2",
      "text": "Distributions with histograms and density"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(burden, aes(x = burden_score)) +\n  geom_histogram(bins = 30, fill = \"#5B8BB0\", color = \"white\") +\n  geom_vline(aes(xintercept = median(burden_score)),\n             linetype = \"dashed\", color = \"crimson\") +\n  labs(title = \"Distribution of CalEnviroScreen burden scores\",\n       x = \"Burden score\", y = \"Number of tracts\")"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(burden, aes(x = burden_score, fill = region)) +\n  geom_density(alpha = 0.4) +\n  labs(title = \"Burden score density by region\", fill = \"Region\")"
    },
    {
      "type": "h2",
      "text": "Box plots and violin plots"
    },
    {
      "type": "p",
      "html": "Compare distributions across groups — AQI by station, emissions by facility type."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = station, y = aqi, fill = station)) +\n  geom_boxplot(show.legend = FALSE) +\n  labs(title = \"AQI variability differs by station\", y = \"AQI\") +\n  theme(axis.text.x = element_text(angle = 45, hjust = 1))"
    },
    {
      "type": "table",
      "head": [
        "Geom",
        "Chart type"
      ],
      "rows": [
        [
          "<code>geom_point()</code>",
          "Scatter"
        ],
        [
          "<code>geom_line()</code>",
          "Line / trend"
        ],
        [
          "<code>geom_col()</code>",
          "Bar from values"
        ],
        [
          "<code>geom_bar()</code>",
          "Bar from counts"
        ],
        [
          "<code>geom_boxplot()</code>",
          "Distribution by group"
        ],
        [
          "<code>geom_smooth()</code>",
          "Trend with uncertainty"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Faceting: small multiples"
    },
    {
      "type": "p",
      "html": "<code>facet_wrap()</code> splits one chart into panels by a categorical variable — one mini-chart per station or year."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = month, y = aqi, color = category)) +\n  geom_line() +\n  facet_wrap(~ station, scales = \"free_y\") +\n  labs(title = \"AQI seasonality by station and category\")"
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "scales = \"free_y\".",
      "html": "When stations have very different AQI ranges, free y-scales per panel make patterns visible. Use fixed scales when you want direct magnitude comparison."
    },
    {
      "type": "h2",
      "text": "Scales and colour palettes"
    },
    {
      "type": "p",
      "html": "Environmental data needs honest colour. Use sequential palettes for increasing intensity (burden, AQI), diverging for anomalies."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(tracts, aes(x = burden_score, y = pop_density)) +\n  geom_point(aes(color = burden_score), alpha = 0.6) +\n  scale_color_viridis_c(option = \"magma\") +\n  labs(title = \"Higher burden tracts cluster at higher density\",\n       color = \"Burden\")"
    },
    {
      "type": "list",
      "items": [
        "<code>scale_color_viridis_c()</code> — colour-blind safe continuous scale.",
        "<code>scale_fill_brewer(palette = \"YlOrRd\")</code> — sequential ColorBrewer.",
        "<code>scale_color_manual()</code> — your own category colours.",
        "<code>scale_x_continuous(limits = c(0, NA))</code> — bar charts from zero."
      ]
    },
    {
      "type": "h2",
      "text": "Labels and themes"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = month, y = aqi, color = station)) +\n  geom_line(linewidth = 1) +\n  labs(\n    title = \"Air quality worsens in summer\",\n    subtitle = \"Monthly average AQI by station, 2024\",\n    caption = \"Source: South Coast AQMD monitoring network\",\n    x = \"Month\", y = \"Average AQI\", color = \"Station\"\n  ) +\n  theme_minimal()"
    },
    {
      "type": "h3",
      "text": "Themes change everything"
    },
    {
      "type": "p",
      "html": "Swap <code>theme_minimal()</code>, <code>theme_bw()</code>, or <code>theme_classic()</code> to restyle instantly. Set a global default with <code>theme_set(theme_minimal())</code>."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "theme_set(theme_minimal(base_size = 12))"
    },
    {
      "type": "h2",
      "text": "Saving plots"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "p <- ggplot(aq, aes(month, aqi)) + geom_line()\nggsave(\"aqi_trend.png\", p, width = 8, height = 4, dpi = 150)\nggsave(\"aqi_trend.pdf\", p, width = 8, height = 4)"
    },
    {
      "type": "list",
      "items": [
        "Assign the plot to <code>p</code> before saving.",
        "<code>width</code> and <code>height</code> are in inches.",
        "<code>dpi = 150</code> for crisp PNG output."
      ]
    },
    {
      "type": "h2",
      "text": "Working with dates"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "climate |>\n  mutate(date = as.Date(date)) |>\n  ggplot(aes(x = date, y = temp_anomaly_c)) +\n  geom_line(color = \"#2F6B4F\") +\n  geom_hline(yintercept = 0, linetype = \"dashed\", color = \"gray50\") +\n  labs(title = \"Regional temperature anomaly trend\",\n       x = NULL, y = \"Anomaly (°C)\")"
    },
    {
      "type": "h2",
      "text": "Layering geoms"
    },
    {
      "type": "p",
      "html": "Stack multiple geoms on one chart — points plus trend line, bars plus text labels."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = temp_c, y = aqi)) +\n  geom_point(alpha = 0.3, color = \"#2F6B4F\") +\n  geom_smooth(method = \"loess\", color = \"crimson\", se = FALSE) +\n  labs(title = \"AQI rises with temperature (nonlinear fit)\")"
    },
    {
      "type": "h2",
      "text": "Coordinate transforms"
    },
    {
      "type": "p",
      "html": "Flip axes with <code>coord_flip()</code> for long bar labels. Use <code>coord_fixed()</code> when x and y share the same units (rare outside maps)."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "emissions |>\n  count(sector, sort = TRUE) |>\n  ggplot(aes(x = n, y = reorder(sector, n))) +\n  geom_col(fill = \"#5B8BB0\") +\n  coord_flip() +\n  labs(title = \"Facility count by sector\", x = \"Count\", y = NULL)"
    },
    {
      "type": "h2",
      "text": "Common mistakes"
    },
    {
      "type": "table",
      "head": [
        "Problem",
        "Cause",
        "Fix"
      ],
      "rows": [
        [
          "Legends say \"aqi\" oddly",
          "Continuous mapped to color",
          "Use <code>scale_color_viridis_c()</code> or bin"
        ],
        [
          "Lines zigzag",
          "Data not sorted by x",
          "<code>arrange(month)</code> before plotting"
        ],
        [
          "Bars float above zero",
          "Wrong stat or transform",
          "Use <code>geom_col()</code> with raw values"
        ],
        [
          "Facet panels empty",
          "Factor levels with no data",
          "<code>drop = TRUE</code> in facet or filter first"
        ],
        [
          "Saved plot missing labels",
          "Cropped margins",
          "Increase <code>ggsave</code> width/height"
        ]
      ]
    },
    {
      "type": "exercise",
      "title": "Faceted AQI trends",
      "html": "Build a ggplot that shows AQI over <code>month</code> as a line, coloured by <code>category</code>, faceted by <code>station</code>, with a proper title, axis labels, and <code>theme_minimal()</code>.",
      "hint": "Start from <code>ggplot(aq, aes(month, aqi, color = category))</code>, then add <code>geom_line()</code>, <code>facet_wrap(~ station)</code>, <code>labs(...)</code>.",
      "solution": {
        "lang": "r",
        "code": "ggplot(aq, aes(x = month, y = aqi, color = category)) +\n  geom_line(linewidth = 1) +\n  facet_wrap(~ station) +\n  labs(title = \"AQI through the year by station\",\n       x = \"Month\", y = \"AQI\", color = \"Category\") +\n  theme_minimal()"
      }
    },
    {
      "type": "exercise",
      "title": "Burden score bar chart",
      "html": "Using a table with <code>neighborhood</code> and <code>burden_score</code>, plot the top 10 neighborhoods by burden as a horizontal bar chart. Use <code>reorder()</code>, title the finding, and label axes.",
      "hint": "<code>slice_max(burden_score, n = 10)</code> then <code>ggplot(aes(x = burden_score, y = reorder(neighborhood, burden_score))) + geom_col()</code>.",
      "solution": {
        "lang": "r",
        "code": "top10 <- burden |>\n  slice_max(burden_score, n = 10)\n\nggplot(top10, aes(x = burden_score, y = reorder(neighborhood, burden_score))) +\n  geom_col(fill = \"#C44E52\") +\n  labs(title = \"These ten neighborhoods face the highest pollution burden\",\n       x = \"CalEnviroScreen burden score\", y = NULL) +\n  theme_minimal()"
      }
    },
    {
      "type": "exercise",
      "title": "Emissions trend with annotation",
      "html": "Plot annual total emissions as a line chart. Add a vertical line or annotate the year with the largest drop. Write a subtitle explaining what might have caused it.",
      "hint": "Summarise with <code>group_by(year) |> summarise(total = sum(emissions_mtco2e))</code>. Use <code>geom_vline</code> or <code>annotate(\"text\", ...)</code>.",
      "solution": {
        "lang": "r",
        "code": "annual <- emissions |>\n  group_by(year) |>\n  summarise(total = sum(emissions_mtco2e))\n\nggplot(annual, aes(x = year, y = total)) +\n  geom_line(linewidth = 1, color = \"#2F6B4F\") +\n  geom_point(size = 2, color = \"#2F6B4F\") +\n  labs(\n    title = \"California emissions declined over the decade\",\n    subtitle = \"Sharp drop in 2020 reflects pandemic travel reduction\",\n    x = \"Year\", y = \"Total emissions (MtCO2e)\"\n  ) +\n  theme_minimal()"
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "Charts = <code>ggplot(data) + aes(...) + geom_*()</code>, layered with <code>+</code>.",
        "Map inside <code>aes()</code> (varies by data); set outside (fixed value).",
        "Pick a geom per chart type; add <code>geom_smooth()</code> for trends.",
        "<code>facet_wrap()</code> makes small multiples; <code>labs()</code> + themes polish output."
      ]
    }
  ]
};
