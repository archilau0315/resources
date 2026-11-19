# D · Versions and License

> This tutorial targets Ladybug Tools 1.10.x. The four Grasshopper packages ship independently, and the number on a battery is neither of those versions — this page aligns all three numbering systems and states how the icons and text may be used.

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [LBT Intro and Install](https://www.bilibili.com/video/BV1jT4y1e7yA/)
- [Localized Database for Ladybug Tools](https://www.bilibili.com/video/BV1sX4y1e7Qi/)

## Package Versions

| Package (PyPI name) | Version here | Components | Scope |
|---|---:|---:|---|
| `ladybug-grasshopper` | Ships with 1.10.58 | 122 | Weather, sun, data analysis, charts, comfort |
| `honeybee-grasshopper-core` | Ships with 1.10.58 | 70 | Modelling, display, organisation, serialisation |
| `honeybee-grasshopper-energy` | Ships with 1.10.58 | 143 | Constructions, schedules, loads, HVAC, results |
| `honeybee-grasshopper-radiance` | Ships with 1.10.58 | 94 | Radiance materials, skies, grids, recipes |
| `lbt-grasshopper` | 1.10.58 | — | Meta-package: dependencies and engine install |

Together they account for the 429 components in this project's library. The exact tab-package versions are pinned by the meta-package; [[HB Check Versions]] reports them.

## What the Battery Shows

The `Message` in a battery title bar is the **core library** version, not the package version. Measured locally: most read `1.10.0`; a few read `1.10.1` through `1.10.4`, such as [[HB Room]], [[HB Model to OSM]] and [[LB SunPath]].

So: **1.10.58** is the bundle you installed; the four tab packages carry their own pinned versions; **1.10.0** is the honeybee/ladybug core the battery calls. Three different numbers are normal — what matters is that [[HB Check Versions]] returns all five entries.

## Rhino Compatibility

| Host | Status | Note |
|---|---|---|
| Rhino 7 | Supported | Runs 1.10.x; older UI |
| Rhino 8 | Recommended | Baseline for this tutorial; the first run unpacks engines |
| Rhino 9 | Test it yourself | Development build; use the newest lbt-grasshopper and back up first |

Several Rhino versions can coexist, but the plugin folder is shared. After [[LB Versioner]] updates in Rhino 8, Rhino 7 will announce a version change on the next launch. That is expected.

## License

### Icons: AGPL-3.0

The four packages and their icons are © Ladybug Tools, licensed **GNU AGPL-3.0**. This project uses the icons only to identify component functions:

- extracted from the installed `.ghuser` files, not redrawn;
- never redistributed as a standalone icon pack, never resold;
- every page and entry carries `Icon © Ladybug Tools, AGPL-3.0` with a link to the source repository.

### Text: CC BY-NC 4.0

The Chinese translations, body text, figures and site code are licensed **CC BY-NC 4.0**: copy, adapt and share for non-commercial purposes with attribution and a link back; no commercial use; adaptations keep the same licence. For commercial use — training, consulting deliverables, internal platforms — please ask first.

## Credits

- **Ladybug Tools** — Mostapha Roudsari, Chris Mackey and all contributors; the four open-source packages and the Primers are the single source of truth here.
- **EnergyPlus** — U.S. Department of Energy, NREL, Big Ladder Software.
- **OpenStudio** — Alliance for Sustainable Energy / NREL.
- **Radiance** — Lawrence Berkeley National Laboratory.
- **Community** — everyone on Discourse who ever answered "why won't my model converge".

## Links

| Purpose | Address |
|---|---|
| Site and docs | https://www.ladybug.tools/ · https://docs.ladybug.tools/ |
| Main repository | https://github.com/ladybug-tools/lbt-grasshopper |
| Forum | https://discourse.ladybug.tools/ |
| Install and compatibility matrix | https://github.com/ladybug-tools/lbt-grasshopper/wiki |
| AGPL-3.0 | https://www.gnu.org/licenses/agpl-3.0.html |
| CC BY-NC 4.0 | https://creativecommons.org/licenses/by-nc/4.0/ |

> Versions change; the method does not. After an upgrade, run [[HB Check Versions]], then walk any chapter from model validation to result comparison. If that path still works, the upgrade was fine.
