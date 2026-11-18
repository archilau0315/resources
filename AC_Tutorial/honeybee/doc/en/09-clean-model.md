# 09 · Clean and Validate the Model

> Cut overlaps, solve adjacency, pass validation.

## What This Chapter Solves

The first model only has to look right. Real projects have overlapping masses, walls that miss by a millimeter, and interior walls still treated as exterior. This chapter fixes the geometry, builds room-to-room adjacencies, and validates until no severe errors remain.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Intersect Solids]] | Cut overlapping volumes into matching faces |
| [[HB Planarize Brep]] | Split curved surfaces into planar faces |
| [[HB Solve Adjacency]] | Detect shared walls and set Surface conditions |
| [[HB Patch Missing Adjacency]] | Turn unmatched faces into Adiabatic |
| [[HB Validate Model]] | Check geometry, adjacency and extension properties |
| [[HB Face]] | Set face type and boundary condition manually |
| [[HB Set Story]] | Assign a story name |
| [[HB Set Zone]] | Group Rooms into one thermal zone |
| [[HB Set Multiplier]] | Represent repeated identical Rooms once |
| [[HB Visualize by BC]] | Color faces by boundary condition |

## Steps

1. Run all Rooms through [[HB Intersect Solids]] with `_run` = True. The `int_rooms` output has aligned, matchable walls.
2. Connect `int_rooms` to [[HB Solve Adjacency]] `_rooms` and set `_run` = True. Coplanar overlapping walls become Surface on both sides.
3. Check with [[HB Visualize by BC]]: `outdoors` should be real exterior walls, `surface` should be partitions.
4. For a partial model, [[HB Patch Missing Adjacency]] sets unmatched faces to Adiabatic. It also removes their windows, so never use it to hide gaps.
5. Run [[HB Planarize Brep]] on curved surfaces, then solve adjacency again.
6. Validate: [[HB Validate Model]] `_model` = Model, `extension_` = `Energy` or `Radiance` (blank or `Generic` checks everything), `_validate` = True.
7. Organize: [[HB Set Story]] (`L1`), [[HB Set Zone]] for shared HVAC zones, [[HB Set Multiplier]] for repeated floors.
8. Re-validate after every change until only warnings remain.

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_run` (Intersect) | True | Nothing computes otherwise |
| `_cpu_count_` | Blank | Defaults to CPUs minus one |
| `adiabatic_` | False | True makes adjacencies non-heat-transferring |
| `air_boundary_` | False | True for open-plan air boundaries |
| `overwrite_` | False | Re-solve existing Surface conditions |
| `extension_` | Blank / Energy / Radiance | Which property set to validate |
| `_multiplier` | 1–30 | Only for truly identical Rooms |

## Common Pitfalls

- Solving adjacency before intersecting. Faces that do not overlap exactly are missed, so interior walls stay Outdoors and loads are overstated.
- A 1 mm gap looks closed but is not coplanar. Align or intersect.
- Setting `adiabatic_` = True everywhere hides heat flow and makes results optimistic.
- Overusing Patch Missing Adjacency turns a broken model into a passing one. Fix geometry first.
- Ignoring warnings. Missing constructions and schedules often appear as warnings and fail during simulation.

## Next

With a clean model, Chapter 10 automates windows, shading and zoning.
