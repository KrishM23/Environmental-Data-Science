window.EXPLAINERS = {
  'calenviroscreen': {
    name: 'CalEnviroScreen',
    source: 'CA Office of Environmental Health Hazard Assessment (OEHHA)',
    topic: 'Environmental justice',
    level: 'beginner',
    lede: 'California\u2019s official screening tool for cumulative environmental burden and social vulnerability\u2014at census-tract resolution.',
    dataUrl: 'https://oehha.ca.gov/calenviroscreen',
    docsUrl: 'https://oehha.ca.gov/calenviroscreen/reporting',
    overview: [
      'CalEnviroScreen (CES) combines pollution exposure, environmental effects, population characteristics, and health outcomes into a single percentile score for every census tract in California.',
      'Version 4.0 is the current release. Scores run from 0 to 100, where higher values indicate greater combined burden. Policymakers, researchers, and advocates use CES to prioritize investments under programs like cap-and-trade and SB 535.'
    ],
    why: [
      'If you work on environmental justice in California, CES is the shared vocabulary. It lets you compare neighborhoods on equal footing and connect pollution data to demographics and health.',
      'For a first project, CES is ideal: you can map tracts, rank communities, or join CES scores to your own local data without building an exposure model from scratch.'
    ],
    fields: [
      { name: 'Census tract', desc: 'Geographic unit (GEOID). Join to TIGER/ACS shapefiles for mapping.' },
      { name: 'CES4 score', desc: 'Overall percentile (0\u2013100). Higher = greater cumulative burden.' },
      { name: 'Pollution burden', desc: 'Sub-score from air, water, pesticides, toxics, traffic, and cleanup sites.' },
      { name: 'Population characteristics', desc: 'Asthma, low birth weight, education, poverty, unemployment, linguistic isolation, housing.' },
      { name: 'Indicator percentiles', desc: 'Individual drivers (e.g., PM2.5, diesel, drinking water, lead risk from housing age).' }
    ],
    access: [
      { title: 'Download the dataset', text: 'Go to OEHHA\u2019s CalEnviroScreen page and download the Excel or CSV for CES 4.0 (tract-level).' },
      { title: 'Get boundaries', text: 'Download census tract shapefiles from the US Census TIGER/Line files or California\u2019s GIS portal.' },
      { title: 'Join in your tool', text: 'Merge on tract GEOID in Excel, R, Python (GeoPandas), or QGIS. Confirm both layers use the same tract vintage.' },
      { title: 'Explore visually', text: 'OEHHA hosts an interactive map if you want to sanity-check before downloading.' }
    ],
    questions: [
      'Which census tracts in LA County rank in the top 10% for cumulative burden?',
      'How does pollution burden correlate with poverty or linguistic isolation?',
      'Which indicators drive high scores in a neighborhood you care about?',
      'How do burden scores change between CES versions in the same tract?'
    ],
    tips: [
      'Start with a map of CES4 score by tract, then drill into the top contributing indicators.',
      'Compare tracts within a city rather than raw scores across regions with different baseline pollution.',
      'Pair CES with CalEPA\u2019s disadvantaged communities list for policy-relevant cutoffs.'
    ],
    caveats: [
      'CES is a screening tool, not a measure of individual risk. Tract averages can hide block-level variation.',
      'Scores depend on available statewide data; some local hazards may be missing.',
      'Always cite the CES version and release year in your write-up.'
    ],
    proTip: 'Filter to tracts above the 75th percentile, export a short table of top indicators, and write two paragraphs on why those drivers matter for the community.',
    facts: [
      { label: 'Geography', value: 'California census tracts' },
      { label: 'Format', value: 'CSV, Excel, shapefile (via join)' },
      { label: 'Update cadence', value: 'Every ~3 years (v4.0 current)' },
      { label: 'License', value: 'Public domain (state data)' },
      { label: 'Skill needed', value: 'Spreadsheet or basic GIS' }
    ],
    related: [
      { id: 'epa-airnow', name: 'EPA AirNow' },
      { id: 'ucla-emissions', name: 'UCLA Emissions Reports' }
    ]
  },

  'epa-airnow': {
    name: 'EPA AirNow',
    source: 'U.S. Environmental Protection Agency',
    topic: 'Air quality',
    level: 'beginner',
    lede: 'Official U.S. air-quality observations and forecasts\u2014AQI, PM2.5, ozone, and more from ground monitoring networks.',
    dataUrl: 'https://www.airnow.gov/',
    docsUrl: 'https://docs.airnowapi.org/',
    overview: [
      'AirNow aggregates real-time and historical air quality data from federal, state, local, and tribal monitoring stations across the United States.',
      'The AirNow API returns AQI values, pollutant concentrations, and station metadata in JSON. Historical archives are available for trend analysis and event studies (wildfire smoke, heat waves).'
    ],
    why: [
      'Air quality is one of the most accessible entry points in environmental data science: the units are documented, stations have locations, and results are easy to visualize as time series or maps.',
      'For LA-focused work, AirNow connects classroom analysis to lived experience\u2014smoke days, freeway corridors, and seasonal ozone patterns.'
    ],
    fields: [
      { name: 'AQI', desc: 'Air Quality Index (0\u2013500+). Category labels: Good, Moderate, Unhealthy, etc.' },
      { name: 'PM2.5 / PM10', desc: 'Particulate matter concentrations (\u00b5g/m\u00b3).' },
      { name: 'Ozone (O\u2083)', desc: 'Ground-level ozone, primary summer smog pollutant in LA.' },
      { name: 'NO\u2082', desc: 'Nitrogen dioxide, traffic and combustion marker.' },
      { name: 'Station metadata', desc: 'Latitude, longitude, agency, parameter measured.' }
    ],
    access: [
      { title: 'Request an API key', text: 'Register for a free key at docs.airnowapi.org (required for programmatic access).' },
      { title: 'Query by ZIP or lat/lon', text: 'Use the /aq/observation endpoint for current conditions or /aq/historical for past dates.' },
      { title: 'Download CSV exports', text: 'AirNow.gov also offers file downloads and maps if you prefer not to code first.' },
      { title: 'Plot your series', text: 'Pull 30\u201390 days for one station and chart PM2.5 or AQI over time.' }
    ],
    code: '<span class="cm"># Example: current observation near UCLA (ZIP 90095)</span>\nGET https://www.airnowapi.org/aq/observation/zipCode/current/\n  ?format=application/json&amp;zipCode=90095&amp;distance=25&amp;API_KEY=YOUR_KEY',
    questions: [
      'How did PM2.5 change during a recent wildfire smoke event?',
      'Which LA monitoring sites exceed the AQI \u201cUnhealthy for Sensitive Groups\u201d threshold most often?',
      'Is weekend ozone different from weekday ozone near campus?',
      'How do two neighborhoods compare on fine particulate matter over a month?'
    ],
    tips: [
      'Pick one station near your study area and learn its history before comparing across sites.',
      'AQI is a composite index; for research, often analyze pollutant concentrations directly.',
      'Check for data gaps when instruments go offline during maintenance or fires.'
    ],
    caveats: [
      'Monitor spacing is uneven; rural and some urban blocks are far from the nearest sensor.',
      'AQI formulas vary by pollutant and which standard is binding that day.',
      'API rate limits apply\u2014cache responses for class projects.'
    ],
    proTip: 'Download 60 days from a Westwood-adjacent station, flag days AQI > 100, and link peaks to CAL FIRE or news reports on smoke transport.',
    facts: [
      { label: 'Geography', value: 'United States' },
      { label: 'Format', value: 'JSON API, CSV, web maps' },
      { label: 'Update cadence', value: 'Hourly (varies by station)' },
      { label: 'License', value: 'Public (EPA open data)' },
      { label: 'Skill needed', value: 'API calls or CSV + spreadsheet' }
    ],
    related: [
      { id: 'calenviroscreen', name: 'CalEnviroScreen' },
      { id: 'noaa-climate', name: 'NOAA Climate Data' }
    ]
  },

  'noaa-climate': {
    name: 'NOAA Climate Data',
    source: 'NOAA National Centers for Environmental Information (NCEI)',
    topic: 'Climate',
    level: 'intermediate',
    lede: 'The authoritative U.S. archive for temperature, precipitation, drought, and extreme-weather records\u2014often spanning 100+ years.',
    dataUrl: 'https://www.ncei.noaa.gov/cdo-web/',
    docsUrl: 'https://www.ncei.noaa.gov/support/access-service-users-usernotifications',
    overview: [
      'NOAA\u2019s Climate Data Online (CDO) provides access to GHCN-Daily, Global Historical Climatology Network, and specialized collections used in official climate assessments.',
      'You can search by station, date range, and data type, then download CSV or query via the REST API. Data include daily/monthly temperature, precipitation, snowfall, and degree days.'
    ],
    why: [
      'Climate trend analysis needs long, trusted records. NCEI stations power NOAA/state climate reports and IPCC regional assessments.',
      'Learning to work with station metadata, missing values, and quality flags here transfers directly to research labs and internships.'
    ],
    fields: [
      { name: 'STATION', desc: 'Unique station identifier (join to station catalog for lat/lon, elevation).' },
      { name: 'TMAX / TMIN', desc: 'Daily maximum/minimum temperature (\u00b0C or \u00b0F depending on dataset).' },
      { name: 'PRCP', desc: 'Daily precipitation (mm or inches).' },
      { name: 'DATE', desc: 'Observation date (YYYYMMDD).' },
      { name: 'Quality flags', desc: 'Codes marking estimated, missing, or suspicious values\u2014always read the documentation.' }
    ],
    access: [
      { title: 'Create a free token', text: 'Sign up at the NCEI token page for API access (also works for web downloads).' },
      { title: 'Find a station', text: 'Use the CDO Station Search for your city or county (e.g., Los Angeles USC campus station).' },
      { title: 'Select a dataset', text: 'GHCN-Daily (GHCND) is the usual starting point for daily weather time series.' },
      { title: 'Download or query', text: 'Export CSV from the web UI, or call /data with datasetid=GHCND, stationid, and date range.' }
    ],
    code: '<span class="cm"># Example API request (replace TOKEN and station ID)</span>\nGET https://www.ncei.noaa.gov/cdo-web/api/v2/data\n  ?datasetid=GHCND&amp;stationid=GHCND:USC00049322\n  &amp;startdate=2014-01-01&amp;enddate=2024-12-31\n  &amp;datatypeid=TMAX,TMIN,PRCP\nHeader: token: YOUR_NCEI_TOKEN',
    questions: [
      'Has LA\u2019s annual mean temperature increased over the last 50 years?',
      'Are dry spells getting longer in Southern California?',
      'How does this year\u2019s rainfall compare to the 1991\u20132020 normal?',
      'Which months show the strongest warming trend at a given station?'
    ],
    tips: [
      'Use 30-year climatology baselines (e.g., 1991\u20132020) when reporting \u201cabove normal.\u201d',
      'Filter or flag missing values (often coded as -9999 or empty).',
      'Prefer regional aggregates (county/climate division) if station records have gaps.'
    ],
    caveats: [
      'Station moves, instrument changes, and urban heat effects can introduce jumps\u2014check metadata.',
      'A single station is not a full regional climate signal; note spatial representativeness.',
      'Large requests may need pagination via the API offset parameter.'
    ],
    proTip: 'Compute annual mean TMAX for one LA station, plot with a linear trend line, and cite the station ID and record length in your figure caption.',
    facts: [
      { label: 'Geography', value: 'Global (U.S. stations dense)' },
      { label: 'Format', value: 'CSV, JSON API' },
      { label: 'Update cadence', value: 'Daily to monthly' },
      { label: 'License', value: 'Public domain (U.S. gov)' },
      { label: 'Skill needed', value: 'API or CSV + time-series plots' }
    ],
    related: [
      { id: 'epa-airnow', name: 'EPA AirNow' },
      { id: 'our-world-in-data', name: 'Our World in Data' }
    ]
  },

  'nasa-earthdata': {
    name: 'NASA Earthdata',
    source: 'NASA Earth Science Data Systems',
    topic: 'Satellite & remote sensing',
    level: 'advanced',
    lede: 'The gateway to NASA\u2019s Earth observation archives\u2014MODIS, Landsat, GRACE, and hundreds of other satellite and airborne products.',
    dataUrl: 'https://www.earthdata.nasa.gov/',
    docsUrl: 'https://www.earthdata.nasa.gov/learn/earth-observation-data-basics',
    overview: [
      'NASA Earthdata Search and associated DAACs (Distributed Active Archive Centers) host petabytes of remote sensing data: land surface temperature, vegetation indices, atmospheric composition, ice, oceans, and more.',
      'Products ship as NetCDF, HDF-EOS, GeoTIFF, or HDF5 depending on the mission. Each dataset has a user guide defining grids, units, and quality layers.'
    ],
    why: [
      'Satellite data let you study patterns no ground network covers\u2014wildfire scars, albedo change, drought stress at scale.',
      'Employers in climate, water, and conservation expect familiarity with Earthdata login, metadata, and basic raster workflows.'
    ],
    fields: [
      { name: 'Granule / scene ID', desc: 'Unique file identifier for a swath, tile, or orbit overpass.' },
      { name: 'Science dataset (SDS)', desc: 'Variable inside HDF/NetCDF (e.g., land surface temp, NDVI).' },
      { name: 'QA / QC flags', desc: 'Bit flags marking clouds, snow, or retrieval quality\u2014use them.' },
      { name: 'Projection & grid', desc: 'Sinusoidal, geographic, or UTM\u2014check before mapping.' },
      { name: 'Scale factor & offset', desc: 'Stored integers may need scaling to physical units.' }
    ],
    access: [
      { title: 'Register for Earthdata Login', text: 'Free account at urs.earthdata.nasa.gov\u2014required for most downloads.' },
      { title: 'Search Earthdata Search', text: 'Filter by location, date, and collection (e.g., MOD13Q1 vegetation, MOD11A1 LST).' },
      { title: 'Read the user guide', text: 'Open the DOI-linked algorithm theoretical basis doc before processing.' },
      { title: 'Open in code or GIS', text: 'Use Python (xarray, rasterio, h5py) or QGIS with the Geospatial Data Abstraction Library.' }
    ],
    questions: [
      'How is vegetation greenness changing around a watershed over 20 years?',
      'Can you detect urban heat islands from land surface temperature tiles?',
      'What does post-fire NDVI recovery look like for a named fire perimeter?',
      'How do snow-covered area trends compare across mountain ranges?'
    ],
    tips: [
      'Start with one well-documented MODIS product before jumping to merged multi-sensor collections.',
      'Subset geographically early\u2014full granules are large.',
      'Always apply QA masks; unfiltered optical data over clouds will mislead.'
    ],
    caveats: [
      'File sizes and processing complexity are real; plan storage and compute.',
      'Sensor swaps (e.g., MODIS Terra/Aqua) and algorithm updates cause step changes in long records.',
      'Citation requirements vary by DAAC\u2014check each dataset\u2019s DOI policy.'
    ],
    proTip: 'Download one year of MOD13Q1 NDVI for a single tile covering LA, mask poor quality pixels, and plot the seasonal cycle averaged over open space vs. built-up pixels.',
    facts: [
      { label: 'Geography', value: 'Global' },
      { label: 'Format', value: 'NetCDF, HDF, GeoTIFF' },
      { label: 'Update cadence', value: 'Mission-dependent (hours to years)' },
      { label: 'License', value: 'Free with Earthdata account' },
      { label: 'Skill needed', value: 'Raster GIS or Python xarray' }
    ],
    related: [
      { id: 'icesat-2', name: 'ICESat-2' },
      { id: 'climate-trace', name: 'Climate TRACE' }
    ]
  },

  'icesat-2': {
    name: 'ICESat-2',
    source: 'NASA NSIDC Distributed Active Archive Center',
    topic: 'Cryosphere & altimetry',
    level: 'advanced',
    lede: 'Spaceborne laser altimetry measuring ice sheet elevation, sea ice freeboard, forest canopy height, and terrain at centimeter-scale precision along track.',
    dataUrl: 'https://nsidc.org/data/icesat-2/data',
    docsUrl: 'https://icesat-2.gsfc.nasa.gov/science/data-products',
    overview: [
      'ICESat-2 carries ATLAS, a photon-counting lidar that fires 10,000 laser pulses per second, producing along-track height measurements for ice, water, land, and vegetation.',
      'Standard products (ATL03, ATL06, ATL08, etc.) are distributed as HDF5 through NSIDC. Each product targets a different surface type and processing level.'
    ],
    why: [
      'ICESat-2 is the reference for cryosphere change and emerging forest structure science. Working with its data teaches lidar concepts transferable to airborne and ICESat heritage studies.',
      'UCLA researchers use altimetry for ice sheet mass balance, sea level, and biomass\u2014skills that differentiate advanced student portfolios.'
    ],
    fields: [
      { name: 'ATL03 (geolocated photons)', desc: 'Low-level photon heights with confidence classifications.' },
      { name: 'ATL06 (land ice height)', desc: 'Segmented surface heights over ice sheets and glaciers.' },
      { name: 'ATL08 (land & vegetation)', desc: 'Terrain and canopy heights for land applications.' },
      { name: 'beam / strong-weak', desc: 'Three beam pairs; know which track you are analyzing.' },
      { name: 'Reference ground track (RGT)', desc: 'Repeating orbit pattern\u2014use for change detection.' }
    ],
    access: [
      { title: 'Earthdata Login', text: 'Register at NSIDC/NASA Earthdata (same login as Earthdata Search).' },
      { title: 'Choose a product', text: 'Read the product table: ATL06 for ice sheets, ATL08 for canopy/terrain, ATL10 for sea ice.' },
      { title: 'Subset by region & date', text: 'Use NSIDC Earthdata Search or icepyx (Python) to avoid downloading full orbit files.' },
      { title: 'Apply NSIDC tutorials', text: 'NSIDC Jupyter resources walk through photon classification and height extraction.' }
    ],
    questions: [
      'How much did an ice sheet outlet glacier thin between repeat RGT passes?',
      'What is canopy height variability across a mountain transect?',
      'How does sea ice freeboard vary along a Arctic orbit segment?',
      'Can you detect elevation change after a calving event?'
    ],
    tips: [
      'Use icepyx or NSIDC subsetters before pulling full HDF5 granules.',
      'Learn photon confidence flags\u2014unfiltered photons include noise from clouds and solar background.',
      'Compare repeat tracks on the same RGT for change, not arbitrary cross-overs.'
    ],
    caveats: [
      'Along-track swaths are narrow; not a replacement for gridded DEMs without interpolation.',
      'Processing choices (signal photon selection) strongly affect results.',
      'Advanced product-specific training is essential\u2014do not treat HDF5 as simple CSV.'
    ],
    proTip: 'Follow NSIDC\u2019s ATL08 land tutorial for a small bbox, extract canopy height for 2\u20133 RGT repeats, and report mean change with uncertainty.',
    facts: [
      { label: 'Geography', value: 'Global (polar & targeted land)' },
      { label: 'Format', value: 'HDF5' },
      { label: 'Update cadence', value: 'Continuous mission ops' },
      { label: 'License', value: 'Free with Earthdata account' },
      { label: 'Skill needed', value: 'Python h5py / icepyx' }
    ],
    related: [
      { id: 'nasa-earthdata', name: 'NASA Earthdata' },
      { id: 'noaa-climate', name: 'NOAA Climate Data' }
    ]
  },

  'climate-trace': {
    name: 'Climate TRACE',
    source: 'Climate TRACE Coalition',
    topic: 'Emissions inventory',
    level: 'intermediate',
    lede: 'Independent, facility-level greenhouse gas estimates for power, transport, oil & gas, agriculture, and more\u2014updated frequently and freely downloadable.',
    dataUrl: 'https://climatetrace.org/data',
    docsUrl: 'https://climatetrace.org/about/methodology',
    overview: [
      'Climate TRACE combines satellite observations, ground sensors, and models to estimate CO\u2082, CH\u2084, and other GHGs at the asset and country level.',
      'CSV downloads and an emerging API support sector-specific analysis\u2014power plants, shipping routes, steel mills, rice cultivation, and others.'
    ],
    why: [
      'National inventories lag and smooth over local hotspots. TRACE enables \u201cwho emits where\u201d questions critical for accountability journalism, policy, and ESG research.',
      'Facility-level CSVs are approachable compared to raw satellite L2 products\u2014good bridge to intermediate emissions work.'
    ],
    fields: [
      { name: 'source_id / source_name', desc: 'Facility or asset identifier and label.' },
      { name: 'sector & subsector', desc: 'Power, transportation, manufacturing, agriculture, etc.' },
      { name: 'gas & quantity', desc: 'CO\u2082e or gas-specific mass emissions for a period.' },
      { name: 'lat / lon', desc: 'Georeference for mapping (where available).' },
      { name: 'ownership / country', desc: 'Reporting entity and geography for aggregation.' }
    ],
    access: [
      { title: 'Open the data portal', text: 'Visit climatetrace.org/data and choose sector or country downloads.' },
      { title: 'Pick a sector CSV', text: 'Power is a common starting point\u2014one row per plant with annual emissions.' },
      { title: 'Load and explore', text: 'Import into Python/R; map top emitters; rank by CO\u2082e within a country or radius of LA.' },
      { title: 'Read methodology', text: 'Check uncertainty and data sources for your sector before drawing strong claims.' }
    ],
    questions: [
      'Which power plants near California emit the most CO\u2082 annually?',
      'How do reported TRACE emissions trends compare to state inventory totals?',
      'Which sectors dominate methane in a chosen country?',
      'Are shipping emissions concentrated on specific trade lanes?'
    ],
    tips: [
      'Aggregate carefully\u2014some rows are monthly, others annual; check the schema per file.',
      'Map the top decile of emitters first to understand spatial clustering.',
      'Cross-check a few well-known facilities against EPA eGRID or state data.'
    ],
    caveats: [
      'Model-based estimates carry uncertainty; not a legal inventory for compliance.',
      'Coverage and revision history vary by sector; read release notes.',
      'Beta API endpoints may change\u2014pin download dates for reproducible projects.'
    ],
    proTip: 'Download global power sector CSV, filter to California, plot the top 15 plants by CO\u2082e as a bar chart, and note TRACE\u2019s data vintage in your methods section.',
    facts: [
      { label: 'Geography', value: 'Global' },
      { label: 'Format', value: 'CSV, API (beta)' },
      { label: 'Update cadence', value: 'Regular releases' },
      { label: 'License', value: 'Open data (see site terms)' },
      { label: 'Skill needed', value: 'CSV + mapping' }
    ],
    related: [
      { id: 'ucla-emissions', name: 'UCLA Emissions Reports' },
      { id: 'our-world-in-data', name: 'Our World in Data' }
    ]
  },

  'our-world-in-data': {
    name: 'Our World in Data',
    source: 'Global Change Data Lab / University of Oxford',
    topic: 'Global indicators',
    level: 'beginner',
    lede: 'Curated, citation-ready datasets on CO\u2082, energy, food, biodiversity, and health\u2014cleaned for charts and classroom analysis.',
    dataUrl: 'https://ourworldindata.org/',
    docsUrl: 'https://ourworldindata.org/about/funding',
    overview: [
      'Our World in Data (OWID) publishes interactive charts backed by downloadable CSVs with documented sources (CDIAC, Global Carbon Project, IEA, etc.).',
      'Each topic page links to a GitHub-backed CSV with consistent country-year structure\u2014ideal for first regressions, comparisons, and policy briefs.'
    ],
    why: [
      'OWID removes the hardest parts of global analysis: harmonized country codes, units, and long historical merges.',
      'If you need a compelling chart for a presentation quickly, OWID is the fastest ethical path\u2014with citations built in.'
    ],
    fields: [
      { name: 'Entity / Code', desc: 'Country, region, or label plus ISO code where applicable.' },
      { name: 'Year', desc: 'Observation year (annual for most series).' },
      { name: 'Indicator column(s)', desc: 'Named variable (e.g., co2_per_capita, share_of_renewables).' },
      { name: 'Source note', desc: 'Embedded in dataset documentation on each topic page.' }
    ],
    access: [
      { title: 'Find your topic', text: 'Search owid.org for CO\u2082, energy mix, deforestation, or disasters.' },
      { title: 'Download CSV', text: 'Use the \u201cData\u201d tab on the chart or the linked GitHub csv file.' },
      { title: 'Filter entities', text: 'Subset countries or compare US vs. EU vs. global South cohorts.' },
      { title: 'Cite properly', text: 'Credit Our World in Data and the underlying primary source in your figure notes.' }
    ],
    questions: [
      'How does per-capita CO\u2082 differ across countries over the last 50 years?',
      'Which nations decoupled GDP growth from emissions earliest?',
      'How fast is renewable electricity share rising globally?',
      'How do disaster death rates trend by region?'
    ],
    tips: [
      'Use log scales for skewed emissions series when comparing many countries.',
      'Watch for missing early-year data in small states\u2014annotate sample sizes.',
      'Download directly from OWID GitHub for reproducible URLs in coursework.'
    ],
    caveats: [
      'Aggregates hide within-country inequality\u2014pair with local data when possible.',
      'Updates can revise historical values when primary sources restate data.',
      'Not a substitute for primary agency data in legal or regulatory work.'
    ],
    proTip: 'Recreate one OWID chart from raw CSV in Python or R, then add a second variable (e.g., GDP) to test an environmental Kuznets curve hypothesis.',
    facts: [
      { label: 'Geography', value: 'Global' },
      { label: 'Format', value: 'CSV' },
      { label: 'Update cadence', value: 'Varies by topic' },
      { label: 'License', value: 'CC BY (check each chart)' },
      { label: 'Skill needed', value: 'Spreadsheet or intro plotting' }
    ],
    related: [
      { id: 'climate-trace', name: 'Climate TRACE' },
      { id: 'noaa-climate', name: 'NOAA Climate Data' }
    ]
  },

  'data-rescue-project': {
    name: 'Data Rescue Project Portal',
    source: 'Data Rescue Project',
    topic: 'Data catalog & preservation',
    level: 'intermediate',
    lede: 'A searchable catalog of ~3,000 preserved U.S. government datasets with archive links, metadata, and migration notes when sources move or go offline.',
    dataUrl: 'https://portal.datarescueproject.org/',
    docsUrl: 'https://www.datarescueproject.org/about',
    overview: [
      'The Data Rescue Project (DRP) documents federal environmental and social datasets at risk of link rot or removal, pointing to copies on DataLumos, Internet Archive, and agency mirrors.',
      'Use it when a professor, paper, or old syllabus cites a dataset URL that no longer loads\u2014or to discover niche EPA, NOAA, USGS collections not obvious from agency homepages.'
    ],
    why: [
      'Reproducibility depends on finding data years later. DRP is infrastructure for researchers tracking policy shifts and archive migrations.',
      'Browsing DRP also teaches how federal data is organized by agency and theme.'
    ],
    fields: [
      { name: 'Title & agency', desc: 'Original publishing body (EPA, NOAA, DOE, etc.).' },
      { name: 'Archive links', desc: 'DataLumos, Wayback, or agency redirect URLs.' },
      { name: 'Status notes', desc: 'Whether the dataset moved, was discontinued, or partially restored.' },
      { name: 'Topics & tags', desc: 'Climate, water, health, energy for filtering.' }
    ],
    access: [
      { title: 'Search the portal', text: 'Use keywords (e.g., \u201cToxics Release,\u201d \u201cGHG,\u201d \u201cwatershed\u201d) at portal.datarescueproject.org.' },
      { title: 'Follow archive links', text: 'Open the listed mirror; confirm file format and vintage match your citation needs.' },
      { title: 'Document provenance', text: 'In projects, cite both the original agency and the DRP/archive copy you used.' },
      { title: 'Cross-check live agency sites', text: 'Sometimes data returns to a new URL\u2014verify against the current agency catalog when possible.' }
    ],
    questions: [
      'Where did a discontinued EPA dataset move?',
      'Which archived collections cover my county or river basin?',
      'What federal climate indicators were preserved in a given year?',
      'How complete is the archive compared to the original portal?'
    ],
    tips: [
      'Save a local copy once you find a working archive link\u2014do not rely on mirrors alone for thesis work.',
      'Pair DRP hits with USGS or NOAA current catalogs to see if a newer version exists.',
      'Use DRP metadata to write a short data provenance paragraph (high marks in methods sections).'
    ],
    caveats: [
      'Archives may freeze data at a snapshot date; not always the latest release.',
      'Not every federal dataset is cataloged; absence does not mean data is lost.',
      'Verify file integrity (row counts, checksums) after download from third-party mirrors.'
    ],
    proTip: 'Pick one broken link from an old syllabus, locate it in DRP, download the archive, and write a 3-sentence provenance note for a methods appendix.',
    facts: [
      { label: 'Geography', value: 'Primarily United States' },
      { label: 'Format', value: 'Catalog metadata + varied archives' },
      { label: 'Update cadence', value: 'Ongoing community updates' },
      { label: 'License', value: 'Varies by underlying dataset' },
      { label: 'Skill needed', value: 'Web search + metadata literacy' }
    ],
    related: [
      { id: 'usgs-all-data', name: 'USGS All Data' },
      { id: 'noaa-climate', name: 'NOAA Climate Data' }
    ]
  },

  'usgs-all-data': {
    name: 'USGS All Data',
    source: 'U.S. Geological Survey',
    topic: 'Multi-theme catalog',
    level: 'intermediate',
    lede: 'The master index to USGS data releases\u201416,000+ products spanning water, ecosystems, hazards, geology, and climate-related science.',
    dataUrl: 'https://www.usgs.gov/products/data/all-data',
    docsUrl: 'https://www.usgs.gov/products/data/data-releases',
    overview: [
      'USGS ScienceBase and the Data Releases catalog organize official USGS datasets with DOIs, metadata, and download packages.',
      'Unlike a single API, this portal helps you discover themed collections: national hydrography, earthquake catalogs, land cover, mineral resources, and biological monitoring.'
    ],
    why: [
      'USGS underpins American water, geologic hazard, and ecosystem science. Learning the catalog saves hours versus random web searching.',
      'Many UCLA-adjacent projects (fires, slides, coastal erosion, LA River) have USGS data releases with citable DOIs.'
    ],
    fields: [
      { name: 'Data release title', desc: 'Official USGS publication name with authors and abstract.' },
      { name: 'DOI', desc: 'Persistent identifier for citation (required in papers).' },
      { name: 'Theme tags', desc: 'Water, ecosystems, energy, minerals, etc.' },
      { name: 'Spatial extent', desc: 'Bounding box or region in metadata.' },
      { name: 'Attached files', desc: 'CSV, GeoTIFF, shapefile, or PDF supplements.' }
    ],
    access: [
      { title: 'Open All Data search', text: 'Visit usgs.gov/products/data/all-data and filter by topic or keyword.' },
      { title: 'Read the abstract', text: 'Confirm geographic coverage, years, and file list before downloading.' },
      { title: 'Download & cite DOI', text: 'Use the provided DOI in references; note release version/date.' },
      { title: 'Link to live APIs where noted', text: 'Some releases point to NWIS or other APIs for continuous updates.' }
    ],
    questions: [
      'What USGS datasets exist for Southern California wildfire or landslide risk?',
      'Which data releases cover groundwater in the Central Valley?',
      'How do I cite a USGS dataset in APA or Chicago format?',
      'What themed collections updated in the last year?'
    ],
    tips: [
      'Search both \u201cdata release\u201d and program names (e.g., 3D Elevation Program, Gap Analysis).',
      'ScienceBase pages list contact emails\u2014reach out if metadata is unclear.',
      'Prefer DOI releases over unstructured FTP folders when both exist.'
    ],
    caveats: [
      'Catalog search can overwhelm; narrow by theme and date early.',
      'Static releases may lag operational APIs (especially water gauges).',
      'Some downloads are large geospatial mosaics\u2014check disk space.'
    ],
    proTip: 'Find one USGS data release with a DOI for your topic, download the smallest CSV attachment, and draft a complete citation block for your bibliography.',
    facts: [
      { label: 'Geography', value: 'United States (+ some global)' },
      { label: 'Format', value: 'CSV, GeoTIFF, shapefile, PDF' },
      { label: 'Update cadence', value: 'Per release' },
      { label: 'License', value: 'Public domain (USGS)' },
      { label: 'Skill needed', value: 'Catalog search + metadata' }
    ],
    related: [
      { id: 'usgs-water', name: 'USGS Water Data' },
      { id: 'data-rescue-project', name: 'Data Rescue Project' }
    ]
  },

  'ucla-emissions': {
    name: 'UCLA Emissions Reports',
    source: 'UCLA Sustainability / UC Office of the President',
    topic: 'Campus emissions',
    level: 'beginner',
    lede: 'Third-party verified UCLA greenhouse gas inventories (Scopes 1\u20133) published through UC Annual Sustainability Reports.',
    dataUrl: 'https://www.sustain.ucla.edu/climate-and-energy/',
    docsUrl: 'https://sustainabilityreport.ucop.edu/',
    overview: [
      'UCLA reports calendar-year GHG emissions across Scope 1 (on-campus combustion), Scope 2 (purchased electricity), and Scope 3 (commute, air travel, waste, and related sources).',
      'Terrain\u2019s carbon tracker uses verified totals from UC\u2019s official inventory spreadsheet and compares them to the University of California\u2019s current policy: 90% reduction from 2019 levels by 2045.'
    ],
    why: [
      'Campus data makes climate policy tangible. You can connect university commitments to charts students see every day\u2014cogeneration, commutes, renewable power.',
      'Local inventories teach scopes, baselines, and verification\u2014concepts that transfer directly to city, corporate, and state climate plans.'
    ],
    fields: [
      { name: 'Scope 1 net emissions', desc: 'Campus fuels and cogeneration (metric tons CO\u2082e).' },
      { name: 'Scope 2 emissions', desc: 'Purchased electricity (location- or market-based per report).' },
      { name: 'Scope 3 emissions', desc: 'Commute, business travel, waste, and other indirect sources tracked by UC.' },
      { name: 'Compliance offsets', desc: 'Purchased offsets reported separately from gross scopes in UC charts.' },
      { name: '2019 baseline', desc: '335,331 t CO\u2082e total (Scopes 1+2+3)\u2014UC policy reference year.' }
    ],
    access: [
      { title: 'Open UC Annual Reports', text: 'Go to sustainabilityreport.ucop.edu and select the UCLA location page for each year.' },
      { title: 'Read the emissions chart', text: 'Scope 1/2/3 values appear in the Climate Protection section with third-party verification notes.' },
      { title: 'Use Terrain\u2019s tracker', text: 'See index.html#tracker for the latest verified series and commitment comparison.' },
      { title: 'Download UCLA PDFs', text: 'Third-party verified GHG reports are linked from sustain.ucla.edu/climate-and-energy/.' }
    ],
    questions: [
      'Is UCLA on pace for UC\u2019s 90%-by-2045 emissions target?',
      'Which scope drives most emissions post-COVID return to campus?',
      'How did commute emissions change between 2019 and 2023?',
      'How do UCLA totals compare to other UC campuses?'
    ],
    tips: [
      'Sum Scope 1+2+3 for totals; do not mix gross scopes with offset accounting without reading footnotes.',
      'Note methodology changes (e.g., expanded Scope 3 categories) when comparing years.',
      'Pair emissions trends with UC report narrative on energy projects (LADWP solar, efficiency).'
    ],
    caveats: [
      'Latest calendar year may still be in verification at report publication time.',
      'Health system and campus boundaries are included\u2014read scope definitions each year.',
      'Policy shifted in 2023; the old 2025 carbon-neutrality pledge is superseded.'
    ],
    proTip: 'Recreate Terrain\u2019s 2015\u20132023 chart from UC data, then write a short memo on whether UCLA is above or below the linear path to 2045.',
    facts: [
      { label: 'Geography', value: 'UCLA campus + health system' },
      { label: 'Format', value: 'Report charts, PDF inventories' },
      { label: 'Update cadence', value: 'Annual (calendar year)' },
      { label: 'License', value: 'Public reporting' },
      { label: 'Skill needed', value: 'Spreadsheet + trend plots' }
    ],
    related: [
      { id: 'climate-trace', name: 'Climate TRACE' },
      { id: 'calenviroscreen', name: 'CalEnviroScreen' }
    ]
  },

  'usgs-water': {
    name: 'USGS Water Data',
    source: 'U.S. Geological Survey',
    topic: 'Hydrology',
    level: 'intermediate',
    lede: 'National Water Information System (NWIS) streamflow, groundwater, and water-quality measurements from gauges and wells nationwide.',
    dataUrl: 'https://waterdata.usgs.gov/nwis',
    docsUrl: 'https://help.waterdata.usgs.gov/',
    overview: [
      'NWIS is the operational heart of U.S. surface-water monitoring\u2014daily discharge at gages, groundwater levels, and discrete water-quality samples.',
      'The Water Data for the Nation site and NWIS API deliver instantaneous and daily values suitable for drought analysis, flood frequency, and watershed studies.'
    ],
    why: [
      'Water data links climate stress to policy: drought curtailments, LA River flows, Sierra snowpack melt, and groundwater overdraft all show up in NWIS records.',
      'APIs and consistent site IDs make NWIS a standard skill for hydrology, civil engineering, and environmental science students.'
    ],
    fields: [
      { name: 'Site ID (site_no)', desc: '8-digit USGS gage identifier\u2014use in API calls and citations.' },
      { name: '00060', desc: 'Discharge, cubic feet per second (streamflow parameter code).' },
      { name: '00065', desc: 'Gage height, feet.' },
      { name: '62614 / GW levels', desc: 'Groundwater depth below land surface (site-specific codes).' },
      { name: 'Water-quality parms', desc: 'Temperature, nutrients, metals\u2014vary by sampling program.' }
    ],
    access: [
      { title: 'Find a site', text: 'Use the map at waterdata.usgs.gov or search by state, county, and site type.' },
      { title: 'Check parameter availability', text: 'Open Site Information to see which codes (00060, etc.) exist and for which date range.' },
      { title: 'Download or API', text: 'Export daily values as CSV or query waterservices.usgs.gov/nwis/dv/ with sites, startDT, endDT, parameterCd.' },
      { title: 'Plot discharge hydrograph', text: 'Chart daily mean flow for one water year; mark drought or storm periods.' }
    ],
    code: '<span class="cm"># Example: daily discharge for a site (parameter 00060)</span>\nGET https://waterservices.usgs.gov/nwis/dv/\n  ?format=json&amp;sites=01646500\n  &amp;parameterCd=00060&amp;startDT=2023-01-01&amp;endDT=2023-12-31',
    questions: [
      'How low did LA-area streamflow get during the last drought?',
      'Which months carry the highest discharge in a coastal Southern California watershed?',
      'Is groundwater depth trending downward at a monitored well?',
      'How did a atmospheric river show up in the hydrograph?'
    ],
    tips: [
      'Always record site name, drainage area, and datum in your methods\u2014gages differ widely.',
      'Use daily mean (dv) for trends; instantaneous (iv) for flood peak timing.',
      'Provisional data may be revised; note retrieval date in coursework.'
    ],
    caveats: [
      'Gages go offline during damage or low-flow conditions; gaps are common.',
      'Urban storm drains and modified channels alter natural flow regimes\u2014interpret carefully.',
      'Water-quality samples are sparse compared to continuous flow.'
    ],
    proTip: 'Pick the USGS gage closest to your study watershed, pull five years of daily discharge, shade drought years, and summarize flow duration in a one-page brief.',
    facts: [
      { label: 'Geography', value: 'United States' },
      { label: 'Format', value: 'JSON/CSV API, web UI' },
      { label: 'Update cadence', value: '15 min to daily' },
      { label: 'License', value: 'Public domain (USGS)' },
      { label: 'Skill needed', value: 'API or CSV + hydrographs' }
    ],
    related: [
      { id: 'usgs-all-data', name: 'USGS All Data' },
      { id: 'noaa-climate', name: 'NOAA Climate Data' }
    ]
  }
};
