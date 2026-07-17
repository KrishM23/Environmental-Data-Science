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

function buildGeospatial() {
  const c = [];
  c.push(p('Geospatial analysis treats location as data you can compute with: distances, overlaps, containment, neighbourhoods. With GeoPandas (Python) and sf (R) you work in familiar tables plus a geometry column. This lesson covers census tracts, monitoring stations, and emitter facilities across LA and California.'));
  c.push(callout('note', 'Vector first.', 'This lesson focuses on vector data — points, lines, polygons. Gridded satellite rasters are covered in the gridded-remote-sensing lesson.'));

  c.push(h2('Vector geometries'));
  c.push(table(['Geometry', 'Represents', 'Environmental example'], [
    ['Point', 'Single location', 'AQI station, factory stack'],
    ['LineString', 'Path', 'River, transmission line'],
    ['Polygon', 'Area', 'Census tract, county, watershed']
  ]));
  c.push(code('python', 'import geopandas as gpd\ntracts = gpd.read_file("la_tracts.geojson")\nprint(tracts.crs)\ntracts.head()\ntracts.plot(edgecolor="gray", facecolor="none")'));

  c.push(h2('GeoDataFrames'));
  c.push(p('A <strong>GeoDataFrame</strong> is a pandas DataFrame with a special geometry column. Every spatial operation respects that column.'));
  c.push(code('python', 'type(tracts)          # GeoDataFrame\ntracts.geometry.type.value_counts()\ntracts[["geoid", "population", "geometry"]].head()'));
  c.push(code('r', 'library(sf)\ntracts <- st_read("la_tracts.geojson")\nhead(tracts)'));

  c.push(h2('Coordinate reference systems'));
  c.push(p('A <strong>CRS</strong> defines what coordinates mean. EPSG:4326 (lat/lon degrees) is standard for storage and web maps. It is wrong for measuring distance — degrees are not constant length.'));
  c.push(code('python', 'print(tracts.crs)  # often EPSG:4326\ntracts_m = tracts.to_crs(epsg=3310)  # California Albers, metres\ntracts_m["area_km2"] = tracts_m.area / 1e6'));
  c.push(callout('warn', 'The number one geospatial bug.', 'Measuring in degrees gives nonsense. Two layers in different CRSs will not align. Confirm .crs on every layer; reproject to match; use metre CRS before distance or area.'));

  c.push(h2('Reprojecting in R'));
  c.push(code('r', 'tracts_m <- st_transform(tracts, 3310)\nst_area(tracts_m) / 1e6  # km2'));
  c.push(table(['CRS', 'Units', 'Use for'], [
    ['EPSG:4326', 'Degrees', 'Storage, Folium, GeoJSON'],
    ['EPSG:3310', 'Metres', 'California area and distance'],
    ['EPSG:3857', 'Metres', 'Web tiles (approximate)']
  ]));

  c.push(h2('Loading common formats'));
  c.push(list([
    '<strong>GeoJSON:</strong> text-based, web-friendly — census tracts, city boundaries.',
    '<strong>Shapefile:</strong> legacy standard — many government downloads.',
    '<strong>GeoPackage:</strong> single-file replacement for shapefiles.',
    '<strong>Parquet:</strong> fast columnar — increasingly common at scale.'
  ]));
  c.push(code('python', 'stations = gpd.read_file("la_aqi_stations.geojson")\nfacilities = gpd.read_file("ca_emitters.geojson")'));

  c.push(h2('Plotting maps'));
  c.push(code('python', 'import matplotlib.pyplot as plt\nfig, ax = plt.subplots(figsize=(8, 8))\ntracts.plot(ax=ax, column="diesel_pm", cmap="YlOrRd", legend=True,\n            edgecolor="white", linewidth=0.2)\nstations.plot(ax=ax, color="blue", markersize=8)'));
  c.push(code('r', 'library(ggplot2)\nggplot(tracts) +\n  geom_sf(aes(fill = diesel_pm), color = NA) +\n  scale_fill_viridis_c()'));

  c.push(h2('Creating geometries from coordinates'));
  c.push(p('Tables with lat/lon columns become point GeoDataFrames with GeoSeries or st_as_sf.'));
  c.push(code('python', 'from shapely.geometry import Point\ngdf = gpd.GeoDataFrame(\n    df,\n    geometry=[Point(lon, lat) for lon, lat in zip(df.lon, df.lat)],\n    crs="EPSG:4326"\n)'));
  c.push(code('r', 'pts <- st_as_sf(df, coords = c("lon", "lat"), crs = 4326)'));

  c.push(h2('Spatial joins'));
  c.push(p('A <strong>spatial join</strong> attaches attributes by location — which tract contains each station? Which facilities fall in each county?'));
  c.push(code('python', 'stations_m = stations.to_crs(tracts.crs)\ntagged = gpd.sjoin(stations_m, tracts, predicate="within")\ntagged.groupby("geoid")["station_id"].count()'));
  c.push(code('r', 'joined <- st_join(stations, tracts, join = st_within)'));
  c.push(callout('note', 'Predicates matter.', 'within, contains, intersects, touches — choosing the right predicate is the heart of a spatial join. within requires the point inside the polygon; intersects is looser.'));

  c.push(h3('Join types'));
  c.push(list([
    '<strong>Point in polygon:</strong> tag stations with tract demographics.',
    '<strong>Polygon overlap:</strong> which tracts touch a buffer zone?',
    '<strong>Nearest:</strong> closest station to each tract centroid — use sjoin_nearest.'
  ]));
  c.push(code('python', 'nearest = gpd.sjoin_nearest(tracts_m.set_geometry(tracts_m.centroid),\n                              stations_m, distance_col="dist_m")'));

  c.push(h2('Buffers and proximity'));
  c.push(p('A <strong>buffer</strong> expands geometry by a distance. Buffer emitters by 1 km, then find intersecting tracts — who lives near major pollution sources?'));
  c.push(code('python', 'fac_m = facilities.to_crs(epsg=3310)\nfac_m["buffer_1km"] = fac_m.buffer(1000)\nfac_buf = fac_m.set_geometry("buffer_1km")\nnear = gpd.sjoin(tracts_m, fac_buf, predicate="intersects")'));
  c.push(callout('warn', 'Buffer in metres.', 'buffer(1000) means 1000 metres only after reprojecting to a metre CRS. In EPSG:4326, 1000 means degrees — enormous.'));

  c.push(h2('Distance calculations'));
  c.push(code('python', 'from shapely.ops import nearest_points\np = stations_m.geometry.iloc[0]\ndistances = tracts_m.centroid.distance(p)\ndistances.min()  # metres in projected CRS'));
  c.push(code('r', 'st_distance(stations[1,], tracts)'));

  c.push(h2('Clipping to a region'));
  c.push(p('Clip layers to LA County or a study bbox to speed plots and analysis.'));
  c.push(code('python', 'la_bbox = tracts.total_bounds  # minx, miny, maxx, maxy\nfac_la = gpd.clip(facilities.to_crs(tracts.crs), tracts)'));

  c.push(h2('Dissolve and aggregate'));
  c.push(p('Dissolve merges polygons by an ID — tract to district, parcel to zip — summing population or averaging burden scores.'));
  c.push(code('python', 'districts = tracts_m.dissolve(by="supervisor_district", aggfunc={"population": "sum", "diesel_pm": "mean"})'));
  c.push(code('r', 'districts <- tracts %>%\n  group_by(supervisor_district) %>%\n  summarise(pop = sum(population), diesel = mean(diesel_pm)) %>%\n  st_union()'));

  c.push(h2('Choropleth preparation'));
  c.push(p('Spatial join point counts to tract polygons, merge on geoid, plot — the analytical half of a choropleth map.'));
  c.push(code('python', 'counts = tagged.groupby("geoid").size().rename("n_stations")\nchoro = tracts.merge(counts, on="geoid", how="left").fillna(0)\nchoro.plot(column="n_stations", cmap="Blues", legend=True)'));
  c.push(callout('tip', 'Join key hygiene.', 'geoid 6037000100 vs "06037000100" — strings and ints must match. Strip whitespace; zero-pad FIPS codes.'));

  c.push(h2('Point maps vs choropleths'));
  c.push(list([
    '<strong>Point map:</strong> exact locations — stations, facilities.',
    '<strong>Choropleth:</strong> shaded areas — tract burden, county emissions.',
    '<strong>Hexbin / kernel:</strong> dense points — alternative when choropleths mislead.'
  ]));
  c.push(p('Choropleths on large tracts can hide hotspots. Pair with point layers when possible.'));

  c.push(h2('Interactive maps with Folium'));
  c.push(code('python', 'import folium\nm = folium.Map(location=[34.05, -118.24], zoom_start=9)\nfolium.Choropleth(geo_data=choro.__geo_interface__,\n    data=choro, columns=["geoid", "diesel_pm"], key_on="feature.properties.geoid",\n    fill_color="YlOrRd").add_to(m)'));

  c.push(h2('sf in R: spatial verbs'));
  c.push(code('r', 'library(dplyr)\nnear_tracts <- tracts %>%\n  mutate(cent = st_centroid(geometry)) %>%\n  st_join(facilities %>% st_buffer(dist = 1000), join = st_intersects)'));

  c.push(h2('Census tract analysis workflow'));
  c.push(steps([
    'Load tract polygons and confirm CRS.',
    'Load facility or station points; reproject to match.',
    'Spatial join or buffer + intersect.',
    'Aggregate population or burden in affected tracts.',
    'Map and report with units (people, tracts, km).'
  ]));

  c.push(h2('Population-weighted exposure'));
  c.push(p('Counting tracts treats sparse desert equal to dense urban. Weight by population for people-near-source estimates.'));
  c.push(code('python', 'exposed_pop = near.groupby("geoid")["population"].first().sum()\ntotal_pop = tracts_m["population"].sum()\nprint("fraction exposed:", exposed_pop / total_pop)'));

  c.push(h2('Topology and validity'));
  c.push(p('Invalid polygons (self-intersections) break some operations. buffer(0) in shapely often repairs; st_make_valid in sf.'));
  c.push(code('python', 'tracts["geometry"] = tracts.geometry.buffer(0)'));
  c.push(code('r', 'tracts <- st_make_valid(tracts)'));

  c.push(h2('Writing spatial outputs'));
  c.push(code('python', 'choro.to_file("la_stations_per_tract.geojson", driver="GeoJSON")\nnear.to_parquet("tracts_near_emitters.parquet")'));

  c.push(h2('Common mistakes'));
  c.push(list([
    'Plotting lon/lat without setting CRS.',
    'Buffering in degrees.',
    'Spatial join without matching CRS.',
    'Mismatched join keys on choropleth.',
    'Confusing centroid of tract with population centroid.'
  ]));

  c.push(exercise(
    'Who lives near emitters?',
    'Load facility points and LA census tracts. Reproject to EPSG:3310, buffer facilities 1 km, find tracts intersecting buffers. How many tracts? What total population? Compare to county total.',
    'Order: match CRS, buffer(1000), sjoin intersects, sum population.',
    { lang: 'python', code: 'tracts = gpd.read_file("la_tracts.geojson")\nfac = gpd.read_file("ca_emitters.geojson")\nt_m = tracts.to_crs(3310)\nf_m = fac.to_crs(3310)\nf_m["buf"] = f_m.buffer(1000)\nbuf = f_m.set_geometry("buf")\nnear = gpd.sjoin(t_m, buf, predicate="intersects")\nprint("tracts:", near["geoid"].nunique())\nprint("population:", near.drop_duplicates("geoid")["population"].sum())', note: 'Deduplicate tracts before summing population — sjoin can duplicate rows per facility.' }
  ));

  c.push(exercise(
    'Tag stations with tract demographics',
    'Spatial join AQI stations to tracts. Compute mean tract diesel_pm for stations in coastal vs inland regions (use a region column on tracts). Map stations coloured by tract median income.',
    'sjoin within; groupby region; merge attributes back to points for plotting.',
    { lang: 'python', code: 'st = gpd.read_file("la_aqi_stations.geojson").to_crs(tracts.crs)\ntagged = gpd.sjoin(st, tracts, predicate="within")\nprint(tagged.groupby("coast_inland")["diesel_pm"].mean())\ntagged.plot(column="median_income", cmap="viridis", legend=True)', note: 'Station inherits tract attributes via join — verify no stations fall outside all polygons (orphans).' }
  ));

  c.push(exercise(
    'District-level aggregation in R',
    'Using sf: dissolve tracts to supervisor districts, sum population, mean diesel burden, plot choropleth. Which district has highest mean diesel PM?',
    'group_by district + summarise + st_union or dissolve equivalent.',
    { lang: 'r', code: 'library(sf)\nlibrary(dplyr)\ntracts <- st_read("la_tracts.geojson") %>% st_transform(3310)\ndist <- tracts %>%\n  group_by(supervisor_district) %>%\n  summarise(pop = sum(population), diesel = mean(diesel_pm), .groups = "drop") %>%\n  st_union(by = supervisor_district)\nggplot(dist) + geom_sf(aes(fill = diesel)) + scale_fill_viridis_c()', note: 'District means treat each tract equally unless you weight by population — state your choice.' }
  ));

  c.push(h2('Recap'));
  c.push(list([
    'Vector data = points, lines, polygons in a GeoDataFrame geometry column.',
    'Know your CRS; reproject to metres before measuring.',
    'Spatial joins attach data by location using predicates.',
    'Buffers answer proximity questions; aggregate for choropleths.',
    'Validate geometry, match join keys, weight by population when reporting exposure.'
  ]));

  return {
    title: 'Geospatial analysis',
    track: 'geo', tool: 'Both', level: 'advanced', time: '~6-8 hrs',
    lede: 'Geospatial analysis treats location as data you can compute with. This comprehensive lesson covers CRS, spatial joins, buffers, and census-tract workflows in Python and R — turning "which communities are within 1 km of a refinery?" into reproducible code.',
    learn: [
      'Understand vector geometry: points, lines, polygons',
      'Work with coordinate reference systems and reprojection',
      'Load and plot spatial data with GeoPandas and sf',
      'Run spatial joins, buffers, and distance queries',
      'Aggregate by area and prepare choropleth data'
    ],
    prereqs: [{ id: 'pandas', label: 'pandas' }, { id: 'maps', label: 'Making maps' }],
    resources: [
      { name: 'GeoPandas user guide', url: 'https://geopandas.org/en/stable/docs/user_guide.html', kind: 'docs' },
      { name: 'Automating GIS Processes', url: 'https://autogis-site.readthedocs.io/', kind: 'course' },
      { name: 'epsg.io (find a CRS)', url: 'https://epsg.io/', kind: 'tool' }
    ],
    unlock: { label: 'Track California\u2019s emitters', url: 'projects.html', blurb: 'Find which census tracts sit near major emitters using real spatial joins.' },
    content: c
  };
}

module.exports = { buildGeospatial };
