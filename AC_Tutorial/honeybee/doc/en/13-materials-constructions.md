# 13 · Materials and Constructions

> Material → Construction → ConstructionSet, packed in order.

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [Honeybee Energy Setup 1](https://www.bilibili.com/video/BV1Wi4y117iw/)

## What This Chapter Solves

Heat flow through the envelope depends entirely on thermal properties. Honeybee uses three layers: a Material is one layer; a Construction stacks materials in order; a ConstructionSet packs every envelope and interior construction and is assigned to Rooms in one step.
The order cannot be skipped.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Opaque Material]] | Thickness, conductivity, density, specific heat |
| [[HB Opaque Material No Mass]] | R-value only, for insulation equivalents |
| [[HB Window Material]] | U-factor, SHGC and visible transmittance |
| [[HB Opaque Construction]] | Stack materials outside to inside |
| [[HB Window Construction]] | Build a window from glass and gaps |
| [[HB ConstructionSet]] | Pack exterior, ground, interior and subface constructions |
| [[HB Exterior Construction Subset]] / [[HB Ground Construction Subset]] / [[HB Interior Construction Subset]] / [[HB Subface Subset]] | Override one construction category |
| [[HB Apply ConstructionSet]] | Assign the set to Rooms |
| [[HB Apply Opaque Construction]] / [[HB Apply Window Construction]] | Replace one face or window construction |
| [[HB Search Construction Sets]] / [[HB Construction Set by Climate]] | Take a ready set from the standards library |
| [[HB Deconstruct Construction]] | Read back U-value, R-value, SHGC, Tvis |

## Steps

1. Create the wall material with [[HB Opaque Material]]: `_thickness` = 0.2, `_conductivity` = 1.4, `_density` = 2300, `_spec_heat` = 900. Add insulation as another layer or use [[HB Opaque Material No Mass]].
2. Create the glazing with [[HB Window Material]]: `_u_factor` = 2.0, `_shgc` = 0.4, `_t_vis_` = 0.6.
3. Build the construction: [[HB Opaque Construction]] `_materials` runs outside → inside. [[HB Window Construction]] takes glass, with [[HB Window Gap Material]] between panes.
4. Build the set: [[HB ConstructionSet]] `_name` = `MySet`. Use a [[HB Search Construction Sets]] result as `base_constr_set_`, then override parts with the subsets.
5. Assign with [[HB Apply ConstructionSet]] to Rooms; replace a single face or window with [[HB Apply Opaque Construction]] or [[HB Apply Window Construction]].
6. Verify with [[HB Deconstruct Construction]] (`u_fac_si`, `r_val_si`, `shgc`, `t_vis`) and [[HB Deconstruct ConstructionSet]] for all 12 categories.
7. When in doubt, start from [[HB Construction Set by Climate]] with climate zone, vintage and construction type.

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_thickness` | 0.2 m | Meters |
| `_conductivity` | 0.035–1.7 W/mK | Insulation low, concrete high |
| `_density` / `_spec_heat` | 30–2300 kg/m³ / 900–1400 J/kgK | Drives thermal mass |
| `_r_value` | 1.5–4.0 m²K/W | For no-mass layers |
| `_u_factor` | 1.4–2.8 W/m²K | Whole-window conductance |
| `_shgc` | 0.25–0.6 | Lower means more shading |
| `_t_vis_` | 0.3–0.8 | Visible light transmittance |
| `_materials` | Outside → inside | Reversed order gives wrong physics |
| `_climate_zone` / `_vintage_` / `_constr_type_` | 1–8 / 2019 / SteelFramed | ASHRAE set lookup |

## Common Pitfalls

- Reversing the material order. U-value may still look right, but condensation and thermal mass are wrong.
- Creating Materials but no Construction. Materials cannot be assigned to faces directly.
- Treating [[HB Window Material]] as layered glass. Use [[HB Glass Material]] for detailed glazing.
- An incomplete ConstructionSet fails validation for missing categories. Check with [[HB Deconstruct ConstructionSet]].
- Editing a material without reassigning. The set is a snapshot; run [[HB Apply ConstructionSet]] again.

## Next

Chapter 14 adds schedules, occupants, lighting, equipment and ventilation.
