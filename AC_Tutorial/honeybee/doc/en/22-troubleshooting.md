# 22 · Troubleshooting and Checklist

> Most Ladybug Tools errors come from upstream, not from the battery: units, geometry, paths, engines. These 28 cases follow the order environment → geometry → simulation, and end with the 12 checks to pass before you submit a model.

Read the component's `report` output before anything else. It carries the full trace and file name; the popup's `Solution exception` only shows the last line. Diagnose in a fixed order: **units → geometry → properties → paths and engines → simulation parameters**. Skipping ahead usually means fixing the wrong thing.

## Installation and Environment

| Symptom | Likely cause | What to do |
|---|---|---|
| Batteries grey or red across the ribbon | incomplete install, user objects not loaded | Reinstall the Pollination build; confirm five version outputs in [[HB Check Versions]] |
| "EnergyPlus not found" | engine missing or folder cleaned | Check `ep_install` in [[HB Config]]; reinstall with [[LB Versioner]] |
| "Radiance not found" | not installed, or path has non-English characters | Check `rad_install` in [[HB Config]]; move to a plain path |
| First run hangs for minutes | engines are being unpacked and compiled | Normal; watch `report`; do not click run repeatedly |
| Four tabs report different versions | packages were updated separately | Trip [[HB Check Versions]]; unify with [[LB Versioner]]; restart Rhino |
| Every battery flagged old | 0.x to 1.x rename | [[LB Legacy Updater]]; upgrade files with [[HB Update HBJSON]] |

## Geometry and Model

| Symptom | Likely cause | What to do |
|---|---|---|
| Area is zero or negative | open or self-intersecting boundary | [[HB Validate Model]]; [[HB Planarize Brep]]; redraw the outline |
| Non-planar face error | curved or folded surfaces | Build with planar faces; planarize before converting |
| Adjacent rooms share one temperature | adjacency never solved | [[HB Solve Adjacency]]; fill gaps with [[HB Patch Missing Adjacency]] |
| Indoor temperature equals outdoor | exterior walls set to adiabatic | [[HB Visualize by BC]]; inspect `boundary_condition` |
| Window lands on the back of the wall | flipped normals | [[HB Visualize Normals]]; flip geometry, rebuild the Room |
| Window area zero or out of bounds | sill plus height exceeds wall height | Lower `_win_height_` or `_ratio`; validate again |
| Half the rooms disappear | solid is not closed | Check for a closed polysurface; [[HB Intersect Solids]] |
| Floors misaligned after copying | inconsistent base point or height | [[HB Set Story]]; copy from a single base point |

## Simulation

| Symptom | Likely cause | What to do |
|---|---|---|
| Energy a thousand times too large | mm vs m, or W vs kW | Rhino units in metres; convert with [[LB To SI]] or [[LB To Unit]] |
| sql file is empty | `run_` is False, or the run failed early | Set True; read the fatal error at the end of `report` |
| Run stops halfway | out of memory, timestep or grid too fine | Trim outputs; coarsen timestep; run rooms in batches |
| Cooling load is zero | no HVAC assigned, or setpoints missing | Add [[HB IdealAir]]; confirm the program applied |
| Ventilation far too high | fresh air and infiltration counted twice | Check `vent_per_person_` and `infilt_per_exterior_` in [[HB Apply Load Values]] |
| Lighting unrelated to floor area | schedule missing or entirely ones | Check the program and `_schedule_`; reapply [[HB Apply ProgramType]] |
| Peak loads empty | no DDY or STAT provided | [[LB Import STAT]]; [[HB Peak Loads]] needs `_ddy_file` |

## Daylight and Results

| Symptom | Likely cause | What to do |
|---|---|---|
| Daylight results all zero | window lacks a modifier, or normal flipped | [[HB Apply Window Modifier]]; check normals |
| Surfaces render black | missing Radiance material or zero reflectance | [[HB Apply Face Modifier]]; inspect [[HB ModifierSet]] |
| sDA always 100% | threshold or schedule set to zero | Check `_thresholds` and `_schedule_` on [[HB Annual Daylight]] |
| ASE all failing | no shading, or threshold unit wrong | Add [[HB Extruded Border Shades]]; `_threshold_` = 1000 lux |
| Daylight run too slow | grid too dense, quality too high | `_grid_size` 0.5 → 1.0; lower [[HB Radiance Parameter]] |
| Daylit pattern mirrored | north not set, or magnetic north uncorrected | `_north_` on [[HB Simulation Parameter]]; [[LB Magnetic to True North]] |
| Legend renders empty | values not connected, or preview off | Feed `_values` into [[LB Create Legend]]; enable preview |

## Twelve Checks Before You Submit

1. Rhino units are metres; origin near the building centre; true north confirmed.
2. Every room is closed, every face planar and free of self-intersections.
3. Normals all point outward — no red/blue mix in [[HB Visualize Normals]].
4. Adjacency is solved; no exterior face that should be a shared wall.
5. Every window sits on an exterior wall, has area, and stays inside one storey.
6. Construction set matches the climate zone, and windows really carry glass.
7. Program type and schedules agree; people, lighting and equipment densities are plausible.
8. Fresh air and infiltration are not counted twice.
9. EPW and STAT come from the same station, in a plain English path.
10. [[HB Check Versions]] shows all five entries; versions match this tutorial.
11. Daylight grid sits 0.8 m above the floor, spaced 0.5 m or more, only where needed.
12. You have all three result artefacts: `sql`, `report`, and a figure that agrees with them.

> Absurd numbers: check units. Zeros: check normals. Won't run: check engines. Runs slowly: check the grid. Four rules cover most of it; `report` covers the rest.
