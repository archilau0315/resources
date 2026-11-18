# 19 · Sensor Grids and Views

> Grids say where it is bright; views say how it looks.

## What This Chapter Solves

Daylight results land on **sensors**, not on rooms; images come from a **camera**. This chapter prepares a **Sensor Grid** (points with positions and directions, the receivers of calculation) and a **View** (camera position, direction and projection). Both must be attached to the model so recipes can find them.

## Components You Need

| Component | Role | Key input |
|---|---|---|
| [[HB Sensor Grid from Rooms]] | Grid over room floors | `_rooms`, `_grid_size` |
| [[HB Sensor Grid from Faces]] | Grid over roofs or walls | `_hb_objs`, `_face_type_` |
| [[HB Sensor Grid from Apertures]] | Grid over glazing | `_offset_`, `_ap_type_` |
| [[HB Sensor Grid]] | Custom points and directions | `_positions`, `_directions_` |
| [[HB Radial Sensor Grid]] | Radial sensors | `_positions`, `_dir_count_` |
| [[HB Radial Grid from Rooms]] | Radial sensors in rooms | `_rooms`, `_dir_count_` |
| [[HB View]] | Hand-built camera | `_position`, `_direction` |
| [[HB View from Viewport]] | Camera from Rhino viewport | `_viewport_` |
| [[HB Assign Grids and Views]] | Attach grids and views | `grids_`, `views_` |
| [[HB Get Grids and Views]] | Read back what is attached | `_model` |

## Steps

1. Interior grid: [[HB Sensor Grid from Rooms]] with `_grid_size` 0.6 m and `_dist_floor_` 0.8 m for desk height.
2. Remove edge points with `wall_offset_ = 0.2`; on irregular rooms set `remove_out_ = True` as a check.
3. For zone reporting, set `by_zone_ = True` to get one grid per zone instead of per room.
4. Facades: [[HB Sensor Grid from Apertures]] with `_offset_ = 0.1` (positive outward); `_ap_type_` 1 window, 2 skylight, 3 all.
5. Roofs or walls: [[HB Sensor Grid from Faces]] with `_face_type_`; set `punched_ = True` for openings.
6. Custom: [[HB Sensor Grid]] with `_positions`; leave `_directions_` empty for `(0, 0, 1)`. For view or glare studies use [[HB Radial Sensor Grid]] with `_dir_count_ = 8`.
7. Camera: set the view in Rhino and use [[HB View from Viewport]], or fill `_position`, `_direction` and `_view_type_` in [[HB View]].
8. Attach with [[HB Assign Grids and Views]] and preview `points` / `meshes` from [[HB Get Grids and Views]] to confirm no sensor sits in a wall or desk.

## Filling the Parameters

| Parameter | Value | Suggestion |
|---|---|---|
| `_grid_size` | m | 0.3 fine, 0.6 standard, 1.0 fast |
| `_dist_floor_` | m | 0.8 for desk height |
| `wall_offset_` | m | 0.2 |
| `_offset_` | m | 0.1 outward; negative inward |
| `_face_type_` | text | `Wall`, `Roof`, `Floor` |
| `_ap_type_` | 1 / 2 / 3 | Window / skylight / all |
| `_dir_count_` | count | 8, one every 45° |
| `_view_type_` | 0–5 | 0 perspective, 1 hemispherical fisheye, 2 parallel |
| `_h_angle_` | degrees | Default 60 |

## Common Pitfalls

1. **Over-dense grids**: 0.1 m spacing multiplies sensor count tenfold.
2. **Forgetting to attach**: the recipe reports no grids on the model.
3. **Reversed view direction**: `_direction` is where the camera looks.
4. **Sensors inside walls or furniture**: zero or wild values; fix with `wall_offset_` and `remove_out_`.
5. **Aperture grids for interior daylight**: interiors need floor grids.

## Next

[Chapter 20 · Daylight Metrics and Simulation](20-daylight-metrics.md).
