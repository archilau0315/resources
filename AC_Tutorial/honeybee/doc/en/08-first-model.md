# 08 · Build Your First Model

> From Rhino solids to a validated Honeybee model.

![Grasshopper canvas: geometry → HB Room from Solid → HB Add Subface → HB Model wiring](../assets/shots/02-grasshopper.png)

## What This Chapter Solves

A Rhino box is just geometry; Ladybug Tools cannot read intent from it. This chapter turns closed solids into Honeybee's hierarchy — Model → Room → Face → Aperture / Door — and runs the first validation. The result is a model ready for constructions and loads.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Room from Solid]] | Convert closed Breps or meshes into Rooms |
| [[HB Room]] | Join Honeybee Faces into one Room |
| [[HB Face]] | Declare a Rhino surface as wall, roof or floor |
| [[HB Aperture]] | Turn a rectangle into a window |
| [[HB Door]] | Turn a rectangle into a door |
| [[HB Add Subface]] | Attach and project windows/doors onto a Face |
| [[HB Model]] | Collect Rooms into a Model |
| [[HB Validate Model]] | Report geometry and property issues |
| [[HB Visualize All]] | Preview the whole model in Rhino |

## Steps

1. Set Rhino units to meters and keep the model near the origin.
2. Draw a closed 6 × 5 × 3 m box for one office. One closed volume per Room; no overlaps.
3. Connect the box to [[HB Room from Solid]]: `_geo` takes the Brep, `_name_` = `Room_101`, `conditioned_` = True.
4. Preview it with [[HB Visualize All]] to confirm all six faces exist.
5. Draw a window rectangle on the south wall — sill 0.9 m, height 1.8 m, width 2.4 m — and feed it to [[HB Aperture]] `_geo`.
6. Connect the Room and the aperture to [[HB Add Subface]]: `_hb_obj` = Room, `_sub_faces` = aperture, `project_dist_` = 0.1. Check `unmatched`; any output means the window did not land.
7. Repeat with [[HB Door]] (`glass_` = False) and another [[HB Add Subface]].
8. Connect the final Room to [[HB Model]] `rooms_`, `_name_` = `FirstModel`.
9. Connect the Model to [[HB Validate Model]], set `_validate` = True, and read `report`. Fix every `[SEVERE]`.
10. For full control, build each surface with [[HB Face]] (`_type_` = Wall / RoofCeiling / Floor, `_bc_` = Outdoors) and join six Faces with [[HB Room]].

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_geo` (Room from Solid) | Closed Brep | Open polysurfaces fail |
| `_name_` | Room_101 | Used later in labels and results |
| `conditioned_` | True | Does the room have HVAC? |
| `project_dist_` | 0.1 m | Projects nearby windows onto the wall |
| `_type_` (Face) | Wall / RoofCeiling / Floor | Auto-detected from the normal |
| `_bc_` (Face) | Outdoors | Interior walls belong to Solve Adjacency |
| `_validate` | True | The check only runs when enabled |

## Common Pitfalls

- Feeding Rhino surfaces into [[HB Room]] `_faces`. It accepts Honeybee Faces only; use [[HB Face]] or [[HB Room from Solid]].
- An unclosed volume makes [[HB Room from Solid]] fail. Cap it in Rhino first.
- A window drawn far from the wall stays in `unmatched`; `project_dist_` is a tolerance, not a magnet.
- Inward normals flip face type and boundary condition. Inspect with [[HB Visualize Normals]].
- Overlapping Rooms double-count floor area. Cut them with [[HB Intersect Solids]] next chapter.

## Next

Chapter 09 cleans overlaps, solves adjacencies and adds story/zone data so the model can actually run.
