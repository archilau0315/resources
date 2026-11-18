# 16 · Simulation Setup and Run

> Settings control accuracy; the run produces files.

## What This Chapter Solves

A complete simulation needs the model, the weather file and the settings. This chapter assembles run period, timestep, shadow algorithm and outputs into one parameter object, then runs **OpenStudio / EnergyPlus** through OSM, IDF or OSW. OSM is an OpenStudio model, IDF is native EnergyPlus input, OSW is a workflow of Measures. Daily work needs only OSM. The run yields `sql` results, `zsz` design-day loads, `rdd` output names and `html` reports.

## Components You Need

| Component | Role | Key input |
|---|---|---|
| [[HB Simulation Output]] | Choose results to write | `zone_energy_use_` |
| [[HB Simulation Control]] | Sizing and run switches | `_do_zone_sizing_` |
| [[HB Shadow Calculation]] | Shadow algorithm and rate | `_calc_method_` |
| [[HB Sizing Parameter]] | Design days and factors | `ddy_file_`, `_cooling_fac_` |
| [[HB Simulation Parameter]] | Collect all settings | `_run_period_`, `_timestep_` |
| [[HB Model to OSM]] | Translate and optionally run | `_write`, `run_` |
| [[HB Run OSM]] | Run an existing OSM | `_translate`, `run_` |
| [[HB Run IDF]] | Run an IDF directly | `_idf`, `_run` |
| [[HB Run OSW]] | Run a workflow | `_osw`, `_translate` |
| [[HB Annual Loads]] | Loads only | `_rooms`, `_epw_file` |
| [[HB Peak Loads]] | Design-day peaks | `_ddy_file` |

## Steps

1. Run [[HB Validate Model]] first and fix any `SEVERE` or `ERROR`.
2. In [[HB Simulation Output]], tick `zone_energy_use_` and `comfort_metrics_`, with `_report_frequency_ = Hourly`.
3. [[HB Simulation Control]] defaults are fine: all sizing switches `True`, `_for_run_period_` `True`.
4. [[HB Shadow Calculation]] updates every 30 days by default; below ~200 shading surfaces `PolygonClipping` is faster.
5. Point `ddy_file_` in [[HB Sizing Parameter]] to the `.ddy` beside the EPW; set `_heating_fac_` 1.25 and `_cooling_fac_` 1.15.
6. Collect everything in [[HB Simulation Parameter]] with `_north_`, `_run_period_` (empty = annual), `_timestep_` (6) and `_terrain_` (`City`).
7. Run one way: [[HB Model to OSM]] with `_write` and `run_` `True`; or write only, then [[HB Run OSM]] with `_translate = True`; or use [[HB Run IDF]] / [[HB Run OSW]].
8. Check `report`. On `Simulation Failed`, open the `.err` file and fix the first error before reading results.
9. Pass `sql`, `zsz`, `rdd` and `html` to Chapter 17.

## Filling the Parameters

| Parameter | Value | Suggestion |
|---|---|---|
| `_timestep_` | per hour | 6; 10–12 for accuracy |
| `_run_period_` | AnalysisPeriod | Empty means full year |
| `_terrain_` | text | `City`, `Urban`, `Suburbs`, `Country`, `Ocean` |
| `_report_frequency_` | text | `Hourly` or `Monthly` |
| `_heating_fac_` / `_cooling_fac_` | multiplier | 1.25 / 1.15 |
| `_cpu_count_` | count | Empty = CPU count minus one |
| `_translate` | boolean | Must be `True` for Run OSM / OSW |
| `run_` | boolean or 2 | `True` shows batch window; `2` silent |

## Common Pitfalls

1. **Writing an OSM without running**: `sql` stays empty and looks like a failure.
2. **DDY mismatched to the EPW**: wrong peaks lead to wrong equipment.
3. **Everything ticked at Timestep frequency**: multi-GB `sql` files freeze Grasshopper.
4. **Chinese characters or spaces in the path**: the CLI cannot find the files.
5. **Leaving `_sim_par_` empty**: defaults override shadow and sizing settings.

## Next

[Chapter 17 · Reading Results](17-results.md): totals, end uses, then maps.
