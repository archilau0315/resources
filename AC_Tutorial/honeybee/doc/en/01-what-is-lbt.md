# 01 · What Ladybug Tools Is

> A free toolbox inside Grasshopper for energy and daylight.

## What This Chapter Solves

Ladybug Tools is a set of free Grasshopper plugins that turns Rhino massing into numbers: sun hours, indoor comfort, daylight, annual energy. It does not hand you results at the click of a button. It splits the job into batteries — weather, model, properties, engine, charts — and leaves the wiring to you.

| Tab | Does | Engine behind it |
|---|---|---|
| Ladybug | Weather, sun, comfort, charts | Local maths; sky radiation via Radiance gendaymtx |
| Honeybee | Rooms, faces, windows, properties | Builds the model only |
| HB-Energy | Energy, loads, HVAC, hot water | OpenStudio → EnergyPlus |
| HB-Radiance | Daylight, sun, radiation | Radiance |

Version 1.10.x ships 429 components, split 122 / 70 / 143 / 94 across those tabs. Dragonfly handles urban blocks and is out of scope; Pollination is both the official installer and a cloud platform. Old 0.x tutorials no longer apply: 1.x unifies versions and one installer, and Honeybee exports HBJSON (a JSON model file) before translating to an OpenStudio OSM. Trust the `LB` / `HB` prefix, not the screenshots.

## Components Used

| Component | Purpose |
|---|---|
| [[LB Versioner]] | Update all components and core libraries |
| [[HB Check Versions]] | Print the engine versions installed here |
| [[LB Import EPW]] | Read a .epw, output a Location plus hourly data |
| [[HB Room]] | Close faces into the basic simulation unit |
| [[HB Model]] | Collect rooms and shades into a runnable model |
| [[HB Model to OSM]] | Translate the model to OpenStudio and run it |
| [[HB Annual Daylight]] | Run annual hourly daylight in Radiance |
| [[HB Read Room Energy Result]] | Read room loads and energy from the sql |

## Steps

1. Check that Ladybug, Honeybee, HB-Energy and HB-Radiance all appear on the ribbon; a missing tab means a broken install.
2. Drop [[HB Check Versions]] and confirm `energyplus`, `openstudio` and `radiance` each show a version.
3. Drop [[LB Import EPW]], set `_epw_file` to a local .epw, and panel `location`; it should name a city with coordinates.
4. Draw a closed box in Rhino, explode it to 6 faces, feed them into `_faces` of [[HB Room]], then `room` into `rooms_` of [[HB Model]].
5. Wire `model` into `_model` of [[HB Model to OSM]] with the same .epw, set `_write` and `run_` to True, and run; `sql` is your result file.
6. For daylight, send `model` through `HB Sensor Grid from Rooms` into [[HB Annual Daylight]], put the .epw on `_wea`, and set `_run` True.

## Key Inputs

| Input | What to give it |
|---|---|
| `_epw_file` | Full path to the .epw, English folder names only |
| `_sim_par_` | Leave empty to accept defaults on the first run |
| `_write` | True, otherwise no osm or idf is written |
| `run_` | True, or integer 2 for a silent run |
| `_faces` (HB Room) | Must close a volume; a missing face leaves a hole |

## Common Traps

- Treating Honeybee as a calculator: it only builds models, numbers come from HB-Energy or HB-Radiance.
- Copying 0.x tutorials; components such as `Run Energy Simulation` no longer exist.
- Modelling in millimetres while entering metre values, so rooms shrink to specks.
- Installing components without engines: everything is green until you press run.

## Next

Get the environment clean and self-checked before wiring anything: read [02 · Install and Verify](02-install.md).
