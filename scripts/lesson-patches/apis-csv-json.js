module.exports = {
  "title": "Getting data: files, APIs & JSON",
  "track": "data",
  "tool": "Python",
  "level": "intermediate",
  "time": "~4-5 hrs",
  "lede": "Before you can analyse anything you have to get the data. This lesson covers downloadable files, REST APIs that return JSON, and reading directly from URLs — using AirNow, NOAA, USGS, and Climate TRACE as worked examples.",
  "learn": [
    "Read CSV and Excel files robustly with pandas",
    "Understand JSON structure and navigate nested responses",
    "Call REST APIs with requests and handle errors",
    "Turn JSON responses into tidy DataFrames",
    "Use API keys safely and cache responses responsibly"
  ],
  "prereqs": [
    {
      "id": "pandas",
      "label": "pandas"
    }
  ],
  "resources": [
    {
      "name": "requests quickstart",
      "url": "https://requests.readthedocs.io/en/latest/user/quickstart/",
      "kind": "docs"
    },
    {
      "name": "AirNow API docs",
      "url": "https://docs.airnowapi.org/",
      "kind": "api"
    },
    {
      "name": "USGS Water Services",
      "url": "https://waterservices.usgs.gov/",
      "kind": "api"
    },
    {
      "name": "What is a REST API?",
      "url": "https://developer.mozilla.org/en-US/docs/Glossary/REST",
      "kind": "guide"
    }
  ],
  "unlock": {
    "label": "Explore the dataset library",
    "url": "datasets.html",
    "blurb": "Each dataset page lists exactly how to pull it — file, API, or direct URL."
  },
  "content": [
    {
      "type": "p",
      "html": "Before you can analyse air quality, streamflow, or emissions, you have to get the data. Environmental scientists pull from downloadable CSV files, REST APIs returning JSON, and direct URLs. This lesson covers all three using AirNow, NOAA, USGS, and Climate TRACE as examples."
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "Complete the <a class=\"inline\" href=\"lesson.html?id=pandas\">pandas lesson</a> first. All examples use Python.",
      "title": "Prerequisites."
    },
    {
      "type": "h2",
      "text": "Three ways data arrives"
    },
    {
      "type": "table",
      "head": [
        "Source type",
        "Examples",
        "How you load it"
      ],
      "rows": [
        [
          "Static file (CSV/Excel)",
          "CalEnviroScreen download, NOAA daily summaries",
          "pd.read_csv() or pd.read_excel()"
        ],
        [
          "URL (no API key)",
          "Public CSV hosted on agency server",
          "pd.read_csv(url)"
        ],
        [
          "REST API (JSON)",
          "AirNow, USGS Water Services, OpenAQ",
          "requests.get() then pd.json_normalize()"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "Reading CSV files robustly"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import pandas as pd\n\ndf = pd.read_csv(\"data/stations.csv\")\ndf = pd.read_csv(\"https://example.org/noaa_daily.csv\")\nprint(df.head())"
    },
    {
      "type": "h3",
      "text": "Common read_csv parameters"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = pd.read_csv(\n    \"usgs_streamflow.csv\",\n    parse_dates=[\"datetime\"],\n    na_values=[-999, \"\", \"NA\", \"null\"],\n    skiprows=1,\n    sep=\",\",\n    encoding=\"utf-8\",\n    dtype={\"site_no\": str}   # keep IDs as strings\n)"
    },
    {
      "type": "h3",
      "text": "Reading Excel files"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "xl = pd.read_excel(\"climate_report.xlsx\", sheet_name=\"2024\")\n\n# list all sheet names\nimport openpyxl\nwb = openpyxl.load_workbook(\"climate_report.xlsx\")\nprint(wb.sheetnames)"
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "Excel files from agencies often have title rows above the header. Use <code>skiprows=</code> or <code>header=</code> to point pandas at the real column names.",
      "title": "Excel gotchas."
    },
    {
      "type": "h2",
      "text": "Reading directly from URLs"
    },
    {
      "type": "p",
      "html": "Many Terrain datasets are hosted CSVs. No download step needed:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "url = \"https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/2024/72503099999.csv\"\ndf = pd.read_csv(url, parse_dates=[\"DATE\"], na_values=[9999.9])\ndf.head()"
    },
    {
      "type": "h2",
      "text": "Understanding JSON"
    },
    {
      "type": "p",
      "html": "APIs return <strong>JSON</strong> — nested dictionaries and lists that mirror Python data structures."
    },
    {
      "type": "code",
      "lang": "text",
      "code": "{\n  \"city\": \"Los Angeles\",\n  \"count\": 2,\n  \"results\": [\n    {\"parameter\": \"pm25\", \"value\": 18.4, \"unit\": \"ug/m3\", \"date\": \"2024-06-01\"},\n    {\"parameter\": \"o3\", \"value\": 0.042, \"unit\": \"ppm\", \"date\": \"2024-06-01\"}\n  ]\n}"
    },
    {
      "type": "p",
      "html": "Navigate JSON like Python dicts: <code>data[\"results\"][0][\"value\"]</code> gives <code>18.4</code>."
    },
    {
      "type": "h3",
      "text": "JSON data types"
    },
    {
      "type": "table",
      "head": [
        "JSON",
        "Python",
        "Example"
      ],
      "rows": [
        [
          "string",
          "str",
          "\"Los Angeles\""
        ],
        [
          "number",
          "int / float",
          "18.4"
        ],
        [
          "boolean",
          "bool",
          "true"
        ],
        [
          "null",
          "None",
          "null"
        ],
        [
          "array",
          "list",
          "[1, 2, 3]"
        ],
        [
          "object",
          "dict",
          "{\"key\": \"value\"}"
        ]
      ]
    },
    {
      "type": "h2",
      "text": "The requests library"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import requests\n\nurl = \"https://api.openaq.org/v2/latest\"\nparams = {\"city\": \"Los Angeles\", \"limit\": 100}\n\nresp = requests.get(url, params=params)\nprint(resp.status_code)   # 200 means success\nresp.raise_for_status()   # raises an error if not 200\ndata = resp.json()        # parse JSON into Python dict\nprint(type(data))         # dict"
    },
    {
      "type": "callout",
      "variant": "note",
      "html": "The <code>params</code> dict becomes the <code>?city=Los+Angeles&amp;limit=100</code> query string. requests handles URL encoding for you.",
      "title": "Query parameters."
    },
    {
      "type": "h2",
      "text": "Exploring an API response"
    },
    {
      "type": "p",
      "html": "Always inspect the JSON shape before building a DataFrame:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import json\n\n# pretty-print the top level\nprint(data.keys())\nprint(json.dumps(data[\"results\"][0], indent=2)[:500])"
    },
    {
      "type": "h2",
      "text": "JSON to DataFrame with json_normalize"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "records = data[\"results\"]\ndf = pd.json_normalize(records)\ndf.head()"
    },
    {
      "type": "h3",
      "text": "Nested JSON"
    },
    {
      "type": "p",
      "html": "Some APIs nest records inside records. Use <code>record_path</code> and <code>meta</code>:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = pd.json_normalize(\n    data[\"results\"],\n    record_path=\"measurements\",\n    meta=[\"location\", \"city\", \"country\"],\n    errors=\"ignore\"\n)\ndf.head()"
    },
    {
      "type": "h2",
      "text": "AirNow API example"
    },
    {
      "type": "p",
      "html": "AirNow provides current and forecast AQI via a free API key. Register at airnowapi.org."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import os\nimport requests\nimport pandas as pd\n\nAPI_KEY = os.environ.get(\"AIRNOW_API_KEY\")\nurl = \"https://www.airnowapi.org/aq/observation/latLong/current/\"\n\nparams = {\n    \"format\": \"application/json\",\n    \"latitude\": 34.05,\n    \"longitude\": -118.25,\n    \"distance\": 25,\n    \"API_KEY\": API_KEY\n}\n\nresp = requests.get(url, params=params, timeout=30)\nresp.raise_for_status()\nrecords = resp.json()\n\ndf = pd.json_normalize(records)\nprint(df[[\"ParameterName\", \"AQI\", \"DateObserved\"]].head())"
    },
    {
      "type": "h2",
      "text": "USGS Water Services API"
    },
    {
      "type": "p",
      "html": "USGS publishes streamflow and water quality as JSON time series:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "url = \"https://waterservices.usgs.gov/nwis/iv/\"\nparams = {\n    \"format\": \"json\",\n    \"sites\": \"11023000\",       # LA River at Sepulveda Dam\n    \"parameterCd\": \"00060\",    # discharge, cubic feet per second\n    \"period\": \"P7D\"            # past 7 days\n}\n\nresp = requests.get(url, params=params, timeout=30)\nresp.raise_for_status()\nraw = resp.json()\n\n# navigate nested structure\nts = raw[\"value\"][\"timeSeries\"][0][\"values\"][0][\"value\"]\ndf = pd.json_normalize(ts)\ndf[\"dateTime\"] = pd.to_datetime(df[\"dateTime\"])\ndf[\"value\"] = pd.to_numeric(df[\"value\"])\nprint(df.head())"
    },
    {
      "type": "h2",
      "text": "NOAA climate data access"
    },
    {
      "type": "p",
      "html": "NOAA NCEI offers both bulk CSV downloads and a token-based API. For many projects, reading the hosted CSV directly is simpler:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "station = \"USW00023174\"  # Los Angeles Intl Airport\nurl = f\"https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/2024/{station}.csv\"\n\ndf = pd.read_csv(url, parse_dates=[\"DATE\"], na_values=[9999.9, 999.9])\ndf = df.rename(columns={\"DATE\": \"date\", \"TEMP\": \"temp_f\"})\nprint(df[[\"date\", \"temp_f\"]].head())"
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "Avoid f-strings with URLs in shared notebooks if they embed secrets. For public NOAA URLs this is fine; for keyed APIs use environment variables.",
      "title": "URL construction."
    },
    {
      "type": "h2",
      "text": "Climate TRACE bulk downloads"
    },
    {
      "type": "p",
      "html": "Climate TRACE publishes facility-level emissions as CSV downloads — no API needed for many use cases:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df = pd.read_csv(\n    \"climate_trace_oil_gas_facilities.csv\",\n    dtype={\"source_id\": str},\n    na_values=[\"\", \"NA\"]\n)\nprint(df.columns.tolist())\nprint(df.head())"
    },
    {
      "type": "h2",
      "text": "Authentication and API keys"
    },
    {
      "type": "p",
      "html": "Many APIs require a free key. Never hard-code it in a notebook you will share."
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import os\n\napi_key = os.environ[\"AIRNOW_API_KEY\"]\n\n# Colab: use the Secrets panel (key icon) and load with:\n# from google.colab import userdata\n# api_key = userdata.get(\"AIRNOW_API_KEY\")\n\nheaders = {\"X-API-Key\": api_key}\nresp = requests.get(url, headers=headers, params=params)"
    },
    {
      "type": "callout",
      "variant": "warn",
      "html": "Hard-coding a key and pushing to GitHub leaks it to the world. Use environment variables, Colab Secrets, or a <code>.env</code> file listed in <code>.gitignore</code>.",
      "title": "Keep keys secret."
    },
    {
      "type": "h2",
      "text": "Error handling and retries"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import time\n\ndef fetch_with_retry(url, params=None, max_retries=3):\n    for attempt in range(max_retries):\n        try:\n            resp = requests.get(url, params=params, timeout=30)\n            resp.raise_for_status()\n            return resp.json()\n        except requests.RequestException as e:\n            print(f\"Attempt {attempt + 1} failed: {e}\")\n            time.sleep(2 ** attempt)  # exponential backoff\n    raise RuntimeError(\"All retries failed\")"
    },
    {
      "type": "h2",
      "text": "Caching responses"
    },
    {
      "type": "p",
      "html": "While developing, save API responses to disk so you do not re-download on every run:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "import json\nfrom pathlib import Path\n\ncache = Path(\"cache_openaq.json\")\n\nif cache.exists():\n    data = json.loads(cache.read_text())\nelse:\n    resp = requests.get(url, params=params)\n    resp.raise_for_status()\n    data = resp.json()\n    cache.write_text(json.dumps(data))"
    },
    {
      "type": "h2",
      "text": "Pagination: getting more than one page"
    },
    {
      "type": "p",
      "html": "APIs often limit results per request. Loop with an offset or page parameter:"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "all_records = []\noffset = 0\nlimit = 100\n\nwhile True:\n    resp = requests.get(url, params={\"limit\": limit, \"offset\": offset})\n    resp.raise_for_status()\n    batch = resp.json()[\"results\"]\n    if not batch:\n        break\n    all_records.extend(batch)\n    offset += limit\n    time.sleep(0.5)  # be polite\n\ndf = pd.json_normalize(all_records)"
    },
    {
      "type": "h2",
      "text": "Be a good API citizen"
    },
    {
      "type": "list",
      "items": [
        "<strong>Read the docs</strong> for rate limits, required parameters, and response formats.",
        "<strong>Do not hammer</strong> the server — add <code>time.sleep()</code> between calls in loops.",
        "<strong>Cache</strong> responses locally while developing and debugging.",
        "<strong>Handle failures</strong> with <code>raise_for_status()</code>, timeouts, and retries.",
        "<strong>Credit the source</strong> in your reports and README files."
      ]
    },
    {
      "type": "h2",
      "text": "Combining API data with local files"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "live = pd.json_normalize(api_records)\nmeta = pd.read_csv(\"station_metadata.csv\")\n\ncombined = live.merge(meta, on=\"station_id\", how=\"left\")\ncombined.head()"
    },
    {
      "type": "h2",
      "text": "Saving fetched data"
    },
    {
      "type": "code",
      "lang": "python",
      "code": "df.to_csv(\"fetched_aqi.csv\", index=False)\n\n# save raw JSON for reproducibility\nimport json\nwith open(\"raw_response.json\", \"w\") as f:\n    json.dump(data, f, indent=2)"
    },
    {
      "type": "h2",
      "text": "End-to-end workflow"
    },
    {
      "type": "steps",
      "items": [
        "Find the data source in the <a class=\"inline\" href=\"datasets.html\">dataset library</a> or agency docs.",
        "Decide: static file, URL, or API?",
        "If API: register for a key; read the endpoint documentation.",
        "Fetch with <code>requests.get()</code> or <code>pd.read_csv(url)</code>.",
        "Inspect the raw response (JSON keys or CSV head).",
        "Normalise to a DataFrame with <code>pd.json_normalize()</code> or <code>read_csv()</code>.",
        "Apply cleaning from the <a class=\"inline\" href=\"lesson.html?id=data-cleaning\">data cleaning lesson</a>.",
        "Cache or save the result; document the source and retrieval date."
      ]
    },
    {
      "type": "h2",
      "text": "Common mistakes"
    },
    {
      "type": "list",
      "items": [
        "Assuming all API responses have the same JSON shape — always inspect first.",
        "Forgetting <code>timeout=</code> on requests (hangs forever on slow servers).",
        "Not handling HTTP errors (404, 429 rate limit, 500 server error).",
        "Parsing nested JSON with the wrong <code>record_path</code>.",
        "Committing API keys to GitHub."
      ]
    },
    {
      "type": "exercise",
      "title": "Pull live air quality into a table",
      "html": "Using the OpenAQ API (no key required), request the latest measurements for Los Angeles, parse the JSON, normalise the results into a DataFrame, and print the average value per parameter.",
      "hint": "Steps: <code>requests.get</code> with params, <code>.json()</code>, find the records list, <code>pd.json_normalize</code>, then <code>groupby(\"parameter\")[\"value\"].mean()</code>.",
      "solution": {
        "lang": "python",
        "code": "import requests\nimport pandas as pd\n\nresp = requests.get(\n    \"https://api.openaq.org/v2/latest\",\n    params={\"city\": \"Los Angeles\", \"limit\": 100}\n)\nresp.raise_for_status()\nrecords = resp.json()[\"results\"]\n\ndf = pd.json_normalize(records, record_path=\"measurements\", meta=[\"location\"])\nprint(df.groupby(\"parameter\")[\"value\"].mean())",
        "note": "Real API shapes vary. Inspect with print() first, then adjust record_path and meta."
      }
    },
    {
      "type": "exercise",
      "title": "Fetch USGS streamflow for the LA River",
      "html": "Call the USGS instantaneous values API for site 11023000 (discharge, parameter 00060, past 7 days). Parse the nested JSON into a DataFrame with columns dateTime and value. Plot or print the daily mean discharge.",
      "hint": "Navigate <code>raw[\"value\"][\"timeSeries\"][0][\"values\"][0][\"value\"]</code>, then <code>pd.json_normalize</code>, parse dates, convert values to numeric.",
      "solution": {
        "lang": "python",
        "code": "import requests\nimport pandas as pd\n\nresp = requests.get(\n    \"https://waterservices.usgs.gov/nwis/iv/\",\n    params={\"format\": \"json\", \"sites\": \"11023000\", \"parameterCd\": \"00060\", \"period\": \"P7D\"}\n)\nresp.raise_for_status()\nts = resp.json()[\"value\"][\"timeSeries\"][0][\"values\"][0][\"value\"]\n\ndf = pd.json_normalize(ts)\ndf[\"dateTime\"] = pd.to_datetime(df[\"dateTime\"])\ndf[\"value\"] = pd.to_numeric(df[\"value\"])\nprint(df.groupby(df[\"dateTime\"].dt.date)[\"value\"].mean())"
      }
    },
    {
      "type": "exercise",
      "title": "Read NOAA daily temps from a URL and summarise",
      "html": "Load Los Angeles International Airport (station USW00023174) daily summary CSV for 2024 directly from NOAA NCEI. Parse dates, handle missing values (9999.9), and compute the mean, min, and max temperature.",
      "hint": "Use <code>pd.read_csv(url, parse_dates=[\"DATE\"], na_values=[9999.9])</code>. Summary with <code>df[\"TEMP\"].describe()</code> or explicit agg.",
      "solution": {
        "lang": "python",
        "code": "import pandas as pd\n\nurl = \"https://www.ncei.noaa.gov/data/global-summary-of-the-day/access/2024/USW00023174.csv\"\ndf = pd.read_csv(url, parse_dates=[\"DATE\"], na_values=[9999.9, 999.9])\n\nprint(df[\"TEMP\"].describe())\nprint(\"Mean temp (F):\", round(df[\"TEMP\"].mean(), 1))"
      }
    },
    {
      "type": "h2",
      "text": "Recap"
    },
    {
      "type": "list",
      "items": [
        "<code>pd.read_csv()</code> and <code>read_excel()</code> handle local files and URLs.",
        "JSON mirrors Python dicts and lists — inspect keys before normalising.",
        "<code>requests.get(url, params=...)</code> calls REST APIs; <code>.json()</code> parses the response.",
        "<code>pd.json_normalize()</code> flattens nested records into a tidy DataFrame.",
        "Protect API keys, respect rate limits, cache responses, and handle errors gracefully."
      ]
    },
    {
      "type": "callout",
      "variant": "tip",
      "html": "Browse the <a class=\"inline\" href=\"datasets.html\">dataset library</a> — each page lists exactly how to pull that source via file, URL, or API.",
      "title": "Next up."
    }
  ]
};
