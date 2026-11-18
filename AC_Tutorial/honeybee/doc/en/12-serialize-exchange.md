# 12 · Serialize and Exchange

> Save, reload and share without losing properties.

![Component wiring: the model travels between components as an Object data stream](../assets/shots/03-rhino-interface.png)

## What This Chapter Solves

A model should not live only inside the current Grasshopper file. This chapter covers three tasks: splitting a model into the parts you need, writing objects to disk and reading them back, and exchanging with OpenStudio, EnergyPlus and gbXML. The rule: serialization keeps properties, manual rebuilding does not.

## Components Needed

| Component | Purpose |
|---|---|
| [[HB Deconstruct Model]] | Extract Rooms, Faces, Apertures, Doors, Shades |
| [[HB Deconstruct Object]] | Split one object into its parts |
| [[HB Dump Objects]] | Write objects to a JSON (HBJSON) file |
| [[HB Load Objects]] | Read objects back from JSON |
| [[HB Dump Compressed Objects]] | Write a compact `.pkl` file |
| [[HB Load Compressed Objects]] | Read the compressed file |
| [[HB Object to String]] | Serialize an object to a JSON string |
| [[HB String to Object]] | Restore an object from a string |
| [[HB Dump gbXML]] | Export gbXML for other energy tools |
| [[HB Model to OSM]] | Produce an OpenStudio/EnergyPlus model |
| [[HB Load gbXML OSM IDF]] | Import gbXML, OSM or IDF |
| [[HB Update HBJSON]] | Upgrade an old HBJSON to the current schema |

## Steps

1. Split with [[HB Deconstruct Model]] and take only the outputs you need.
2. Save with [[HB Dump Objects]]: `_hb_objs` = objects, `_name_` = file name, `_folder_` = directory, `_dump` = True.
3. Reload with [[HB Load Objects]]: `_hb_file` = the `hb_file` output above, `_load` = True.
4. For large files use [[HB Dump Compressed Objects]] and [[HB Load Compressed Objects]]. The `.pkl` format is for Honeybee round-trips, not external delivery.
5. To pass an object through a Panel or a database, use [[HB Object to String]] and [[HB String to Object]].
6. For external tools, [[HB Dump gbXML]] writes gbXML; [[HB Model to OSM]] needs an EPW and produces OSM/IDF.
7. Open someone else's file with [[HB Load gbXML OSM IDF]]; set `reset_props_` = True to import geometry and boundary conditions only.
8. Upgrade old projects with [[HB Update HBJSON]]: feed the file path, leave `version_` blank, set `_update` = True.

## Settings

| Parameter | Value | Note |
|---|---|---|
| `_name_` | project_version | No extension; added automatically |
| `_folder_` | Project folder | Blank writes to the default simulation folder |
| `_dump` / `_load` | True | Nothing happens otherwise |
| `indent_` | 2 | Readable JSON |
| `abridged_` | False | True strips fields and cannot be restored |
| `reset_props_` | False | True imports geometry and BCs only |
| `version_` | Blank | Blank upgrades to the installed schema |

## Common Pitfalls

- Archiving with `abridged_` = True. The result reads as text but cannot be rebuilt as objects.
- Sending `.pkl` files to colleagues on another version. Deliver HBJSON instead.
- Dumping Rooms but not standalone Materials or Schedules. Defined resources must be dumped too.
- Using paths with Chinese characters or spaces. Some engines fail; keep paths short and ASCII.
- Simulating an imported gbXML immediately. Validate and reassign properties first.

## Next

Chapter 13 assigns materials and constructions to the finished model.
