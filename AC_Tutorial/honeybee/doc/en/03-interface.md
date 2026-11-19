# 03 · Interface and Data Flow

> Four tabs, one main line. Follow the wire and wiring stops being guesswork.
![Grasshopper canvas with connected components: Ladybug tab on the left, canvas in the middle, Panel inputs on the right](../assets/shots/03-rhino-interface.png)

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [Basic Graphics in Ladybug Tools](https://www.bilibili.com/video/BV11b4y177Xq/)
- [LBT Intro and Install](https://www.bilibili.com/video/BV1jT4y1e7yA/)

## What This Chapter Solves

There are 429 components, but only one main line: weather → geometry → rooms → model → properties → simulation settings → run → results → charts. Everything else branches off that line. This chapter covers how the ribbon is grouped, what shape each piece of data has, and where a wire belongs. The number on a component icon is its subcategory index.

![Rhino 8 main window: toolbars on the left, layer panel on the right, four standard views](../assets/shots/01-rhino.png)

| Tab | Subcategories |
|---|---|
| Ladybug | 0 Import / 1 Analyze Data / 2 Visualize Data / 3 Analyze Geometry / 4 Extra / 5 Version |
| Honeybee | 0 Create / 1 Visualize / 2 Organize / 3 Serialize |
| HB-Energy | 0 Basic Properties / 1 Constructions / 2 Schedules / 3 Loads / 4 HVAC / 5 Simulate / 6 Result / 7 Thermal Map |
| HB-Radiance | 0 Basic Properties / 1 Modifiers / 2 Light Sources / 3 Recipes / 4 Results |

`LB` means Ladybug, `HB` means Honeybee core; HB-Energy and HB-Radiance batteries also start with `HB` and simply live on their own tabs. Underscores carry meaning: a leading one (`_epw_file`) marks a required input, a trailing one (`north_`) an optional input, and both (`_name_`) means required but already defaulted.

Data comes in four shapes: a single number, text such as a file path, a time-tagged Data Collection (8760 hourly temperatures), and a Honeybee object (Room, Model, SimulationParameter). Fit the shapes and wires go green; mismatch turns them red.

## Components Used

| Component | Purpose |
|---|---|
| [[LB Import EPW]] | Start of the line: weather data and the Location |
| [[HB Room]] | Geometry → room, closing faces into a volume |
| [[HB Model]] | Rooms → model, the entry point for every run |
| [[HB Simulation Parameter]] | Collects period, outputs, shadows and HVAC settings |
| [[HB Model to OSM]] | Model + weather → OpenStudio, ready to run |
| [[HB Read Room Energy Result]] | sql → hourly heating and cooling as collections |
| [[HB Visualize by Type]] | Colour walls, roofs, floors and windows to check modelling |

## Steps

1. Lay out [[LB Import EPW]], [[HB Room]], [[HB Model]], [[HB Simulation Parameter]] and [[HB Model to OSM]] left to right before wiring anything.
2. Panel `location` and `dry_bulb_temperature` and confirm you see 8760 values, not one number.
3. Explode a closed solid, feed its faces into `_faces` of [[HB Room]], then `room` into `rooms_` of [[HB Model]]. Send `model` to [[HB Visualize by Type]]: different colours for walls and roofs mean the room is sound.
4. Wire `model` to `_model`, `sim_par` to `_sim_par_`, the same .epw to `_epw_file`, then set `_write` and `run_` True and run.
5. Feed `sql` into [[HB Read Room Energy Result]], panel `heating` and `cooling`, then send them to [[LB Monthly Chart]].
6. Leave a Panel on every branch as a viewpoint. Black wires carry geometry, green wires carry data.

## Key Inputs

| Where | Convention |
|---|---|
| `north_` | 0 puts north on Rhino +Y; 90 = west and 270 = east |
| `_scale` (display) | 1 means a 100 m radius (compass: 10 m) |
| `_grid_size` | In Rhino units; 0.5–1 suits a metre-based model |
| `_run` / `_write` / `run_` | All default to False; nothing runs or writes until you flip them |
| `_timestep_` | 6 (ten-minute steps) is common; leave hourly weather alone |

## Common Traps

- Feeding a Data Collection into a numeric input; the wire turns red with a cryptic message.
- Forgetting `north_`, so a model drawn with north on -Y comes out rotated 180°.
- Adding a fresh [[LB Import EPW]] after every change until three sit on the canvas, only one wired.
- Millimetre model units with `_grid_size` of 1, generating millions of test points.

## Next

The first brick on the line is weather: read [04 · Weather Data and Sites](04-weather.md).
