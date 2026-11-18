# 10 · Batch Generation and Parametrics

> One massing, many windows and zones.

## What This Chapter Solves

Drawing a hundred windows by hand is not an option. This chapter chains massing → Rooms → windows → shading → zones → names, with every key number on a slider so the whole building updates at once.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Room from Solid]] | Convert many closed solids into Rooms |
| [[HB Rooms by Floor Height]] | Group Rooms by average floor height |
| [[HB Rooms by Orientation]] | Group Rooms by facade orientation |
| [[HB Apertures by Ratio]] | Add windows by window-to-wall ratio (WWR) |
| [[HB Apertures by Width Height]] | Add windows by width, height and sill |
| [[HB Apertures by Guide Surface]] | Add windows only over a guide surface |
| [[HB Skylights by Ratio]] | Add skylights by ratio |
| [[HB Louver Shades]] | Generate louver shading |
| [[HB Extruded Border Shades]] | Extrude shading fins around windows |
| [[HB Automatic Zoning]] | Group Rooms into zones by story, orientation and program |
| [[HB Add Prefix]] | Add a consistent name prefix |

## Steps

1. Build one typical floor with a Rhino `Box`, then copy it per story using `Series` + `Move`. Every volume stays closed.
2. Feed all solids to [[HB Room from Solid]] `_geo` in one list, with a shared `_name_` prefix.
3. Run [[HB Rooms by Floor Height]]: `flr_hgts` and `rooms` correspond one-to-one, useful for per-story settings.
4. Run [[HB Rooms by Orientation]]: `n_groups_` = 4 or 8, `north_` = true north angle.
5. Solve adjacency first (Chapter 09). Otherwise interior walls count as exterior and receive windows.
6. Add windows with [[HB Apertures by Ratio]]: `_ratio` = 0.3–0.4, `_sill_height_` = 0.9, `_win_height_` = 1.8, `_subdivide_` = True.
7. For fixed sizes use [[HB Apertures by Width Height]]; for one facade only use [[HB Apertures by Guide Surface]].
8. Add skylights with [[HB Skylights by Ratio]]; add shading with [[HB Louver Shades]] or [[HB Extruded Border Shades]].
9. Run [[HB Automatic Zoning]] to merge similar Rooms into zones. Geometry is unchanged; simulation time drops.
10. Normalize names with [[HB Add Prefix]]. Duplicate IDs fail validation.
11. Put `_ratio`, `_win_height_` and `n_groups_` on sliders and compare schemes.

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_ratio` | 0.2–0.6, or {0.3, 0.2, 0.4, 0.25} | Area ÷ wall, max 0.95; list runs north then clockwise |
| `_win_height_` | 1.5–2.1 m | Ratio wins if the wall is too short |
| `_sill_height_` | 0.9 m | Height above the wall base |
| `_horiz_separ_` | 0.2–0.5 m | Centerline spacing of repeated windows |
| `n_groups_` | 4 or 8 | Orientation groups |
| `north_` | 0–360 | True north from the Y axis |
| `_orient_count_` | 4 or 8 | Orientation splits for zoning |

## Common Pitfalls

- Expecting [[HB Rooms by Floor Height]] to extrude massing. It only groups Rooms by average floor height.
- Adding windows before solving adjacency fills interior walls with glass. Order: massing → Rooms → adjacency → windows.
- Typing `30` for `_ratio`: it is a 0–1 fraction, not a percentage. Likewise, `north_` needs true north, not magnetic north.
- Placing shading indoors. Keep `indoor_` = False for exterior shading.

## Next

Chapter 11 visualizes types, boundary conditions and properties for a final self-check.
