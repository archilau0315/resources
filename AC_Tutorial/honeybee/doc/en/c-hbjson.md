# C · HBJSON Dictionary

> HBJSON is Honeybee's native exchange format: a single JSON file holding geometry, boundary conditions, energy properties and radiance properties. Knowing its hierarchy and a few fields is enough to edit models by script, move them between tools, and trace a bad result to the exact object.

Grasshopper shows batteries; the disk stores HBJSON. Many "the results don't match" problems end with a search for `identifier` in the file: either two rooms share a name or a window is attached to the wrong face.

## 📺 Companion Videos

> From the Bilibili series "Fly! Ladybug & Honeybee" by uploader 孤岛Studio. Opens directly in mainland China — no VPN needed. Links open Bilibili in a new tab.

- [Dragonfly Custom Weather and Design-Day Files](https://www.bilibili.com/video/BV1EL4y1M7Yf/)
- [Course Intro (series overview)](https://www.bilibili.com/video/BV16Y411L7CM/)

## Hierarchy

```
Model
├── rooms[]        Room: one thermal zone plus its faces
│   ├── faces[]    Face: wall / roof / floor / ceiling
│   │   ├── apertures[]   Aperture: window (must sit on a Face)
│   │   ├── doors[]       Door (must sit on a Face)
│   │   └── shades[]      Shade attached to the face
│   └── properties.energy / properties.radiance
├── shades[]       Standalone shades
└── properties     Model-level properties
```

The parent-child rule is hard: a window cannot exist without a face, a face cannot exist without a room. That is why the workflow always builds first and cuts openings second.

## Common Fields

| Field | On | Meaning | Watch out |
|---|---|---|---|
| `type` | all | Discriminator: `Model`, `Room`, `Face` | Without it nothing parses |
| `identifier` | all | Unique key used by scripts and results | English, digits, underscore only; renaming breaks links |
| `display_name` | all | Human-readable name, any language | Optional, never computed |
| `geometry` | Face / Aperture / Door / Shade | Face3D: `boundary` loop plus optional `holes` | Vertices must be coplanar and non-repeating |
| `face_type` | Face | `Wall` / `Floor` / `Roof` / `Ceiling` / `AirBoundary` | Wrong type means the wrong construction |
| `boundary_condition` | Face / Aperture / Door | `Outdoors` / `Surface` / `Ground` / `Adiabatic` | Object in new files, string in old ones |
| `apertures` / `doors` / `shades` | Face / Room | Child object arrays | Empty array equals absent field |
| `properties.energy` | Room / Face / Aperture | Program, construction, loads, schedules | The only input for energy simulation |
| `properties.radiance` | Room / Face / Aperture / Shade | Modifier or modifier set | The only input for daylight simulation |

## Minimal Example

```json
{
  "type": "Model", "identifier": "Office_Case",
  "units": "Meters", "version": "1.10.0",
  "rooms": [{
    "type": "Room", "identifier": "Office_01",
    "display_name": "South Office",
    "faces": [{
      "type": "Face", "identifier": "Office_01_South",
      "face_type": "Wall", "boundary_condition": { "type": "Outdoors" },
      "geometry": { "type": "Face3D", "boundary": [[0,0,0], [12,0,0], [12,0,3.2], [0,0,3.2]] },
      "apertures": [{
        "type": "Aperture", "identifier": "Office_01_South_Win", "is_operable": false,
        "boundary_condition": { "type": "Outdoors" },
        "geometry": { "type": "Face3D", "boundary": [[1,0,0.9], [11,0,0.9], [11,0,2.7], [1,0,2.7]] },
        "properties": { "energy": { "construction": "Generic Double Pane" }, "radiance": { "modifier": "Generic Double Pane" } }
      }]
    }],
    "properties": { "energy": { "program_type": "OpenOffice" }, "radiance": { "modifier_set": "Default" } }
  }]
}
```

Fields such as `holes` and `plane` are omitted here because Honeybee derives them; real files fill them in. When editing by hand, touch only identifiers, display names and property references, and let components generate geometry.

## Reading and Checking

Save with [[HB Dump Objects]], load with [[HB Load Objects]], edit in memory with [[HB Object to String]] or [[HB String to Object]], inspect with [[HB Deconstruct Object]], upgrade with [[HB Update HBJSON]], validate with [[HB Validate Model]], and export to gbXML with [[HB Dump gbXML]].

> Three checks tell you whether a file is healthy: identifiers are unique, every `Face` carries a `boundary_condition`, and every `Aperture` really sits in an `apertures` array. Pass all three and most "the model vanished on import" cases never happen.
