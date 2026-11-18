# 06 · Data Analysis and Charts

> Turn 8760 numbers into monthly curves, a psychrometric chart and a wind rose.
![Radiation rose: comparison of solar radiation by orientation, with surrounding building context](../assets/shots/06-data-analysis.png)


## What This Chapter Solves

Weather data on its own is 8760 numbers and tells you nothing. This chapter compresses it into readable charts: monthly temperature and radiation, hourly patterns, the comfort zone on a psychrometric chart, a wind rose, radiation by orientation and degree days. These answer early design questions — do we need shading, can we rely on natural ventilation, which facade bakes.

Every chart component accepts a Data Collection: values tagged with a unit and time. All [[LB Import EPW]] outputs have that shape, so they plug straight in.

## Components Used

| Component | Purpose |
|---|---|
| [[LB Monthly Chart]] | Monthly bars or lines with mean and range |
| [[LB Hourly Plot]] | An 8760-hour colour strip showing daily and seasonal rhythm |
| [[LB Psychrometric Chart]] | Temperature-humidity chart with weather points and comfort zone |
| [[LB Wind Rose]] | Wind frequency and speed by direction |
| [[LB Radiation Rose]] | Solar radiation by facade orientation |
| [[LB Degree Days]] | Heating and cooling degree days, a rough energy gauge |
| [[LB Humidity Metrics]] | Humidity ratio, dew point, wet bulb and enthalpy |
| [[LB Time Aggregate]] | Aggregates hourly power into daily or monthly energy |
| [[LB Construct Header]] | Gives your own data a type, unit and period |
| [[LB Construct Data]] | Combines values and a header into a collection |

## Steps

1. Feed `dry_bulb_temperature` into `_data` of [[LB Monthly Chart]] with `_base_pt_` at `0,0,0`, `_x_dim_` 10 and `_y_dim_` 40.
2. Feed the same collection into `_data` of [[LB Hourly Plot]] with a positive `_z_dim_`; narrow the season by wiring an [[LB Analysis Period]] `period` into `period_`.
3. On [[LB Psychrometric Chart]], wire dry bulb to `_temperature`, relative humidity to `_rel_humidity`, `barometric_pressure` to `_pressure_`, and start with `_scale` = 1.
4. Also send a collection such as `direct_normal_rad` to `data_` and write `statement_` like `a > 500` to colour only high-radiation hours.
5. On [[LB Degree Days]], set `_heat_base_` 18 and `_cool_base_` 23, then read `heat_deg_days` and `cool_deg_days`.
6. For the wind rose, `wind_speed` goes to `_data` and `wind_direction` to `_wind_direction`, with `north_` matching the model and `_dir_count_` 36.
7. Radiation rose needs a sky matrix: send `direct_normal_rad`, `diffuse_horizontal_rad` and `hoys` into [[LB Cumulative Sky Matrix]], then `sky_mtx` into [[LB Radiation Rose]].
8. For humidity, wire dry bulb and relative humidity into [[LB Humidity Metrics]] with pressure on `_pressure_` to get `dew_point`, `wet_bulb` and `enthalpy`.
9. For your own measurements, set `_data_type`, `_unit_` and `_a_period` on [[LB Construct Header]], then feed header and values into [[LB Construct Data]]; use [[LB Time Aggregate]] to turn hourly power into annual energy.

## Key Inputs

| Input | What to give it |
|---|---|
| `_base_pt_` / `_center_pt_` | World position; move each chart along X so they do not stack |
| `_x_dim_` / `_y_dim_` / `_z_dim_` | In model units; 10 / 40 suits monthly charts |
| `percentile_` | Band width for hourly data, 34 is roughly one standard deviation |
| `_dir_count_` | Directions in a rose, 36 by default |
| `_freq_hours_` | Hours per frequency ring on the wind rose, 50 by default |
| `_heat_base_` / `_cool_base_` | 18 / 23 by default; hot-summer regions often use 18 / 26 |
| `statement_` | A condition such as `a > 25`; variables are always a, b, c |

## Common Traps

- Charts the size of a fingernail because the model is in millimetres while dimensions are in metres.
- Leaving every chart at the origin so they overlap into an unreadable pile.
- Putting wind direction on `_data` of the wind rose, which makes all petals equal; `_data` takes wind speed.
- Reading wind direction as "where the wind blows to"; it is where it blows from.
- Reaching for a radiation rose with an empty `_sky_mtx` and getting an error.

## Next

Once the climate is clear, compute comfort and put it on the drawing: read [07 · Comfort and Visualization](07-comfort-visualize.md).
