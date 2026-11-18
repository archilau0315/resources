# 07 · Comfort and Visualization

> Decide whether people feel comfortable, then draw it well enough to print.
![Psychrometric chart: dry-bulb temperature, relative humidity and comfort zone overlay for thermal comfort evaluation](../assets/shots/07-comfort-psychrometric.png)


## What This Chapter Solves

Three comfort models cover most work, and picking the wrong one hurts more than a bad parameter:

| Model | Where it applies | Component |
|---|---|---|
| PMV / PPD | Conditioned interiors, ISO 7730 | [[LB PMV Comfort]] |
| Adaptive | Naturally ventilated interiors, ASHRAE 55 | [[LB Adaptive Comfort]] |
| UTCI | Outdoors, streets and plazas | [[LB UTCI Comfort]] |

All three need air temperature, mean radiant temperature (MRT), relative humidity and air speed. The difference is where MRT comes from: indoors it is often approximated by air temperature; outdoors you must add sun and sky long-wave exchange with [[LB Outdoor Solar MRT]], or results come out far too kind.

## Components Used

| Component | Purpose |
|---|---|
| [[LB PMV Comfort]] | Hourly PMV, PPD and a comfort flag |
| [[LB Adaptive Comfort]] | Acceptable range for free-running buildings |
| [[LB UTCI Comfort]] | Outdoor UTCI and stress categories |
| [[LB Outdoor Solar MRT]] | Outdoor MRT from sun and sky radiation |
| [[LB Human to Sky Relation]] | Body exposure and sky view fractions for the MRT step |
| [[LB Spatial Heatmap]] | Colours that mesh from a list of values |
| [[LB Legend Parameters]] | Range, segment count, colours and placement |
| [[LB Dump VisualizationSet]] | Exports SVG or JSON for layout work |

## Steps

1. For outdoor comfort, wire `dry_bulb_temperature` to `air_temp`, `relative_humidity` to `_rel_humid`, `wind_speed` to `wind_vel`, set `_run` True, and leave MRT empty for a baseline.
2. Then compute MRT: on [[LB Outdoor Solar MRT]] put the site on `_location`, dry bulb on `_surface_temp`, and the radiation outputs on `_dir_norm_rad`, `_diff_horiz_rad`, `_horiz_infrared`; `_ground_ref_` 0.25. Feed its `mrt` back into [[LB UTCI Comfort]].
3. With surrounding buildings, first get `fract_body_exp` and `sky_exposure` from [[LB Human to Sky Relation]] and wire them into the matching MRT inputs.
4. For indoor PMV, feed indoor air temperature, MRT and relative humidity into [[LB PMV Comfort]] with `_met_rate_` 1.1 and `_clothing_` 0.7. For a free-running room use [[LB Adaptive Comfort]] instead, with the annual outdoor dry bulb on `_out_temp`.
5. Read the outputs: `comfort` is a 0/1 verdict per hour, `pmv` runs from -3 to +3, `ppd` is the percentage dissatisfied.
6. To draw it, put the floor into [[LB Generate Point Grid]] with `_grid_size` 1, then send its `mesh` and your `values` into [[LB Spatial Heatmap]].
7. For colours, set `_index_` on [[LB Color Range]] to 7 (Annual Comfort), wire `colors` into `colors_` of [[LB Legend Parameters]], then `leg_par` into `legend_par_` of the heatmap. Send any `vis_set` to [[LB Dump VisualizationSet]] with `_format_` 0 for SVG.

## Key Inputs

| Input | What to give it |
|---|---|
| `_air_temp` / `_mrt_` / `_rel_humid` | Collections or single values; humidity is 0–100 percent |
| `_air_speed_` / `wind_vel_` | m/s; UTCI expects the 10 m meteorological wind speed |
| `_met_rate_` | 1.0–1.1 met seated, 1.6–2.0 met walking |
| `_index_` (Color Range) | 0 original, 3 Ecotect, 7 Annual Comfort, 8 Thermal |
| `min_` / `max_` (legend) | Fix them by hand so several drawings stay comparable |

## Common Traps

- PMV on a naturally ventilated building, which reads stricter than reality; Adaptive on a sealed one reads too lenient.
- Computing UTCI without MRT, so a sun-baked plaza is judged comfortable.
- Entering relative humidity as 0–1, which makes every hour look bone dry.
- Letting every drawing auto-scale its legend, so beautiful charts cannot be compared.

## Next

That completes the Ladybug line — climate, sun, comfort. Modelling starts next: read [08 · Build Your First Model](08-first-model.md).
