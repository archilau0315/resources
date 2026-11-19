# 05 · Sun, Sky and Shadows

> Turn a location into a sun path, then see who is shaded.
![Annual weather data mapped to sun path: visualization of all 8760 annual hours on the celestial sphere](../assets/shots/05-sun-sky.png)

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [Sun, Solar Radiation and Environment](https://www.bilibili.com/video/BV11P4y1F7AA/)
- [Sunlight Hours Analysis](https://www.bilibili.com/video/BV1XR4y1L7Qb/)

## What This Chapter Solves

With a Location you can answer three everyday questions: how the sun moves through the year, what sits in shadow at a given hour, and how tall a plot may build. The main line is Location → sun path → sun vectors → shading checks. The sky dome and sky mask form a side branch showing where radiation comes from.

Remember one convention: every `north_` input means "angle from Rhino +Y to north, counter-clockwise positive", so 90 is west and 270 is east. A model drawn with north on -Y needs `north_` = 180, not 0. `hoys` are hours of the year (HOY, 1–8760), from the `hoys` output of [[LB Analysis Period]] or from [[LB Calculate HOY]].

## Components Used

| Component | Purpose |
|---|---|
| [[LB SunPath]] | Draws the sun path and outputs vectors, altitudes, azimuths |
| [[LB Compass]] | Draws a north arrow for checking and for drawings |
| [[LB Set Rhino Sun]] | Pushes a chosen hour into Rhino's sun for shadows |
| [[LB View From Sun]] | Opens a viewport looking from the sun |
| [[LB Sky Mask]] | Projects context onto the sky dome to show blocked sky |
| [[LB Solar Envelope]] | Computes the tallest volume meeting a sun access rule |
| [[LB Magnetic to True North]] | Converts magnetic north to true north |
| [[LB Cumulative Sky Matrix]] | Builds the sky matrix the dome and radiation studies need |
| [[LB Sky Dome]] | Draws that matrix as a coloured dome |

## Steps

1. Wire `location` into `_location` of [[LB SunPath]], fill `north_` for your model, and start with `_scale` = 1 (100 m radius).
2. To study selected days, build `hoys` with [[LB Analysis Period]] or [[LB Calculate HOY]] and feed `hoys_`; leave it empty for the whole year.
3. Run it: arcs appear with a `compass`. Draw a larger [[LB Compass]] with the same `_north_` for output drawings.
4. Feed `vectors` into `_vectors` of [[LB Direct Sun Hours]] or [[LB Solar Envelope]]; every sun study starts here.
5. To check one moment, convert a date with [[LB Calculate HOY]], wire `hoy` into `hoys_` of [[LB Set Rhino Sun]], match `_location` and `north_`, set `_run` True, then switch on sun and shadows in Rhino.
6. To look straight from the sun, send one vector to `_vector` of [[LB View From Sun]] and point `_center_pt_` at the model centre.
7. For site shading, send surrounding buildings to `context_` of [[LB Sky Mask]] with `_center_` on the point of interest; `sky_view` is the visible fraction of sky.
8. For radiation direction, send `direct_normal_rad`, `diffuse_horizontal_rad` and `hoys` from [[LB Import EPW]] into [[LB Cumulative Sky Matrix]], then `sky_mtx` into [[LB Sky Dome]].

## Key Inputs

| Input | What to give it |
|---|---|
| `north_` | 0 = north on +Y; 90 = west, 270 = east; north on -Y = 180 |
| `hoys_` | Integers 1–8760 or a list; empty means the full year |
| `_scale_` (SunPath / Sky Dome) | 1 means a 100 m radius |
| `_scale_` (Compass) | 1 means a 10 m radius, usually a tenth of the sun path |
| `projection_` | Empty = 3D dome; `Orthographic` or `Stereographic` gives a 2D chart |
| `_density_` (Sky Mask) | 1–3; higher is finer and slower |
| `solar_rights_` | True limits your height so neighbours keep sun |

## Common Traps

- Leaving `north_` at 0 while the model's north points down -Y, flipping every orientation by 180°.
- Seeing no sun path because `_scale` is too small; a 100 m radius disappears inside a 300 m model.
- Forgetting `_run` on [[LB Set Rhino Sun]], so Rhino's sun never moves.
- Full-year `vectors` with `_timestep_` 1 on [[LB Direct Sun Hours]], inflating the hour count.
- Feeding solids into `_obstacles` of [[LB Solar Envelope]]; it expects horizontal surfaces or closed curves.

## Next

With sun vectors in hand, summarise radiation and draw charts: read [06 · Data Analysis and Charts](06-data-analysis.md).
