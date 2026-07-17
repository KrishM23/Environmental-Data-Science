module.exports = {
  "title": "Communicating with data",
  "track": "viz",
  "tool": "Both",
  "level": "intermediate",
  "time": "~4-5 hrs",
  "lede": "Analysis only matters if someone understands and acts on it. This lesson is about the craft of turning correct results into a clear, honest story — the difference between a chart that informs and one that confuses or misleads. Works in Python, R, slides, or prose.",
  "learn": [
    "Lead with the message, not the method",
    "Design charts that guide the eye",
    "Avoid the most common misleading patterns",
    "Add context that makes numbers meaningful",
    "Structure a short data narrative",
    "Choose chart types for environmental questions"
  ],
  "prereqs": [
    {
      "id": "matplotlib-seaborn",
      "label": "matplotlib"
    }
  ],
  "resources": [
    {
      "name": "Storytelling with Data",
      "url": "https://www.storytellingwithdata.com/books",
      "kind": "book"
    },
    {
      "name": "Financial Times Visual Vocabulary",
      "url": "https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary",
      "kind": "guide"
    },
    {
      "name": "Data Viz Project (chart chooser)",
      "url": "https://datavizproject.com/",
      "kind": "gallery"
    }
  ],
  "unlock": {
    "label": "Browse projects to practise on",
    "url": "projects.html",
    "blurb": "Take any project’s output and write a three-sentence story around its key chart."
  },
  "content": [
    {
      "type": "p",
      "html": "You can have a flawless analysis and still fail if the audience walks away confused. Communication is a skill you can learn with reliable principles — independent of whether you chart in matplotlib, ggplot2, or a slide deck."
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "Correct is not enough.",
      "html": "Terrain projects expect a chart <em>and</em> a short narrative. This lesson bridges the gap between code that runs and a message that lands."
    },
    {
      "type": "h2",
      "text": "Start with the so-what"
    },
    {
      "type": "p",
      "html": "Before making a chart, finish this sentence: \"The one thing I want you to take away is ___.\" That sentence becomes your <strong>title</strong>. \"Summer AQI is double the winter average\" beats \"AQI by month\" because it tells the reader what to see."
    },
    {
      "type": "callout",
      "variant": "tip",
      "title": "Title = headline.",
      "html": "The reader should grasp your point from the title alone, then look at the chart for evidence. Subtitles carry method and timeframe."
    },
    {
      "type": "h2",
      "text": "Match the chart to the question"
    },
    {
      "type": "table",
      "head": [
        "Question",
        "Chart type",
        "Environmental example"
      ],
      "rows": [
        [
          "How does it change over time?",
          "Line chart",
          "Decadal CO2 trend"
        ],
        [
          "Which category is largest?",
          "Sorted bar chart",
          "Emissions by sector"
        ],
        [
          "How are values distributed?",
          "Histogram / box plot",
          "AQI reading spread"
        ],
        [
          "Where is it worst?",
          "Map (choropleth / points)",
          "Burden by tract"
        ],
        [
          "How do two variables relate?",
          "Scatter plot",
          "Temperature vs ozone"
        ],
        [
          "What shares make the whole?",
          "Stacked bar (few categories)",
          "Energy mix over years"
        ]
      ]
    },
    {
      "type": "p",
      "html": "Choosing wrong chart types is the fastest way to hide your finding. When in doubt, sketch on paper before opening code."
    },
    {
      "type": "h2",
      "text": "Design to guide the eye"
    },
    {
      "type": "list",
      "items": [
        "<strong>Declutter:</strong> remove gridlines, borders, and legends you do not need.",
        "<strong>Highlight with colour:</strong> grey out context; one bold colour for what matters.",
        "<strong>Label directly:</strong> put labels on lines instead of forcing legend decoding.",
        "<strong>Order intentionally:</strong> sort bars by value so ranking is instant.",
        "<strong>Annotate:</strong> a short note (\"wildfire smoke\") on a spike beats a paragraph."
      ]
    },
    {
      "type": "h3",
      "text": "Spotlight technique in Python"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(8, 4))\nfor station in stations:\n    color = \"#C44E52\" if station == \"Downtown\" else \"#cccccc\"\n    lw = 2 if station == \"Downtown\" else 1\n    ax.plot(months, data[station], color=color, linewidth=lw, label=station)\nax.set_title(\"Downtown LA exceeds unhealthy AQI thresholds each summer\")\nplt.tight_layout()\nplt.show()"
    },
    {
      "type": "h3",
      "text": "Spotlight technique in R"
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(aq, aes(x = month, y = aqi, group = station)) +\n  geom_line(color = \"gray80\") +\n  geom_line(data = filter(aq, station == \"Downtown\"),\n            aes(x = month, y = aqi), color = \"#C44E52\", linewidth = 1.2) +\n  labs(title = \"Downtown drives the region’s worst summer air quality\")"
    },
    {
      "type": "h2",
      "text": "Do not mislead (even by accident)"
    },
    {
      "type": "table",
      "head": [
        "Trap",
        "Why it misleads",
        "Fix"
      ],
      "rows": [
        [
          "Truncated bar axis",
          "Tiny differences look huge",
          "Start bar axes at zero"
        ],
        [
          "Dual y-axes",
          "Implies a relationship you chose",
          "Two charts or normalise"
        ],
        [
          "Cherry-picked range",
          "Hides the fuller trend",
          "Show enough time/context"
        ],
        [
          "Rainbow colour map",
          "Invents fake categories",
          "Sequential / diverging scales"
        ],
        [
          "Pie with many slices",
          "Angles hard to compare",
          "Sorted bar chart"
        ],
        [
          "Choropleth without caveat",
          "Area dominates perception",
          "Note population / density"
        ]
      ]
    },
    {
      "type": "callout",
      "variant": "warn",
      "title": "The honesty test.",
      "html": "Ask: \"Could a smart, skeptical reader feel tricked once they look closely?\" If yes, fix it. Trust is spent in a single misleading chart."
    },
    {
      "type": "h2",
      "text": "Give numbers context"
    },
    {
      "type": "p",
      "html": "\"AQI of 110\" lands only next to a reference: the healthy threshold (100), last year (85), or another city. Comparisons, baselines, and benchmarks turn data into meaning."
    },
    {
      "type": "olist",
      "items": [
        "Compared to <strong>what</strong>? (threshold, target, prior period)",
        "Is it <strong>a lot</strong>? (per person, per area, as a percentage)",
        "Is it <strong>real</strong>? (signal or noise; confidence interval)"
      ]
    },
    {
      "type": "code",
      "lang": "python",
      "code": "avg_summer = df.loc[df[\"season\"] == \"summer\", \"aqi\"].mean()\navg_winter = df.loc[df[\"season\"] == \"winter\", \"aqi\"].mean()\nratio = avg_summer / avg_winter\nprint(\"Summer AQI is\", round(ratio, 1), \"x winter\")"
    },
    {
      "type": "h2",
      "text": "Annotations that explain events"
    },
    {
      "type": "p",
      "html": "Environmental time series have spikes with stories — wildfires, heat waves, policy changes, monitor outages. Mark them on the chart."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "ax.annotate(\"Station offline\\n(maintenance)\",\n            xy=(event_date, aqi_value),\n            xytext=(event_date, aqi_value + 40),\n            arrowprops=dict(arrowstyle=\"->\", color=\"gray\"),\n            fontsize=9)"
    },
    {
      "type": "callout",
      "variant": "tip",
      "title": "Caption the caveat.",
      "html": "If data are incomplete or uncertain, say so in the subtitle or a footnote. Transparency builds trust."
    },
    {
      "type": "h2",
      "text": "Colour as meaning, not decoration"
    },
    {
      "type": "list",
      "items": [
        "One semantic colour: red for danger, green for safe — but never rely on colour alone.",
        "Grey for background series; saturated hue for the hero series.",
        "Colour-blind safe palettes (viridis, ColorBrewer) for reports with wide audiences.",
        "Maps: sequential for intensity, diverging for anomaly — never jet."
      ]
    },
    {
      "type": "h2",
      "text": "Small multiples vs. one busy chart"
    },
    {
      "type": "p",
      "html": "When comparing many stations or pollutants, facet into small panels instead of overlapping twelve lines in one tangled mess."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import seaborn as sns\n\ng = sns.FacetGrid(df, col=\"pollutant\", col_wrap=2, sharey=False)\ng.map_dataframe(sns.lineplot, x=\"month\", y=\"value\", hue=\"station\")\ng.add_legend()\ng.fig.suptitle(\"Each pollutant peaks in a different season\", y=1.02)"
    },
    {
      "type": "h2",
      "text": "Structure a short narrative"
    },
    {
      "type": "p",
      "html": "A durable arc for a notebook write-up, slide, or README:"
    },
    {
      "type": "steps",
      "items": [
        {
          "title": "Context",
          "text": "What question are we answering, and why does it matter for communities or policy?"
        },
        {
          "title": "Finding",
          "text": "The headline result, stated plainly, with your clearest chart."
        },
        {
          "title": "Evidence",
          "text": "Supporting detail — how you know, sample size, time range, caveats."
        },
        {
          "title": "So what",
          "text": "What this implies or what should happen next."
        }
      ]
    },
    {
      "type": "p",
      "html": "Example three-sentence story for an AQI project: \"Los Angeles summer air quality routinely exceeds federal health guidelines. Average June–August AQI is 95, with inland stations hitting 120 during heat events. Cities should expand cooling centres and smoke alert systems in the highest-burden zip codes.\""
    },
    {
      "type": "h2",
      "text": "Before / after: a bar chart makeover"
    },
    {
      "type": "h3",
      "text": "Before (weak)"
    },
    {
      "type": "list",
      "items": [
        "Title: \"Emissions data\"",
        "Rainbow bars, unsorted categories",
        "Y-axis starts at 50 MtCO2e",
        "No units in axis label"
      ]
    },
    {
      "type": "h3",
      "text": "After (strong)"
    },
    {
      "type": "list",
      "items": [
        "Title: \"Transport emits more than power and industry combined\"",
        "Single hue, sorted horizontal bars",
        "X-axis starts at zero with units (MtCO2e)",
        "Source line: CARB 2023 inventory"
      ]
    },
    {
      "type": "h2",
      "text": "Writing for different audiences"
    },
    {
      "type": "table",
      "head": [
        "Audience",
        "Emphasise",
        "De-emphasise"
      ],
      "rows": [
        [
          "Course instructor",
          "Methods, reproducibility, caveats",
          "Jargon-free policy calls"
        ],
        [
          "Community partner",
          "Lived impact, plain language",
          "Statistical machinery"
        ],
        [
          "Policy briefing",
          "Actionable finding, comparison to standard",
          "Code and file formats"
        ],
        [
          "Technical peer",
          "Uncertainty, spatial joins, data lineage",
          "Motivational framing"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Maps need map-specific honesty"
    },
    {
      "type": "p",
      "html": "Choropleths of burden or asthma rates look authoritative but aggregate within arbitrary boundaries. Pair maps with bar charts of affected population, or note that small dense tracts are hard to see."
    },
    {
      "type": "callout",
      "variant": "note",
      "title": "Show people, not just polygons.",
      "html": "When possible, add a second chart ranked by population exposed — the map shows where; the bar chart shows how many."
    },
    {
      "type": "h2",
      "text": "Climate trend communication"
    },
    {
      "type": "p",
      "html": "Temperature and CO2 trends are slow signals. Show the full record, use anomaly baselines, and avoid cherry-picked start years. Rolling averages reveal direction without erasing year-to-year noise."
    },
    {
      "type": "code",
      "lang": "r",
      "code": "ggplot(climate, aes(x = year, y = temp_anomaly_c)) +\n  geom_line(color = \"gray60\") +\n  geom_smooth(se = FALSE, color = \"#C44E52\", linewidth = 1) +\n  geom_hline(yintercept = 0, linetype = \"dashed\") +\n  labs(title = \"California warmed roughly 1.5°C since 1900\",\n       subtitle = \"Annual anomaly relative to 1901–1960 baseline\",\n       y = \"Anomaly (°C)\")"
    },
    {
      "type": "h2",
      "text": "Accessibility checklist"
    },
    {
      "type": "olist",
      "items": [
        "Do not encode meaning by colour alone — add labels or patterns.",
        "Use sufficient contrast (dark on light or vice versa).",
        "Provide alt text or a text summary for each figure in HTML exports.",
        "Test charts in greyscale — does the story still read?"
      ]
    },
    {
      "type": "h2",
      "text": "Slides vs. notebooks vs. reports"
    },
    {
      "type": "list",
      "items": [
        "<strong>Slides:</strong> one finding per slide; giant title; minimal ink.",
        "<strong>Notebooks:</strong> interleave code, chart, and interpretation cells.",
        "<strong>Reports:</strong> figure number, caption with takeaway, source line.",
        "All three: same honesty test, different density."
      ]
    },
    {
      "type": "h2",
      "text": "Common student mistakes"
    },
    {
      "type": "table",
      "head": [
        "Mistake",
        "Why it hurts",
        "Better move"
      ],
      "rows": [
        [
          "Chart with no title",
          "Reader must guess the point",
          "Headline title with finding"
        ],
        [
          "Paragraph before the chart",
          "Buries the lede",
          "Chart first, then evidence"
        ],
        [
          "Every series equally bold",
          "No focal point",
          "Grey context + one highlight"
        ],
        [
          "Precision false exactness",
          "0.0001 on a rough estimate",
          "Match sig figs to uncertainty"
        ],
        [
          "Ignoring missing data",
          "Silent gaps mislead",
          "Mark gaps or explain exclusion"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Pairing charts for stronger stories"
    },
    {
      "type": "p",
      "html": "One chart rarely answers every question. A map plus a time series, or a bar chart plus a table of top outliers, gives both \"where\" and \"how much\"."
    },
    {
      "type": "steps",
      "items": [
        {
          "title": "Map",
          "text": "Show spatial pattern of burden or AQI."
        },
        {
          "title": "Bar chart",
          "text": "Rank the top ten tracts or stations by the same metric."
        },
        {
          "title": "Line chart",
          "text": "Show whether the problem is worsening over time."
        }
      ]
    },
    {
      "type": "exercise",
      "title": "Rewrite a chart as a story",
      "html": "Take a chart you have made. (1) Replace its title with the one finding you want remembered. (2) Grey out everything except the key element and highlight that in one colour. (3) Add one annotation explaining an event or outlier. (4) Write the three-sentence story: context, finding, so-what.",
      "hint": "If you cannot state the finding in one sentence, the chart is trying to say too much — split it.",
      "solution": {
        "lang": "python",
        "code": "# Example makeover (conceptual steps applied to AQI line chart):\n# 1. Title -> \"Inland stations see triple the unhealthy days of coastal sites\"\n# 2. Grey all stations except Pasadena in #C44E52\n# 3. Annotate August spike: \"Bobcat Fire smoke\"\n# 4. Story:\n#    Context: We compared unhealthy-day counts across the LA network.\n#    Finding: Pasadena recorded 45 unhealthy days vs 15 at Long Beach.\n#    So what: Inland residents face disproportionate smoke exposure during fire season."
      }
    },
    {
      "type": "exercise",
      "title": "Audit a misleading chart",
      "html": "Find a chart online (news, report, or project) that you think could mislead. List three specific design choices that help or hurt honesty. Sketch a improved version on paper or rebuild it with corrected axis, title, and colour.",
      "hint": "Look for truncated axes, dual y-axes, cherry-picked dates, or rainbow maps.",
      "solution": {
        "lang": "python",
        "code": "# Example audit notes (truncated bar chart in a news article):\n# 1. Y-axis starts at 50 -> exaggerates 5% difference; fix: start at 0.\n# 2. Title is vague (\"Energy use\") -> fix: state finding.\n# 3. Missing source and year -> fix: add subtitle with data source.\n# Rebuild with honest scale and sorted bars."
      }
    },
    {
      "type": "exercise",
      "title": "Three-chart narrative",
      "html": "Using any Terrain project dataset, produce three charts (e.g. map, time trend, ranked bar) that together answer one environmental justice question. Write a four-step narrative (context, finding, evidence, so-what) referencing each chart.",
      "hint": "Pick one question first: \"Who breathes the worst air?\" or \"Where are emitters relative to burden?\"",
      "solution": {
        "lang": "r",
        "code": "# Example structure (not runnable without your data):\n# Chart 1: choropleth of burden_score by tract\n# Chart 2: line of monthly AQI at worst station\n# Chart 3: bar of top 10 tracts by population in high-burden areas\n#\n# Narrative:\n# Context: CalEnviroScreen identifies tracts with cumulative pollution burden.\n# Finding: Port-adjacent tracts combine high burden with dense population.\n# Evidence: [map] shows spatial cluster; [bar] lists 1.2M residents in top decile;\n#           [line] shows AQI exceeded 100 for 60 summer days.\n# So what: Freight electrification should prioritise these corridors."
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "Lead with the message; make the <strong>title the finding</strong>.",
        "Declutter and use colour as a spotlight to guide the eye.",
        "Avoid misleading patterns — pass the honesty test.",
        "Give numbers context; structure narratives as context, finding, evidence, so-what."
      ]
    }
  ]
};
