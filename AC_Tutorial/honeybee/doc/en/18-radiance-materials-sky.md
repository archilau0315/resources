# 18 · Radiance Materials and Skies

> Materials set reflection; skies set where light comes from.

## What This Chapter Solves

EnergyPlus computes heat; Radiance computes light. Radiance results depend on how surfaces reflect and how the sky emits. **Modifiers** are Radiance-specific materials and cannot be reused from EnergyPlus constructions. A **ModifierSet** packages wall, roof, window and shade materials for a whole model. For skies, annual studies use a `.wea` file; point-in-time studies use a CIE or climate-based sky.

## Components You Need

| Component | Role | Key input |
|---|---|---|
| [[HB Opaque Modifier]] | Walls, roofs, floors | `_reflect`, `_rough_` |
| [[HB Glass Modifier]] | Visible transmittance | `_trans`, `_refract_` |
| [[HB Metal Modifier]] | Metal and louvers | `_diff`, `_spec_` |
| [[HB Translucent Modifier]] | Frosted glass, fabric | `_diff_trans` |
| [[HB BSDF Modifier]] | Coatings and shades | `_xml_file` |
| [[HB Search Modifier Sets]] | Ready-made sets | `keywords_` |
| [[HB ModifierSet]] | Package materials | four subset inputs |
| [[HB Apply ModifierSet]] | Assign to rooms or model | `_rooms`, `_mod_set` |
| [[HB Apply Window Modifier]] | Override windows | `_hb_objs`, `_mod` |
| [[HB Apply Face Modifier]] | Override walls | `_hb_objs`, `_mod` |
| [[HB Apply Shade Modifier]] | Shading surfaces | `_hb_objs`, `_mod` |
| [[HB Wea From EPW]] | Annual `.wea` sky | `_epw_file`, `timestep_` |
| [[HB CIE Standard Sky]] | Point-in-time CIE sky | `_location`, `_type_` |
| [[HB Climatebased Sky]] | Point-in-time climate sky | `_wea` plus time |
| [[HB Visualize Sky]] | Preview the sky | `_sky` |

## Steps

1. Search first: empty `keywords_` in [[HB Search Modifier Sets]] returns every library set.
2. Build by surface type: [[HB Opaque Modifier]] for walls; [[HB Glass Modifier]] where `_trans` is **VLT**; [[HB Metal Modifier]] where `_spec_` is usually above 0.9; [[HB Translucent Modifier]] for frosted glass. For complex glazing, load an LBNL WINDOW XML into [[HB BSDF Modifier]] and choose aBSDF when specular transmission dominates.
3. Feed subset components into `_exterior_subset_`, `_subface_subset_` and `_shade_subset_` of [[HB ModifierSet]], then assign with [[HB Apply ModifierSet]]; override single windows or walls with [[HB Apply Window Modifier]] or [[HB Apply Face Modifier]].
4. Annual sky: [[HB Wea From EPW]] with `timestep_ = 1`; filter `hoys_` with [[LB Analysis Period]]. Point-in-time sky: [[HB CIE Standard Sky]] (`_type_` 0 sunny with sun, 4 cloudy, 5 uniform) or [[HB Climatebased Sky]].
5. Check [[HB Visualize Sky]]: the HDR preview and `ghi` should both be plausible.

## Filling the Parameters

| Parameter | Value | Suggestion |
|---|---|---|
| `_reflect` | 0–1 | White wall 0.7–0.8; dark 0.2–0.3 |
| `_spec_` | 0–1 | 0–0.05 for non-metal |
| `_rough_` | 0–1 | Keep below 0.2 |
| `_trans` | 0–1 | Double glazing 0.6–0.7; Low-E 0.4–0.6 |
| `_refract_` | — | 1.52 glass, 1.4 ETFE |
| `_type_` | 0–5 | 0 sunny with sun; 4 cloudy; 5 uniform |
| `timestep_` | integer | 1; Annual Daylight accepts only 1 |
| `_detail_level_` | 0 / 1 / 2 | Low / medium / high |

## Common Pitfalls

1. **Reusing EnergyPlus constructions**: build a separate ModifierSet.
2. **Entering SHGC as `_trans`**: solar gain exceeds VLT and daylight is inflated.
3. **WEA timestep other than 1**: [[HB Annual Daylight]] fails.
4. **Building a set but never applying it**: default gray materials make every room identical.
5. **Reflectance sums above 1**: `_reflect` plus `_spec_` over 1 creates hot spots.

## Next

[Chapter 19 · Sensor Grids and Views](19-sensor-grids-views.md).
