"use client";

import { useState } from "react";
import {
  Pencil,
  Eraser,
  Square,
  Circle as CircleIcon,
  Minus,
  Triangle,
  PaintBucket,
  Undo2,
  Redo2,
  ChevronDown,
  Sliders,
  Grid,
  Feather,
  Highlighter,
  Sparkles,
  Cloud,
  Check,
  Download,
  Trash2,
  LogOut,
} from "lucide-react";

const COLORS = [
  { name: "White", value: "#ffffff" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Violet", value: "#a855f7" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Indigo", value: "#6366f1" },
];

const PEN_TYPES = [
  { id: "standard", name: "Standard Pen", icon: Pencil },
  { id: "calligraphy", name: "Calligraphy", icon: Feather },
  { id: "highlighter", name: "Highlighter", icon: Highlighter },
  { id: "neon", name: "Neon Glow", icon: Sparkles },
  { id: "spray", name: "Spray Paint", icon: Cloud },
];

export default function Toolbar({
  tool,
  setTool,
  penType,
  setPenType,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  isFilled,
  setIsFilled,
  handleUndo,
  handleRedo,
  canUndo,
  canRedo,
  bgTheme,
  setBgTheme,
  onExport,
  onClearRequest,
  onExitRequest,
}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const currentPenIcon =
    PEN_TYPES.find((p) => p.id === penType)?.icon || Pencil;
  const ActivePenIcon = currentPenIcon;

  return (
    <header className="h-14 border-b border-indigo-950 bg-[#111425]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 select-none shrink-0 text-xs">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
          ✨
        </div>
        <span className="font-semibold text-slate-100 tracking-tight">
          Magic Board
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
          Creative Studio
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Pen */}
        <div className="relative">
          <button
            onClick={() => {
              setTool("pen");
              toggleMenu("pen");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              tool === "pen"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ActivePenIcon className="w-3.5 h-3.5" />
            <span>Brush</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {activeMenu === "pen" && (
            <div className="absolute top-full mt-2 left-0 w-44 p-1.5 rounded-xl bg-[#16192d] border border-indigo-900/50 shadow-2xl flex flex-col gap-1 z-40">
              {PEN_TYPES.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPenType(p.id);
                      setTool("pen");
                      setActiveMenu(null);
                    }}
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                      penType === p.id && tool === "pen"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{p.name}</span>
                    </div>
                    {penType === p.id && (
                      <Check className="w-3 h-3 text-indigo-200" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Eraser */}
        <button
          onClick={() => {
            setTool("eraser");
            setActiveMenu(null);
          }}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            tool === "eraser"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Eraser</span>
        </button>

        {/* Fill Bucket */}
        <button
          onClick={() => {
            setTool("bucket");
            setActiveMenu(null);
          }}
          className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
            tool === "bucket"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
              : "text-slate-300 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <PaintBucket className="w-3.5 h-3.5" />
          <span>Fill</span>
        </button>

        <div className="w-[1px] h-5 bg-indigo-950 mx-1" />

        {/* Shapes */}
        <div className="relative">
          <button
            onClick={() => {
              if (!["rectangle", "circle", "triangle", "line"].includes(tool)) {
                setTool("rectangle");
              }
              toggleMenu("shape");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              ["rectangle", "circle", "triangle", "line"].includes(tool)
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {tool === "circle" ? (
              <CircleIcon className="w-3.5 h-3.5" />
            ) : tool === "triangle" ? (
              <Triangle className="w-3.5 h-3.5" />
            ) : tool === "line" ? (
              <Minus className="w-3.5 h-3.5" />
            ) : (
              <Square className="w-3.5 h-3.5" />
            )}
            <span>Shape</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {activeMenu === "shape" && (
            <div className="absolute top-full mt-2 left-0 w-36 p-1.5 rounded-xl bg-[#16192d] border border-indigo-900/50 shadow-2xl flex flex-col gap-1 z-40">
              <button
                onClick={() => {
                  setTool("rectangle");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  tool === "rectangle"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Square className="w-3.5 h-3.5" /> Rectangle
              </button>
              <button
                onClick={() => {
                  setTool("circle");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  tool === "circle"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <CircleIcon className="w-3.5 h-3.5" /> Circle
              </button>
              <button
                onClick={() => {
                  setTool("triangle");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  tool === "triangle"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Triangle className="w-3.5 h-3.5" /> Triangle
              </button>
              <button
                onClick={() => {
                  setTool("line");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  tool === "line"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                <Minus className="w-3.5 h-3.5" /> Line
              </button>
              <div className="pt-2 mt-1 border-t border-indigo-950 flex items-center justify-between px-2 text-[11px] text-slate-400">
                <span>Filled</span>
                <input
                  type="checkbox"
                  checked={isFilled}
                  onChange={(e) => setIsFilled(e.target.checked)}
                  className="accent-indigo-500 cursor-pointer rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 bg-indigo-950 mx-1" />

        {/* Colors */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("color")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-indigo-950 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <span
              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs"
              style={{ backgroundColor: color }}
            />
            <span className="font-mono text-[11px]">{color}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {activeMenu === "color" && (
            <div className="absolute top-full mt-2 left-0 w-48 p-3 rounded-xl bg-[#16192d] border border-indigo-900/50 shadow-2xl flex flex-col gap-3 z-40">
              <div className="grid grid-cols-4 gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setColor(c.value);
                      if (tool === "eraser") setTool("pen");
                      setActiveMenu(null);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border cursor-pointer transition-transform hover:scale-105 ${
                      color === c.value
                        ? "border-white scale-105"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="pt-2 border-t border-indigo-950 flex items-center justify-between text-slate-400">
                <span>Custom</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value);
                    if (tool === "eraser") setTool("pen");
                  }}
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Thickness Slider */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("size")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-indigo-950 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-[11px]">{lineWidth}px</span>
          </button>

          {activeMenu === "size" && (
            <div className="absolute top-full mt-2 left-0 w-44 p-3 rounded-xl bg-[#16192d] border border-indigo-900/50 shadow-2xl flex flex-col gap-2 z-40">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Thickness</span>
                <span className="font-mono text-slate-200">{lineWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("theme")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-indigo-950 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Board Theme"
          >
            <Grid className="w-3.5 h-3.5 text-indigo-400" />
          </button>

          {activeMenu === "theme" && (
            <div className="absolute top-full mt-2 left-0 w-36 p-1.5 rounded-xl bg-[#16192d] border border-indigo-900/50 shadow-2xl flex flex-col gap-1 z-40">
              <button
                onClick={() => {
                  setBgTheme("dark");
                  setActiveMenu(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  bgTheme === "dark"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                Deep Navy
              </button>
              <button
                onClick={() => {
                  setBgTheme("paper");
                  setActiveMenu(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  bgTheme === "paper"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                Clean Paper
              </button>
              <button
                onClick={() => {
                  setBgTheme("grid");
                  setActiveMenu(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  bgTheme === "grid"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                Grid Matrix
              </button>
              <button
                onClick={() => {
                  setBgTheme("dots");
                  setActiveMenu(null);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                  bgTheme === "dots"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
              >
                Dot Matrix
              </button>
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 bg-indigo-950 mx-1" />

        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-900/60 border border-indigo-950 rounded-lg overflow-hidden">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer transition-colors"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-indigo-950 text-slate-300 hover:text-white hover:bg-indigo-600/20 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
        <button
          onClick={onClearRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-indigo-950 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
        <button
          onClick={onExitRequest}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-indigo-950 text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
}
