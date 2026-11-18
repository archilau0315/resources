# 11 · Inspection and Display

> Draw the model's properties, not just its shape.
![Color library component: automatic color scheme assignment by type, batch colorization of the model](../assets/shots/11-color-library.png)


## What This Chapter Solves

A walk-around does not prove a model is correct. This chapter colors and labels the model by type, boundary condition and attribute, and computes hard numbers such as area, volume and WWR. The output works as a QA drawing and as a presentation image.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Visualize All]] | Show the complete model |
| [[HB Visualize by Type]] | Separate walls, roofs, floors, windows, doors, shades |
| [[HB Visualize by BC]] | Color by boundary condition |
| [[HB Visualize Normals]] | Show face normals |
| [[HB Visualize Wireframe]] | Lightweight wireframe preview |
| [[HB Room Attributes]] | List available Room attributes |
| [[HB Face Attributes]] | List available Face attributes |
| [[HB Label Rooms]] | Write an attribute at each Room center |
| [[HB Label Faces]] | Write an attribute on each Face |
| [[HB Color Room Attributes]] | Color Rooms by attribute |
| [[HB Color Face Attributes]] | Color Faces by attribute |
| [[HB Geometry Properties]] | Wall area, window area, volume, floor area |
| [[HB Deconstruct Model]] | Split the Model into its parts |

## Steps

1. Preview with [[HB Visualize All]] to catch stray or missing faces.
2. Feed [[HB Visualize by Type]] outputs (`walls`, `roofs`, `exterior_floors`, `apertures`, `doors`) into GH `Custom Preview` with different colors. A wrong color means a wrong face type.
3. Use [[HB Visualize by BC]] to confirm `surface` (adjacent) versus `outdoors`.
4. Use [[HB Visualize Normals]]: arrows should point outward. Inward arrows mean flipped Faces.
5. Connect [[HB Room Attributes]] to [[HB Label Rooms]] `_attribute_` and try values such as `name`, `story`, `zone`.
6. Color Rooms or Faces with [[HB Color Room Attributes]] / [[HB Color Face Attributes]]; add `legend_par_` for a legend.
7. Divide `ext_win_area` by `ext_wall_area` from [[HB Geometry Properties]] to get WWR. Use `floor_area` and `volume` as total checks.
8. Extract single objects with [[HB Deconstruct Model]].

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_hb_objs` | Model or object list | Input of every display component |
| `_attribute_` | name / story / zone | Pick from the attribute list output |
| `_txt_height_` | 0.2–0.5 m | Scale to the building; large text overlaps |
| `_rooms_model` | Rooms or Model | Input for labels and coloring |
| `legend_par_` | LB Legend Parameters | Default legend if left empty |

## Common Pitfalls

- Treating color as a property edit. [[HB Color Room Attributes]] only creates display meshes.
- Forgetting `Custom Preview`. The components output geometry, not visible Rhino objects.
- Coloring a large model face by face and freezing. Check with wireframe first, color for final images.
- Leaving `_txt_height_` at its default. It is either huge or invisible depending on model scale.
- Misspelling attribute names. They are case-sensitive; copy them from [[HB Room Attributes]].

## Next

Chapter 12 saves, splits and exchanges the model without losing properties.
