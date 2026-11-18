"""往教程 md 里插配图。中文和英文同步。

插入规则：找到章节引言（第一个 > 引用块结束位置），在其后、
第一个 ## 之前插入 Markdown 图片语法。已存在同名引用则跳过。
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# slug -> (图片文件名, 中文图注, 英文图注)
MAPPING = {
    '01-what-is-lbt':
        ('02-grasshopper.png',
         'Ladybug Tools 分析工具总览：天气导入、太阳分析、舒适度与辐射评估的完整 Grasshopper 画布',
         'Ladybug Tools analysis tools: complete Grasshopper canvas with weather import, sun analysis, comfort and radiation workflows'),
    '03-interface':
        ('03-rhino-interface.png',
         'Grasshopper 画布与组件连线：左侧 Ladybug 标签页、中间画布、右侧输入 Panel',
         'Grasshopper canvas with connected components: Ladybug tab on the left, canvas in the middle, Panel inputs on the right'),
    '04-weather':
        ('04-weather-epw.png',
         '风垂直剖面与 EPW 数据：从气象文件导入到风速高度分布的工作流',
         'Wind vertical profile and EPW data: workflow from weather file import to wind speed distribution by height'),
    '05-sun-sky':
        ('05-sun-sky.png',
         '年度气象数据映射到太阳轨迹：全年 8760 小时数值在天球上的可视化',
         'Annual weather data mapped to sun path: visualization of all 8760 annual hours on the celestial sphere'),
    '06-data-analysis':
        ('06-data-analysis.png',
         '辐射玫瑰图：各朝向太阳辐射量的比较，叠加周边建筑遮挡',
         'Radiation rose: comparison of solar radiation by orientation, with surrounding building context'),
    '07-comfort-visualize':
        ('07-comfort-psychrometric.png',
         '焓湿图：干球温度、相对湿度与舒适区的叠加，用于热舒适评价',
         'Psychrometric chart: dry-bulb temperature, relative humidity and comfort zone overlay for thermal comfort evaluation'),
    '11-inspect-visualize':
        ('11-color-library.png',
         '颜色库组件：按类型自动分配配色方案，批量给模型上色',
         'Color library component: automatic color scheme assignment by type, batch colorization of the model'),
    '20-daylight-metrics':
        ('20-glare-daylight.png',
         '年度眩光潜力评估：全年各时刻直射眩光风险的可视化',
         'Annual glare potential: visualization of direct glare risk at all times of the year'),
    '21-case-study':
        ('21-case-overview.png',
         '完整案例工作流概览：EPW → 建模 → 开窗 → 构造 → 能量 → 采光 → 结果',
         'Complete case study workflow overview: EPW → model → apertures → constructions → energy → daylight → results'),
}

ZH = os.path.join(ROOT, 'doc', 'zh')
EN = os.path.join(ROOT, 'doc', 'en')


def insert_image(path, filename, zh_cap, en_cap):
    """在引言引用块后插入图片。已存在同名图片引用则跳过。"""
    if not os.path.exists(path):
        return False
    with open(path, encoding='utf-8') as f:
        text = f.read()

    # 已存在同名图片引用则跳过
    if filename in text:
        return False

    # 找引言引用块结束位置（最后一个 > 开头的行之后）
    # 然后找到下一个 ## 标题，在它之前插入图片
    lines = text.split('\n')
    insert_idx = None
    in_quote = False
    quote_end = None

    for i, line in enumerate(lines):
        stripped = line.strip()
        if stripped.startswith('>'):
            in_quote = True
            quote_end = i
        elif stripped == '' and in_quote:
            # 空行，可能是引用块结束
            if quote_end is not None:
                # 检查后面是否还有引用行
                j = i + 1
                while j < len(lines) and lines[j].strip() == '':
                    j += 1
                if j < len(lines) and lines[j].strip().startswith('>'):
                    continue  # 还有引用行
                insert_idx = i  # 在空行处插入
                break
        elif stripped.startswith('##') and quote_end is not None:
            insert_idx = i
            break

    if insert_idx is None:
        return False

    # 判定中文还是英文
    cap = zh_cap if 'zh' in path.replace('\\', '/') else en_cap
    img_line = f'![{cap}](../assets/shots/{filename})'

    # 在 insert_idx 前插入图片（保持空行间隔）
    new_lines = lines[:insert_idx] + [img_line, ''] + lines[insert_idx:]
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    return True


total = 0
for slug, (filename, zh_cap, en_cap) in MAPPING.items():
    zh_path = os.path.join(ZH, f'{slug}.md')
    en_path = os.path.join(EN, f'{slug}.md')
    zh_ok = insert_image(zh_path, filename, zh_cap, en_cap)
    en_ok = insert_image(en_path, filename, zh_cap, en_cap)
    if zh_ok:
        print(f'zh  ok {slug}.md + {filename}')
        total += 1
    if en_ok:
        print(f'en  ok {slug}.md + {filename}')
        total += 1
    if not zh_ok and not en_ok:
        print(f'--  skip {slug} (exists or not found)')

print(f'\ninserted {total} images')
