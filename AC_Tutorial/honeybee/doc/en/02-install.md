# 02 · Install and Verify

> One-click install, then two batteries to prove it works.

## What This Chapter Solves

Installing Ladybug Tools also installs the Python libraries, OpenStudio, EnergyPlus and Radiance that the batteries call. Miss one and the components still appear and still turn green — until you press run. This chapter gives the order: install, inspect, then prove it with a minimal example. Version: components 1.9.x (1.9.0 / 1.9.1 on the ribbon), Rhino 7 and 8, Windows and macOS.

| Route | How | For whom |
|---|---|---|
| Pollination installer | Download the official installer, click next | Almost everyone; recommended |
| Manual pip | Install `lbt-grasshopper` and the four packages into Rhino 8 Python | Pinning versions or offline deployment |

The installer places components, core libraries, all three engines and the standard datasets. Manual installs leave Python and engine paths to you and fail far more often.

## Components Used

| Component | Purpose |
|---|---|
| [[HB Check Versions]] | Prints lbt_gh, python, radiance, openstudio, energyplus versions |
| [[HB Config]] | Lists install paths, standards folder and default settings |
| [[LB Versioner]] | Fetches and switches to a given component/library version |
| [[LB Sync Grasshopper File]] | Replaces old batteries with the current ribbon versions |
| [[LB Import EPW]] | Smoke test: reading a file proves the core library works |
| [[LB SunPath]] | Smoke test: drawing a sun path proves numpy and friends work |

## Steps

1. Close Rhino and Grasshopper, and stop any simulation still running.
2. Download the Pollination installer from pollination.cloud, run it, keep the default path, and reboot when it finishes.
3. Open Rhino, type `Grasshopper`, and confirm the Ladybug, Honeybee, HB-Energy and HB-Radiance tabs exist.
4. Drop [[HB Check Versions]]; all five outputs should carry versions. In [[HB Config]], check that `python_exe`, `rad_install`, `os_install` and `ep_install` exist and contain no spaces or non-English characters.
5. Smoke test one: feed a .epw into [[LB Import EPW]] and panel `location`; it should name a city.
6. Smoke test two: pass `location` into `_location` of [[LB SunPath]] with `_scale` = 1; a sun path and compass should appear.
7. To update or pin a version, set `_update` on [[LB Versioner]] to True, or fill `version_` with something like `1.9.0`. For outdated batteries in an old file, run [[LB Sync Grasshopper File]] with `_sync` True.

## Key Inputs

| Input | What to give it |
|---|---|
| `_update` (LB Versioner) | True to actually update; needs internet |
| `version_` (LB Versioner) | Optional, e.g. `1.9.0`; empty means latest dev build |
| `_sync` (LB Sync Grasshopper File) | True; save the file first, the swap cannot be undone |
| `_scale` (LB SunPath) | 1 means a 100 m radius; scale up for large models |
| `_epw_file` | Plain English path, e.g. `D:\weather\Beijing.epw` |

## Common Traps

- Rhino was still running during install, so components landed but engines did not; `energyplus` stays empty.
- Files unzipped from an archive are blocked by Windows; tick "Unblock" in file properties and restart Rhino.
- Several Rhino versions are installed and the plugin only reached one of them.
- Batteries sit orange or flagged `OLD` and you edit values instead of running [[LB Versioner]].
- A proxy is on for the browser but not for Python, so updates and weather downloads time out.

## Next

Once the environment checks out, learn how data flows before copying wiring: read [03 · Interface and Data Flow](03-interface.md).
