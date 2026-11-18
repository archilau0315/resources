# 截取指定窗口为 PNG（教程配图用）
# 用法： powershell -File tools\gh_shot.ps1 -Title "Grasshopper" -Out assets\shots\01.png
param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$Out,
    [int]$Pid_ = 0
)

Add-Type -AssemblyName System.Drawing

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Text;
using System.Drawing;
using System.Runtime.InteropServices;

public class Shot
{
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc cb, IntPtr p);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr h, StringBuilder s, int n);
    [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr h);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int c);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr h, out RECT r);
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }

    public delegate bool EnumProc(IntPtr h, IntPtr p);

    public static IntPtr Find(string titlePart, uint only)
    {
        IntPtr found = IntPtr.Zero;
        EnumWindows((h, p) =>
        {
            uint pid;
            GetWindowThreadProcessId(h, out pid);
            if (only != 0 && pid != only) return true;
            int len = GetWindowTextLength(h);
            if (len == 0) return true;
            var sb = new StringBuilder(len + 1);
            GetWindowText(h, sb, sb.Capacity);
            if (sb.ToString().IndexOf(titlePart, StringComparison.OrdinalIgnoreCase) >= 0)
            {
                found = h;
                return false;
            }
            return true;
        }, IntPtr.Zero);
        return found;
    }

    public static string Capture(IntPtr hwnd, string path)
    {
        RECT r;
        if (!GetWindowRect(hwnd, out r)) return "GetWindowRect failed";
        int w = r.Right - r.Left, h2 = r.Bottom - r.Top;
        if (w <= 0 || h2 <= 0) return "bad rect";
        using (var bmp = new Bitmap(w, h2))
        {
            using (var g = Graphics.FromImage(bmp))
            {
                g.CopyFromScreen(r.Left, r.Top, 0, 0, new Size(w, h2), CopyPixelOperation.SourceCopy);
            }
            bmp.Save(path, System.Drawing.Imaging.ImageFormat.Png);
        }
        return string.Format("OK {0}x{1}", w, h2);
    }
}
'@

$hwnd = [Shot]::Find($Title, [uint32]$Pid_)
if ($hwnd -eq [IntPtr]::Zero) { Write-Output "NOTFOUND $Title"; exit 1 }

[Shot]::ShowWindow($hwnd, 9) | Out-Null
[Shot]::ShowWindow($hwnd, 3) | Out-Null
[Shot]::SetForegroundWindow($hwnd) | Out-Null
[Shot]::SetCursorPos(20, 20) | Out-Null
Start-Sleep -Milliseconds 1200

$dir = Split-Path -Parent $Out
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

$msg = [Shot]::Capture($hwnd, $Out)
Write-Output $msg
if ($msg -like "OK*") {
    Write-Output ("bytes " + (Get-Item $Out).Length)
} else { exit 1 }
