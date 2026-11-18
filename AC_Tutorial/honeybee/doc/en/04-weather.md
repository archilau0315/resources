# 04 · Weather Data and Sites

> Find the nearest site and get its epw, stat and ddy files.

## What This Chapter Solves

Every analysis starts with a weather file. EPW (EnergyPlus Weather) holds 8760 hourly records: dry bulb temperature, relative humidity, wind speed and direction, direct and diffuse radiation, and pressure. It is usually a Typical Meteorological Year (TMY), assembled from many years of observation, so it describes a typical year rather than one real one.

| File | Holds | Used for |
|---|---|---|
| .epw | 8760 hours of weather | Sun, radiation, daylight, energy |
| .stat | Climate zone, design conditions, extreme weeks | Passive design, HVAC design |
| .ddy | Design day parameters | Loads and equipment sizing |

Two routes in: without files, use [[LB EPWmap]] to find a site link and hand it to [[LB Download Weather]]; with files on disk, go straight to [[LB Import EPW]].

## Components Used

| Component | Purpose |
|---|---|
| [[LB EPWmap]] | Opens the weather map to pick a site and copy its link |
| [[LB Download Weather]] | Downloads and unzips, returning epw, stat and ddy |
| [[LB Import EPW]] | Reads the epw, outputting Location and every hourly collection |
| [[LB Construct Location]] | Build a Location by hand from coordinates |
| [[LB Deconstruct Location]] | Split a Location back into numbers, for checking |
| [[LB Import STAT]] | Climate zones and design conditions from the stat |
| [[LB Import DDY]] | Design days from the ddy |
| [[LB EPW to DDY]] | Generate a ddy when only an epw exists |

## Steps

1. Drop [[LB EPWmap]], set `_epw_map` to True, and zoom the browser map to your city.
2. Click a station marker, copy the epw download link, and paste it into `_weather_URL` of [[LB Download Weather]]; leave `_folder_` empty for the default weather folder. Run it to get `epw_file`, `stat_file` and `ddy_file`.
3. Feed `epw_file` into `_epw_file` of [[LB Import EPW]] and panel `location`; check city, coordinates, time zone and elevation.
4. Feed `stat_file` into [[LB Import STAT]] and read `ashrae_zone` and `koppen_zone`; feed `ddy_file` into [[LB Import DDY]] for `design_days`.
5. If the station only offered an epw, create design days with [[LB EPW to DDY]]: epw on `_weather_file`, `_percentile_` 0.4, `_write` True.
6. Audit coordinates with [[LB Deconstruct Location]]; for sun studies with no weather file, build a Location with [[LB Construct Location]].
7. Panel everything, and run one wire from `location` to the canvas edge — every later chapter needs it.

## Key Inputs

| Input | What to give it |
|---|---|
| `_epw_file` | Full path in an English folder, e.g. `D:\weather\Beijing.epw` |
| `_weather_URL` | The link copied from EPWmap, usually a .zip |
| `_percentile_` | Design day percentile, typically 0.4 or 1.0 |
| `_latitude_` / `_longitude_` | North and east positive; Beijing is about 39.9 / 116.4 |
| `_time_zone_` | 8 for China; 0 shifts the sun by eight hours |

## Common Traps

- Downloading only the epw and jumping to loads, where components such as `HB Peak Loads` then miss a ddy.
- epw and stat with different names or folders, so [[LB Import STAT]] cannot find its companion.
- Picking a station in a neighbouring country; a few degrees of latitude moves sun angles and radiation.
- Standing in for a coastal project with an inland station, understating wind.
- Building a Location by hand with time zone 0, shifting the whole sun path eight hours.

## Next

With a site and hourly data, draw the sun path and test shading: read [05 · Sun, Sky and Shadows](05-sun-sky.md).
