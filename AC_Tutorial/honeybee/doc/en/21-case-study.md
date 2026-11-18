# 21 · Case Study: Office Daylight and Energy

> One 96 m² south-facing office, from an EPW file to sDA/ASE and an EUI number. Each step lists only the components, the inputs that matter, and what comes out; chained in order they form a reproducible workflow.

## Setup

- Site: Beijing, `CHN_Beijing.Capital.Intl.AP.545110_IWEC`, cold climate.
- Geometry: one 12 m × 8 m room, 3.2 m high, a single south wall. The other three sides are adjacent, so results stay easy to read.
- Targets: sDA300/50% and energy use intensity (kWh/m²·a). Order is fixed: **geometry → properties → parameters → run → read**.

| Stage | Key components | Key inputs | Output |
|---|---|---|---|
| Weather | [[LB Import EPW]], [[LB Import STAT]], [[HB Wea From EPW]] | `_epw_file`, `_stat_file`, `timestep_` | location, climate zone, wea |
| Geometry | [[HB Room from Solid]], [[HB Model]], [[HB Solve Adjacency]], [[HB Validate Model]] | `_geo`, `_name_`, `conditioned_` | validated model |
| Openings | [[HB Apertures by Ratio]], [[HB Extruded Border Shades]], [[HB Apply Window Modifier]] | `_ratio` 0.4, `_win_height_` 1.8, `_sill_height_` 0.9, `_depth` 0.6 | windows plus overhang |
| Properties | [[HB Construction Set by Climate]], [[HB Apply ConstructionSet]], [[HB Search Programs]], [[HB Apply ProgramType]], [[HB Apply Load Values]], [[HB IdealAir]] | `keywords_`, 8 m²/person, 9 W/m², 30 m³/(h·person), `_cool_temp_` | conditioned model |
| Energy | [[HB Simulation Parameter]], [[HB Simulation Output]], [[HB Model to OSM]], [[HB Run OSM]] | `_output_`, `_run_period_`, `_sim_par_`, `run_` | sql, html |
| Daylit grid | [[HB Sensor Grid from Rooms]], [[HB Assign Grids and Views]], [[HB Radiance Parameter]] | `_grid_size` 0.5, `_dist_floor_` 0.8, `_detail_level_` | model with a workplane grid |
| Daylight | [[HB Annual Daylight]] | `_thresholds` 300, `_schedule_`, `_run` | DA, cDA, UDI |
| Metrics | [[HB Spatial Daylight Autonomy]], [[HB Annual Sunlight Exposure]] | `_target_time_` 50, `_threshold_` 1000, `_target_hrs_` 250 | sDA, ASE |

## Notes on the Steps

- **Weather.** Load the EPW once and reuse the same file for energy and daylight; mixing cities is the most common silent error. Keep paths plain English — Chinese paths often read in Rhino but fail inside the engine subprocess.
- **Geometry.** One closed box in metres, no meshes, nothing below Z = 0. Before moving on, check [[HB Visualize by Type]] and [[HB Visualize Normals]]: inward normals put the windows on the back of the wall and ruin every result.
- **Openings.** Sill plus window height must stay under the wall height. Truncation is silent and the truncated shape is rarely what you wanted.
- **Properties.** Run the standards first and confirm the magnitude, then override values one at a time. Otherwise you cannot tell a modelling error from a parameter error.
- **Energy.** The first run unpacks the engines and takes much longer. Check `run_`: left on False, the component returns nothing without complaint.
- **Daylight.** 0.5 m grid is enough; 0.2 m multiplies points by six for a marginal gain. sDA and ASE pull in opposite directions, so report both or neither.

## Reading the Results

| Component | What it gives you |
|---|---|
| [[HB Read Room Energy Result]] | Cooling, heating, lighting, equipment, fans, gains |
| [[HB End Use Intensity]] | EUI and end-use breakdown |
| [[HB Peak Loads]] | Peak cooling and heating for sizing |
| [[HB Annual Results to Data]] → [[LB Spatial Heatmap]] | Point results as a plan-view map |
| [[HB Color Rooms]], [[LB Create Legend]] | Room-level colouring with a shared legend |

Three sentences carry the conclusion: share of area meeting the daylight target, share overexposed, energy per square metre. Add one heat map, one end-use chart and one before/after table.

## Reproduce It

1. Import EPW and STAT; confirm location and climate zone.
2. Draw the box, convert to Room, wrap in Model, pass [[HB Validate Model]].
3. Cut windows and add the overhang; confirm they sit on the correct face.
4. Apply construction set and program; override the key load values.
5. Set simulation parameters, run OSM, keep the sql.
6. Build the grid, run annual daylight, extract sDA and ASE.
7. Plot, compare, write three sentences.

> The values here (0.4 WWR, 0.6 m overhang, 300 lux) belong to this example. Change the conditions and the numbers move; the reading method does not.
