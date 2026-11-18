# C · HBJSON 数据字典

> HBJSON 是 Honeybee 的原生交换格式：一个 JSON 文件装下几何、边界条件、能量属性与采光属性。看懂层级和几个关键字段，你就能用脚本改模型、跨软件传模型，也能在报错时直接定位到具体对象。

Grasshopper 里看到的是电池，磁盘上存的是 HBJSON。很多"结果对不上"的问题，打开文件搜一下 `identifier` 就能定位：到底是两个房间重名，还是窗挂错了面。它也是 Pollination、Python 脚本、gbXML 互转的共同中间态。

## 层级结构

```
Model
├── rooms[]        Room：一个热区 + 一组 Face
│   ├── faces[]    Face：墙 / 屋顶 / 地面 / 天花板
│   │   ├── apertures[]   Aperture：窗（必须挂在 Face 上）
│   │   ├── doors[]       Door：门（必须挂在 Face 上）
│   │   └── shades[]      Shade：附着在面上的遮阳
│   └── properties.energy / properties.radiance
├── shades[]       独立遮阳（不附属于任何房间）
└── properties     模型级属性
```

父子关系是硬约束：窗不能独立存在，必须先有面；面不能独立存在，必须先有房间。这也是"先建模后开窗"这条流程的由来。

## 常用字段

| 字段 | 所在对象 | 含义 | 注意 |
|---|---|---|---|
| `type` | 全部 | 判别器，如 `Model`、`Room`、`Face` | 缺了它整个文件无法解析 |
| `identifier` | 全部 | 唯一标识，脚本与结果靠它对齐 | 只用英文、数字、下划线，改了会断链 |
| `display_name` | 全部 | 给人看的名，可中文 | 可为空，不参与计算 |
| `geometry` | Face / Aperture / Door / Shade | Face3D：`boundary` 顶点环 + 可选 `holes` | 顶点须共面且首尾不重复 |
| `face_type` | Face | `Wall` / `Floor` / `Roof` / `Ceiling` / `AirBoundary` | 类型错了，构造会套错 |
| `boundary_condition` | Face / Aperture / Door | `Outdoors` / `Surface` / `Ground` / `Adiabatic` | 新版为对象，旧文件可能是字符串 |
| `apertures` / `doors` / `shades` | Face / Room | 子对象数组 | 空数组与缺字段等价 |
| `properties.energy` | Room / Face / Aperture | 用途模板、构造、负荷、运行计划 | 能量模拟只读这里 |
| `properties.radiance` | Room / Face / Aperture / Shade | 材质或材质集 | 采光模拟只读这里 |
| `units` / `version` | Model | 单位与文件版本 | 单位默认 `Meters` |

## 精简示例

```json
{
  "type": "Model", "identifier": "Office_Case",
  "units": "Meters", "version": "1.10.0",
  "rooms": [{
    "type": "Room", "identifier": "Office_01",
    "display_name": "南向办公室",
    "faces": [{
      "type": "Face",
      "identifier": "Office_01_South",
      "face_type": "Wall",
      "boundary_condition": { "type": "Outdoors" },
      "geometry": { "type": "Face3D", "boundary": [[0,0,0], [12,0,0], [12,0,3.2], [0,0,3.2]] },
      "apertures": [{
        "type": "Aperture", "identifier": "Office_01_South_Win",
        "is_operable": false,
        "boundary_condition": { "type": "Outdoors" },
        "geometry": { "type": "Face3D", "boundary": [[1,0,0.9], [11,0,0.9], [11,0,2.7], [1,0,2.7]] },
        "properties": { "energy": { "construction": "Generic Double Pane" }, "radiance": { "modifier": "Generic Double Pane" } }
      }]
    }],
    "properties": { "energy": { "program_type": "OpenOffice" }, "radiance": { "modifier_set": "Default" } }
  }]
}
```

示例省略了 `holes`、`plane` 等可自动推导的字段，真实文件由 Honeybee 自动补齐。手改文件时只改 `identifier`、`display_name` 与属性引用，几何交给组件生成。

## 读写与校验

| 目的 | 组件 |
|---|---|
| 存成 HBJSON | [[HB Dump Objects]] |
| 从 HBJSON 读回 | [[HB Load Objects]] |
| 只在内存里互转 | [[HB Object to String]]、[[HB String to Object]] |
| 拆开看内部结构 | [[HB Deconstruct Object]]、[[HB Deconstruct Model]] |
| 旧版本升级 | [[HB Update HBJSON]] |
| 存盘前体检 | [[HB Validate Model]] |
| 转给别的软件 | [[HB Dump gbXML]] |

> 判断文件是否健康，看三件事：`identifier` 是否唯一、每个 `Face` 是否有 `boundary_condition`、每扇 `Aperture` 是否真的在 `apertures` 数组里。三项都对，九成的"导入后模型丢了"都不会发生。
