# 17 · Reading Results

> Totals first, end uses next, maps last.

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [Building a Honeybee Natural Ventilation Model from Scratch](https://www.bilibili.com/video/BV1X3411W7rt/)
- [Honeybee Energy Setup 1](https://www.bilibili.com/video/BV1Wi4y117iw/)

## What This Chapter Solves

The simulation writes `sql`, `zsz` and `html`. The `sql` is a database, not a chart. This chapter turns it into time-stamped **Data Collections** and answers five questions: how much energy per year (**EUI**), which end use dominates, whether equipment is large enough, which room performs worst, and whether people are comfortable.

## Components You Need

| Component | Role | Key input |
|---|---|---|
| [[HB End Use Intensity]] | Total and end-use EUI | `_sql`, `ip_` |
| [[HB Carbon Emission Intensity]] | kg CO₂/m² | `_loc_kgMWh`, `_year_` |
| [[HB Read Room Energy Result]] | Hourly room results | `_sql` |
| [[HB Thermal Load Balance]] | Split loads by source | `_rooms_model` |
| [[HB Peak Loads]] | Design-day peaks in W | `_rooms`, `_ddy_file` |
| [[HB Read Zone Sizing]] | Loads from the zsz file | `_zsz` |
| [[HB Color Rooms]] | Color rooms by value | `_data`, `_rooms_model` |
| [[HB Read Room Comfort Result]] | Temperature, humidity, unmet | `_sql` |
| [[HB PMV Comfort Map]] | Spatial comfort | `_model`, `_epw` |
| [[HB Read Thermal Matrix]] | Load comfort CSV files | `_comf_result`, `_load` |
| [[HB Visualize Thermal Map]] | Time-sliced maps | `_comf_mtx`, `_mesh` |
| [[LB Monthly Chart]] | Monthly columns | monthly data |
| [[LB Hourly Plot]] | Annual curves | hourly data |

## Steps

1. Open the `html` summary first and check area, EUI and unmet hours — confirm the run is sane.
2. Connect `_sql` to [[HB End Use Intensity]] and read `eui`; `eui_end_use` pairs with `end_uses` for heating, cooling, lighting and equipment.
3. Feed `cooling`, `heating`, `lighting`, `electric_equip` and `hot_water` from [[HB Read Room Energy Result]] into [[LB Monthly Chart]] or [[LB Hourly Plot]].
4. Read `peak_cool` / `peak_heat` from [[HB Peak Loads]] in W, or `cooling_load` / `heating_load` from [[HB Read Zone Sizing]].
5. Connect rooms and terms to [[HB Thermal Load Balance]] and plot `balance` with [[LB Monthly Chart]] to see envelope, solar, people and infiltration shares.
6. Color with [[HB Color Rooms]] (`_norm_by_flr_ = True` when comparing room sizes); use `sim_step_` to pick an hour.
7. For comfort, read [[HB Read Room Comfort Result]]; for spatial maps, run [[HB PMV Comfort Map]], set `_load = True` in [[HB Read Thermal Matrix]], then choose a timestep in [[HB Visualize Thermal Map]].
8. Give [[HB Carbon Emission Intensity]] the local grid factor in `_loc_kgMWh`; `_year_` defaults to 2030.

## Filling the Parameters

| Parameter | Value | Suggestion |
|---|---|---|
| `_sql` | file path | From the Run component |
| `ip_` | boolean | `False` for kWh/m² |
| `_norm_by_flr_` | boolean | `True` when comparing room sizes |
| `sim_step_` | integer | 0-based; empty means annual total |
| `period_` | AnalysisPeriod | Summer or occupied hours |
| `_data` | Data Collections | Same type, or they cannot pair |
| `_load` | boolean | Must be `True` for the thermal matrix |

## Common Pitfalls

1. **Ideal-air `cooling` read as electricity**: it is heat to remove, before COP.
2. **Comparing without normalizing**: bigger rooms always look worse.
3. **Old `sql` with a new model**: results no longer match.
4. **`_load = False`**: the thermal matrix returns empty.
5. **Hourly data in a monthly chart**: [[LB Monthly Chart]] needs monthly collections.

## Next

[Chapter 18 · Radiance Materials and Skies](18-radiance-materials-sky.md).
