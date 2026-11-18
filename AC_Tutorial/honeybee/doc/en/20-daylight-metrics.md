# 20 · Daylight Metrics and Simulation

> DF for the worst case, sDA for the year, ASE for glare.
![Annual glare potential: visualization of direct glare risk at all times of the year](../assets/shots/20-glare-daylight.png)


## What This Chapter Solves

Materials, skies, grids and cameras are ready. What remains is choosing the right **recipe** and reading its metrics. **DF** is interior over exterior horizontal illuminance under an overcast sky, in percent. **Annual Daylight** computes hourly illuminance and converts it to DA, cDA and UDI. **sDA** is the percentage of floor **area** reaching the illuminance threshold for the required share of occupied hours. **ASE** is the percentage of area above 1000 lux direct for more than 250 occupied hours. **Point-in-Time** gives one moment for review or rendering.

## Components You Need

| Component | Role | Key input |
|---|---|---|
| [[HB Daylight Factor]] | Overcast DF, no weather | `_model` |
| [[HB Annual Daylight]] | Hourly illuminance and DA | `_wea`, `_schedule_` |
| [[HB Annual Daylight Metrics]] | Recompute DA and UDI | `_results`, `_occ_sch_` |
| [[HB Spatial Daylight Autonomy]] | Compute sDA | `_DA`, `mesh_` |
| [[HB Annual Sunlight Exposure]] | Compute ASE | `_results`, `_occ_sch_` |
| [[HB Imageless Annual Glare]] | Generate DGP results | `_wea`, `_glare_thresh_` |
| [[HB Annual Glare Metrics]] | GA and sGA | `_results` |
| [[HB Direct Sun Hours]] | Cumulative direct sun | `_wea`, `_timestep_` |
| [[HB Point-In-Time Grid-Based]] | Single-moment illuminance | `_sky`, `_metric_` |
| [[HB Point-In-Time View-Based]] | Single-moment image | `_sky`, `_resolution_` |
| [[HB False Color]] | HDR to false color | `_hdr` |
| [[HB Extract HDR]] | Re-project an HDR | `_view`, `_hdr` |
| [[HB Radiance Parameter]] | Quality level | `_detail_level_` |
| [[HB Recipe Settings]] | Workers and folder | `_workers_` |

## Steps

1. Prepare a ModifierSet (Ch. 18), attached grids (Ch. 19) and a `.wea` with `timestep_ = 1`; run [[HB Daylight Factor]] with only `_model` — `results` is a percentage and can feed [[LB Spatial Heatmap]].
2. Annual: [[HB Annual Daylight]] with `_model`, `_wea`, an 8760-hour `_schedule_`, `_thresholds_ = -t 300 -lt 100 -ut 3000` and `enhanced_ = True`.
3. Per-sensor metrics: [[HB Annual Daylight Metrics]] with `_results`, `_occ_sch_`, `_threshold_ = 300`, `_min_max_ = (100, 3000)`; feed DA into `_DA` of [[HB Spatial Daylight Autonomy]] with `mesh_` and `_target_time_ = 0.5`.
4. ASE: [[HB Annual Sunlight Exposure]] with `_threshold_ = 1000` and `_target_hrs_ = 250`; `ASE` is an area percentage, `hrs_above` is per sensor.
5. Glare: [[HB Imageless Annual Glare]] → [[HB Annual Glare Metrics]] with `_glare_thresh_ = 0.4` (DGP) and `_target_time_ = 0.95`. Point-in-time: [[HB Point-In-Time Grid-Based]] for illuminance, [[HB Point-In-Time View-Based]] for HDR, then [[HB False Color]] and [[HB Extract HDR]].
6. Speed: start at `_detail_level_ = 0` in [[HB Radiance Parameter]], then raise it; set `_workers_` in [[HB Recipe Settings]].

## Filling the Parameters

| Parameter | Value | Suggestion |
|---|---|---|
| `_thresholds_` | text | `-t 300 -lt 100 -ut 3000` |
| `_threshold_` | lux | 300 (150 for dwellings) |
| `_min_max_` | lux | `(100, 3000)` |
| `_target_time_` | 0–1 | 0.5 for sDA; 0.95 for glare |
| `_threshold_` (ASE) | lux | 1000 |
| `_target_hrs_` | hours | 250 |
| `_glare_thresh_` | DGP | 0.4 |
| `_resolution_` | pixels | 800; 400 for previews |

## Common Pitfalls

1. **No occupancy schedule**: all hours count as occupied and sDA is inflated.
2. **Average illuminance reported as sDA**: sDA is an **area** percentage.
3. **Chasing low ASE alone**: too little daylight looks the same as good glare control.
4. **WEA timestep other than 1**: [[HB Annual Daylight]] fails.
5. **Grids not attached or materials default**: results are all zero or uniform.

## Next

[Chapter 21 · Case Study](21-case-study.md): the whole workflow on one office room.
