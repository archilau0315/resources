# 15 · HVAC and Hot Water

> Pick the system type first.

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [HVAC Templates and Natural Ventilation](https://www.bilibili.com/video/BV1gr4y1B7r8/)
- [Thermal Environment Calculation and Butterfly Wind Coupling](https://www.bilibili.com/video/BV1dY411V7uY/)

## What This Chapter Solves

Chapters 13–14 produced **loads** — how much heating and cooling each room needs. Loads are not energy; equipment sits in between. This chapter connects the two along three routes: **Ideal Air Loads** (no equipment, fast baseline), **template systems** (one name builds a full system) and **Detailed HVAC** (Ironbug, special projects only). Hot water is split: demand comes from [[HB Service Hot Water]] in the ProgramType (Ch. 14), equipment from [[HB SHW System]] here.

## Components You Need

| Component | Role | Key input |
|---|---|---|
| [[HB IdealAir]] | Loads only, no equipment | `_rooms`, `_heat_limit_` |
| [[HB All-Air HVAC Templates]] | All-air system list | none |
| [[HB All-Air HVAC]] | VAV / CAV system | `_system_type`, `_vintage_` |
| [[HB DOAS HVAC]] | Outdoor air plus terminals | `_system_type`, `doas_avail_sch_` |
| [[HB HeatCool HVAC]] | Heating/cooling only | `_system_type` |
| [[HB Detailed HVAC]] | Ironbug system | `_hvac_system` |
| [[HB SHW Templates]] | Hot water system list | none |
| [[HB SHW System]] | Heater, tank and losses | `_system_type`, `_efficiency_` |
| [[HB Set Conditioned]] | Mark unconditioned rooms | `_conditioned` |
| [[HB Building Vintages]] | Equipment vintage | none |

## Steps

1. Run [[HB IdealAir]] with `_heat_limit_` and `_cool_limit_` set to `autosize` for an uncapped baseline.
2. Choose a level: central air → all-air; split outdoor air and terminals → DOAS + HeatCool; local units only → HeatCool.
3. Feed the `values` of [[HB All-Air HVAC Templates]] into `_system_type`; never type system names.
4. Connect [[HB Building Vintages]] to `_vintage_` (default `ASHRAE_2019`) to set equipment efficiencies.
5. Set `sensible_hr_` and `latent_hr_` for heat recovery: about 0.5 for a plate exchanger, up to 0.81 / 0.76 for an enthalpy wheel.
6. Enable `dcv_` in rooms with variable occupancy; define hot water demand in the ProgramType first, then assign [[HB SHW System]] with a template from [[HB SHW Templates]].
7. Mark stairs and shafts with [[HB Set Conditioned]] (`_conditioned = False`), then pass every `rooms` output down the model chain.

## Filling the Parameters

| Parameter | Value | Suggestion |
|---|---|---|
| `_system_type` | text | Must come from the matching template `values` |
| `_vintage_` | text | `ASHRAE_2019` by default |
| `sensible_hr_` | 0–1 | 0.5 plate; up to 0.81 enthalpy wheel |
| `latent_hr_` | 0–1 | Enthalpy wheel only, up to 0.76 |
| `dcv_` | boolean | `True` for meeting rooms |
| `_efficiency_` | 0–1 or COP | Gas 0.8, heat pump 2–3, electric 1 |
| `_loss_coeff_` | W/K | Default 6; lower with insulation |
| `_heat_limit_` | W or text | `autosize` for the baseline |

## Common Pitfalls

1. **Treating Ideal Air as real energy**: no fans, pumps or efficiency, so EUI comes out low.
2. **Typing system names**: a typo in `_system_type` fails at once; copy from the template.
3. **Forgetting unconditioned spaces**: stairs and shafts inflate loads and floor area.
4. **DOAS without terminals**: sensible load is untreated and unmet hours jump.
5. **Equipment without water demand**: `hot_water` stays at 0.

## Next

Go to [Chapter 16 · Simulation Setup and Run](16-simulation.md).
