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

function buildGridded() {
  const c = [];
  c.push(p('Satellites and climate models deliver data as grids: temperature, rainfall, or surface reflectance at every cell across space, often stacked through time. This raster world uses xarray, rioxarray, and rasterio — different from GeoPandas vectors. Once it clicks, NASA Earthdata, ERA5 reanalysis, and Landsat scenes become workable.'));
  c.push(callout('note', 'Python-focused.', 'This lesson uses Python xarray ecosystem. R stars and terra are excellent alternatives; concepts transfer directly.'));

  c.push(h2('Raster vs vector'));
  c.push(table(['', 'Vector', 'Raster'], [
    ['Stores', 'Points, lines, polygons', 'Grid of cells (pixels)'],
    ['Good for', 'Boundaries, facility locations', 'Continuous fields — temp, NDVI'],
    ['Tools', 'GeoPandas, sf', 'xarray, rioxarray, rasterio'],
    ['Formats', 'GeoJSON, Shapefile', 'NetCDF, GeoTIFF, Zarr']
  ]));
  c.push(p('A raster is like a digital photo where each pixel holds a measurement — not a colour. Multi-band imagery has one grid per wavelength; climate files add a time dimension.'));

  c.push(h2('xarray: labelled N-D arrays'));
  c.push(p('Gridded climate data is multi-dimensional: value by (time, latitude, longitude). <strong>xarray</strong> is pandas for N-dimensional data — named dimensions and coordinate labels.'));
  c.push(code('python', 'import xarray as xr\nds = xr.open_dataset("era5_western_temp.nc")\nprint(ds)\ntemp = ds["t2m"]  # 2-metre temperature DataArray'));
  c.push(list([
    '<strong>Dataset:</strong> container of multiple variables sharing dimensions.',
    '<strong>DataArray:</strong> one variable with dims and coords.',
    '<strong>Dimension:</strong> time, latitude, longitude, band.',
    '<strong>Coordinate:</strong> actual label values along each dim.'
  ]));

  c.push(h2('Inspecting a NetCDF'));
  c.push(code('python', 'print(ds.dims)\nprint(ds.coords)\nprint(ds["t2m"].attrs)  # units, long_name\nprint(temp.shape)'));
  c.push(callout('tip', 'Read attributes.', 'attrs often hold units (K vs C), missing value codes, and source documentation. Convert Kelvin to Celsius once at load if needed.'));

  c.push(h2('Opening GeoTIFF with rioxarray'));
  c.push(p('Satellite scenes are often GeoTIFF — bands x y, sometimes with georeferencing embedded.'));
  c.push(code('python', 'import rioxarray as rxr\nimg = rxr.open_rasterio("landsat_scene.tif")\nprint(img.dims)   # band, y, x\nprint(img.rio.crs)\nprint(img.rio.bounds())'));

  c.push(h2('Selecting by label with sel()'));
  c.push(p('.sel() picks by coordinate value — a date, latitude — not integer position. method="nearest" snaps to closest grid cell.'));
  c.push(code('python', 'la_point = temp.sel(latitude=34.05, longitude=-118.24,\n                      method="nearest").sel(time="2024-07-15")\nprint(float(la_point))'));
  c.push(code('python', 'socal = temp.sel(latitude=slice(36, 32),\n                 longitude=slice(-120, -114),\n                 time=slice("2024-06", "2024-08"))'));
  c.push(callout('warn', 'Latitude direction.', 'Many climate files store latitude descending (north to south). slice(36, 32) not slice(32, 36). Print coord values when selection returns empty.'));

  c.push(h2('isel() vs sel()'));
  c.push(p('isel uses integer index positions; sel uses coordinate labels. Prefer sel for readability.'));

  c.push(h2('Longitude conventions'));
  c.push(p('Some files use 0-360 instead of -180 to 180. Convert before selecting US West Coast.'));
  c.push(code('python', 'if temp.longitude.max() > 180:\n    temp = temp.assign_coords(longitude=((temp.longitude + 180) % 360) - 180)\n    temp = temp.sortby("longitude")'));

  c.push(h2('Plotting a slice'));
  c.push(code('python', 'socal.isel(time=0).plot(cmap="RdYlBu_r", figsize=(8,5))\nsocal.mean(dim="time").plot(title="Mean summer temperature")'));
  c.push(p('xarray.plot wires up coordinates automatically — quick sanity check after every selection.'));

  c.push(h2('Reducing across dimensions'));
  c.push(p('Collapse a dimension with mean, max, sum — average over space for a time series, over time for a map.'));
  c.push(code('python', 'regional_ts = socal.mean(dim=["latitude", "longitude"])\nregional_ts.plot()\nsummer_map = socal.mean(dim="time")\nsummer_map.plot()'));
  c.push(h2('Weighted spatial means'));
  c.push(p('For true area averages on lat-lon grids, weight by cos(latitude) — cells shrink toward poles.'));

  c.push(h2('Unit conversion'));
  c.push(code('python', 'temp_c = temp - 273.15  # Kelvin to Celsius if attrs say K\ntemp_c.attrs["units"] = "degC"'));

  c.push(h2('Time series at a point'));
  c.push(p('Extract LA temperature through time — the raster equivalent of a station record.'));
  c.push(code('python', 'la_ts = temp.sel(latitude=34.05, longitude=-118.24, method="nearest")\nla_ts.plot()\nannual = la_ts.resample(time="YE").mean()\nannual.plot()'));

  c.push(h2('Resampling time in xarray'));
  c.push(code('python', 'monthly = la_ts.resample(time="ME").mean()\ndaily = la_ts.resample(time="D").interpolate()  # only if appropriate'));

  c.push(h2('Climatology and anomalies'));
  c.push(p('Remove seasonal cycle to expose trends — core workflow for heat-wave and climate projects.'));
  c.push(code('python', 'clim = la_ts.groupby("time.month").mean("time")\nanom = la_ts.groupby("time.month") - clim\nanom.plot()'));
  c.push(callout('tip', 'Anomalies reveal warming.', 'A hot July may be normal seasonally but positive anomaly means hotter than that month\'s long-term average.'));

  c.push(h2('Multi-file datasets'));
  c.push(p('Climate archives split years into separate files. open_mfdataset concatenates along time.'));
  c.push(code('python', 'import glob\nds = xr.open_mfdataset(glob.glob("era5/era5_*.nc"), combine="by_coords")'));

  c.push(h2('Chunking and lazy loading'));
  c.push(p('Large rasters do not fit in RAM. open_dataset with chunks= loads lazily via dask — compute only what you need.'));
  c.push(code('python', 'ds = xr.open_dataset("big_climate.nc", chunks={"time": 100})\nresult = ds["t2m"].mean(dim="time").compute()'));

  c.push(h2('Band math: NDVI'));
  c.push(p('<strong>NDVI</strong> = (NIR - Red) / (NIR + Red) measures vegetation health from Landsat or Sentinel bands.'));
  c.push(code('python', 'red = img.sel(band=4).astype("float32")\nnir = img.sel(band=5).astype("float32")\nndvi = (nir - red) / (nir + red)\nndvi.plot(cmap="YlGn", vmin=0, vmax=0.8)'));
  c.push(list([
    'NDVI near 1: dense vegetation.',
    'NDVI near 0: bare soil or urban.',
    'NDVI negative: water or snow.',
    'Clouds corrupt NDVI — mask first.'
  ]));

  c.push(h2('Cloud masking'));
  c.push(code('python', 'qa = rxr.open_rasterio("landsat_qa.tif")\ncloud_mask = (qa & (1 << 3)) == 0\nndvi_masked = ndvi.where(cloud_mask)'));

  c.push(h2('Other spectral indices'));
  c.push(table(['Index', 'Use'], [
    ['NDWI', 'Water bodies'],
    ['NBR', 'Burn severity'],
    ['LST', 'Land surface temperature']
  ]));

  c.push(h2('Reprojecting rasters'));
  c.push(p('Match raster CRS to vector layers before zonal stats or overlay.'));
  c.push(code('python', 'ndvi_3310 = ndvi.rio.reproject("EPSG:3310")\nndvi_3310.rio.resolution()'));

  c.push(h2('Clip raster to vector'));
  c.push(code('python', 'import geopandas as gpd\nla = gpd.read_file("la_county.geojson")\nndvi_la = ndvi.rio.clip(la.geometry, la.crs)'));

  c.push(h2('Zonal statistics'));
  c.push(p('Summarise raster values within polygons — mean NDVI per tract, max temperature per county. Bridges raster and vector lessons.'));
  c.push(code('python', 'from rasterstats import zonal_stats\nstats = zonal_stats("la_tracts.geojson", ndvi.values, affine=ndvi.rio.transform(), stats=["mean", "std"])'));
  c.push(code('python', 'tracts = gpd.read_file("la_tracts.geojson")\ntracts["mean_ndvi"] = [s["mean"] for s in stats]\ntracts.plot(column="mean_ndvi", cmap="Greens", legend=True)'));

  c.push(h2('Raster to vector contours'));
  c.push(p('Optional: draw contour lines on a 2D temperature slice with matplotlib for publication maps.'));

  c.push(h2('Missing values and fill values'));
  c.push(p('NetCDF _FillValue or nodata in GeoTIFF must become NaN for mean to work.'));
  c.push(code('python', 'temp = temp.where(temp < 1e20)  # drop sentinel\n# or\ntemp = xr.decode_cf(ds)["t2m"]'));

  c.push(h2('Saving outputs'));
  c.push(code('python', 'regional_ts.to_netcdf("la_temp_timeseries.nc")'));

  c.push(h2('Data sources'));
  c.push(list([
    '<strong>NASA Earthdata:</strong> MODIS, Landsat, VIIRS.',
    '<strong>Copernicus ERA5:</strong> global hourly climate reanalysis.',
    '<strong>Google Earth Engine:</strong> cloud processing with export.'
  ]));

  c.push(h2('Workflow checklist'));
  c.push(steps([
    'Open file; print dims, coords, attrs, units.',
    'Convert units and longitude convention if needed.',
    'Select region and time with sel().',
    'Reduce over space or time for your question.',
    'Plot every intermediate step.',
    'Bridge to vectors with clip or zonal stats if needed.'
  ]));

  c.push(h2('Common mistakes'));
  c.push(list([
    'Wrong latitude slice direction.',
    'Forgetting Kelvin vs Celsius.',
    'Using cloud-contaminated pixels in NDVI.',
    'Loading entire multi-GB file without chunks.'
  ]));

  c.push(exercise(
    'Regional temperature anomaly',
    'Open a gridded temperature NetCDF, select Southern California for 2000-2024, compute area-mean time series, build monthly climatology, plot anomalies. Is there a warming trend in the annual anomaly mean?',
    'sel() region and time; mean over lat/lon; groupby month for climatology.',
    { lang: 'python', code: 'import xarray as xr\nds = xr.open_dataset("era5_western_temp.nc")\nt = ds["t2m"] - 273.15\nsocal = t.sel(latitude=slice(36,32), longitude=slice(-120,-114), time=slice("2000","2024"))\nts = socal.mean(dim=["latitude","longitude"])\nclim = ts.groupby("time.month").mean("time")\nanom = ts.groupby("time.month") - clim\nanom.plot()\nannual_anom = anom.resample(time="YE").mean()\nannual_anom.plot()', note: 'Positive trend in annual_anom suggests warming beyond seasonal cycle for the regional average.' }
  ));

  c.push(exercise(
    'Summer heat map',
    'From the same file, select June-August 2023, average over time, plot spatial map with colour bar in Celsius. Mark LA with a point. What is the hottest grid cell in the region?',
    'time slice summer; mean(dim="time"); plot with plt.scatter for city.',
    { lang: 'python', code: 'summer23 = t.sel(time=slice("2023-06","2023-08"),\n    latitude=slice(36,32), longitude=slice(-120,-114))\nmap23 = summer23.mean(dim="time")\nmap23.plot(cmap="RdYlBu_r")\nplt.scatter(-118.24, 34.05, c="black", marker="x")\nprint("max C:", float(map23.max()))', note: 'Confirm latitude ordering before sel; max() identifies hottest cell value.' }
  ));

  c.push(exercise(
    'NDVI change detection',
    'Load two Landsat scenes (before and after fire), compute NDVI for each, subtract for delta NDVI, clip to study area, report mean NDVI loss inside a fire perimeter polygon.',
    'Band math on each scene; rio.clip to perimeter; mean of difference.',
    { lang: 'python', code: 'import rioxarray as rxr\npre = rxr.open_rasterio("landsat_pre.tif")\npost = rxr.open_rasterio("landsat_post.tif")\ndef ndvi(img):\n    r = img.sel(band=4).astype("float32")\n    n = img.sel(band=5).astype("float32")\n    return (n - r) / (n + r)\ndelta = ndvi(post) - ndvi(pre)\nfire = gpd.read_file("fire_perimeter.geojson")\ndelta_clip = delta.rio.clip(fire.geometry, fire.crs)\nprint("mean NDVI loss:", float(delta_clip.mean()))', note: 'Negative delta indicates vegetation loss; cloud mask both scenes first in production work.' }
  ));

  c.push(h2('Recap'));
  c.push(list([
    'Raster = grid of valued cells; use xarray not GeoPandas.',
    'sel() by coordinates; mind latitude order and longitude range.',
    'Reduce over space for time series, over time for maps.',
    'Anomalies and climatology expose trends in climate data.',
    'NDVI and band math turn spectra into environmental indicators.',
    'Zonal stats and rio.clip bridge rasters to census tracts and counties.'
  ]));

  return {
    title: 'Gridded & remote-sensing data',
    track: 'geo', tool: 'Python', level: 'advanced', time: '~6-8 hrs',
    lede: 'Satellites and climate models deliver gridded data: temperature and reflectance at every cell across space and time. This comprehensive lesson covers xarray, rioxarray, NetCDF and GeoTIFF workflows, anomalies, NDVI, and zonal statistics for environmental analysis.',
    learn: [
      'Tell raster from vector data and pick the right tools',
      'Open NetCDF and GeoTIFF with xarray and rioxarray',
      'Index and slice by coordinates and time',
      'Compute spatial and temporal means and anomalies',
      'Build spectral indices like NDVI and run zonal statistics'
    ],
    prereqs: [{ id: 'geospatial', label: 'Geospatial analysis' }, { id: 'time-series', label: 'Time-series analysis' }],
    resources: [
      { name: 'xarray tutorial', url: 'https://tutorial.xarray.dev/', kind: 'course' },
      { name: 'NASA Earthdata', url: 'https://www.earthdata.nasa.gov/', kind: 'data' },
      { name: 'Project Pythia foundations', url: 'https://foundations.projectpythia.org/', kind: 'guide' }
    ],
    unlock: { label: 'Western heat waves', url: 'projects.html', blurb: 'Open gridded climate data and compute regional temperature anomalies over time.' },
    content: c
  };
}

module.exports = { buildGridded };
