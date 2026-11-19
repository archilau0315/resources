# 14 · Schedules, Loads and Gains

> Schedules set the shape, loads set the size, a ProgramType packs both.

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [Honeybee Energy Setup 1](https://www.bilibili.com/video/BV1Wi4y117iw/)

## What This Chapter Solves

The same building can use twice the energy depending on how it is operated. This chapter builds schedules (0–1 profiles over time), then internal load objects (people, lighting, equipment, ventilation, infiltration, setpoints), and packs them into a ProgramType applied to Rooms in one step.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Weekly Schedule]] | Seven days × 24 values |
| [[HB Constant Schedule]] / [[HB Fixed Interval Schedule]] / [[HB Seasonal Schedule]] | Constant, timestep and seasonal profiles |
| [[HB Schedule to Data]] | Expand to hourly data for charts |
| [[HB People]] | Occupant density, occupancy and activity |
| [[HB Lighting]] / [[HB Equipment]] | Power density and schedule |
| [[HB Infiltration]] / [[HB Ventilation]] | Leakage and design outdoor air |
| [[HB Setpoint]] | Cooling and heating temperatures |
| [[HB ProgramType]] | Pack all of the above |
| [[HB Blend ProgramTypes]] | Mix programs by ratio |
| [[HB Apply ProgramType]] | Assign the program to Rooms |
| [[HB Apply Load Values]] | Override numeric loads per Room |
| [[HB Search Programs]] | Search standard program templates |
| [[HB Deconstruct ProgramType]] | Inspect a program item by item |

## Steps

1. Build schedules: [[HB Weekly Schedule]] takes 24 values for each of `_sun` … `_sat` with `_type_limit_` = `Fraction`; use [[HB Constant Schedule]] with `_values` = 1 for always-on items.
2. Build occupants with [[HB People]]: `_occupancy_sch` = occupancy schedule; leave `_activity_sch_` blank for the 120 W/person default; set occupant density.
3. Build [[HB Lighting]] and [[HB Equipment]] with their own schedules and power densities.
4. Build [[HB Ventilation]] (`_flow_per_person_` ≈ 0.008 m³/s·person or `_ach_`) and [[HB Infiltration]] (`_flow_per_ext_area` ≈ 0.0002 m³/s·m²).
5. Build [[HB Setpoint]] with `_cooling_sch`; its schedule type must be `Temperature`.
6. Pack them in [[HB ProgramType]]: `_people_`, `_lighting_`, `_electric_equip_`, `_infiltration_`, `_ventilation_`, `_setpoint_`; name it `Office_Open`.
7. Assign with [[HB Apply ProgramType]]; `overwrite_` = True clears per-Room load overrides. Tweak one value with [[HB Apply Load Values]] instead of rebuilding.
8. Check with [[HB Deconstruct ProgramType]] and plot a schedule through [[HB Schedule to Data]] plus `LB Hourly Plot`.

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_values` | 0–1 | Fractions, not people or watts |
| `_type_limit_` | Fraction / Temperature / Activity Level | Must match the use |
| Occupant density | 0.05–0.2 person/m² | Office ≈ 0.1 |
| Lighting / equipment power | 5–12 / 5–15 W/m² | Office ≈ 9 W/m² lighting |
| `_flow_per_person_` / `_flow_per_ext_area` | 0.008–0.01 m³/s·person / 0.0001–0.0003 m³/s·m² | Outdoor air and leakage |
| Cooling / heating setpoint | 24–26 / 20–22 °C | Summer and winter |
| `_ratios_` | Sum = 1 | Mixed-use blend |

## Common Pitfalls

- Putting occupant counts or watts into a schedule. Schedules accept fractions only; loads set the magnitude.
- Using a Fraction type limit for a temperature schedule. The simulation rejects it.
- A ProgramType without `_setpoint_` cannot be assigned to a conditioned Room.
- Editing a ProgramType without reassigning it. Rooms hold copies; run [[HB Apply ProgramType]] again.
- Confusing ventilation with infiltration. [[HB Ventilation]] is designed outdoor air; [[HB Infiltration]] is leakage.

## Next

Chapter 15 selects HVAC systems and service hot water.
