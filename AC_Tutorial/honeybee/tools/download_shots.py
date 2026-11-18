"""下载 Ladybug Tools 官方 Grasshopper 画布截图到 assets/shots/。

内部用，不商用。图片来源 Food4Rhino Ladybug Tools 插件页与 Ladybug Tools Academy。
"""
import os
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DST = os.path.join(ROOT, 'assets', 'shots')
os.makedirs(DST, exist_ok=True)

# (文件名, URL, 用途)
SHOTS = [
    ('02-grasshopper.png',
     'https://static.food4rhino.com/cdn/farfuture/8XZU9fptPuWmBvkjWX9kZkV48ZK2MGg2YTovlGfvWtg/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/ladybug_analysis_tools.png?itok=JyDGr4E5',
     '02-install 安装后 Grasshopper 标签页'),
    ('03-rhino-interface.png',
     'https://www.food4rhino.com/en/system/files/styles/large/private/PluginDiagrams4.jpg?itok=BEOzgyFg',
     '03-interface Grasshopper 界面与数据流'),
    ('04-weather-epw.png',
     'https://static.food4rhino.com/cdn/farfuture/evFMoDtgPIIikqhdet1dNeVEscH0fSTj-9HHDSfjQxs/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/wind_vertical_profile_rhino.png?itok=W4bjFHOc',
     '04-weather 风垂直剖面 + EPW 数据'),
    ('05-sun-sky.png',
     'https://static.food4rhino.com/cdn/farfuture/-_I7EeWbmpnJGpSs3-RQuxBNsVJPuKPXZdUscC5TkYs/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/mapping_annual_data_on_sun_path_rhino.png?itok=UR1F4PwH',
     '05-sun-sky 年度数据映射到太阳路径'),
    ('05-sun-visibility.png',
     'https://static.food4rhino.com/cdn/farfuture/oWql1GVXxUh3V99qKnK5yZ4alPFNVQWWkeMbeKZGCWM/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/find_when_sun_is_visible_to_a_point_rhino.png?itok=XUS4dy-t',
     '05-sun-sky 太阳可见性'),
    ('06-data-analysis.png',
     'https://static.food4rhino.com/cdn/farfuture/ArLSTwf7bKi7X12KHRB4p6saiwcGekm93SEjMEKQeHc/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/radiation_rose_with_context_rhino.png?itok=D_UhKFsx',
     '06-data-analysis 辐射玫瑰图'),
    ('07-comfort-psychrometric.png',
     'https://www.food4rhino.com/en/system/files/styles/large/private/psychrometric_chart_rhino.png?itok=EDHywTuK',
     '07-comfort-visualize 焓湿图'),
    ('07-glare-potential.png',
     'https://static.food4rhino.com/cdn/farfuture/BGT82USIJiCaaRjEb2OrlYU4p-cBvnDEnqGlA6D7qqE/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/estimate_glare_potential_over_a_year_rhino.png?itok=GtjCsnmy',
     '07-comfort-visualize 年度眩光'),
    ('11-color-library.png',
     'https://static.food4rhino.com/cdn/farfuture/y_Y_wD-o6kjaZqwAghy2uYIBwz165urWxYXzvV5Uhss/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/color_library_rhino.png?itok=ufbpPT1t',
     '11-inspect-visualize 颜色库'),
    ('20-glare-daylight.png',
     'https://static.food4rhino.com/cdn/farfuture/BGT82USIJiCaaRjEb2OrlYU4p-cBvnDEnqGlA6D7qqE/mtime:1680615125/sites/default/files/public/styles/large/public/users-files/ladybug-tools/app/estimate_glare_potential_over_a_year_rhino.png?itok=GtjCsnmy',
     '20-daylight-metrics 眩光与采光'),
    ('21-case-overview.png',
     'https://www.food4rhino.com/en/system/files/styles/large/private/PluginDiagrams5.jpg?itok=KvrP96-j',
     '21-case-study 完整案例工作流'),
]

hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

ok = 0
for name, url, note in SHOTS:
    path = os.path.join(DST, name)
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        print('skip', name, 'exists')
        ok += 1
        continue
    try:
        req = urllib.request.Request(url, headers=hdr)
        with urllib.request.urlopen(req, timeout=20) as r, open(path, 'wb') as f:
            f.write(r.read())
        print('ok', name, note)
        ok += 1
    except Exception as e:
        print('FAIL', name, e)

print(f'done {ok}/{len(SHOTS)}')
