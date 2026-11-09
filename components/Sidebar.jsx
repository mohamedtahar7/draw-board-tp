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
  Sliders,
  Grid,
  Feather,
  Highlighter,
  Sparkles,
  Cloud,
  Check,
} from "lucide-react";

const COLORS = [
  { name: "Slate", value: "#1e293b" },
  { name: "Blue", value: "#2563eb" },
  { name: "Sky", value: "#06b6d4" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Violet", value: "#8b5cf6" },
];

const PEN_TYPES = [
  { id: "standard", name: "Standard Pen", icon: Pencil },
  { id: "highlighter", name: "Highlighter", icon: Highlighter },
];

export default function Sidebar({
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
}) {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const currentPenIcon =
    PEN_TYPES.find((p) => p.id === penType)?.icon || Pencil;
  const ActivePenIcon = currentPenIcon;

  return (
    <aside className="absolute left-4 top-1/2 -translate-y-1/2 w-16 bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-xl rounded-2xl flex flex-col items-center py-4 gap-4 z-30 select-none">
      <div className="flex flex-col items-center gap-3">
        {/* Brush Tool */}
        <div className="relative">
          <button
            onClick={() => {
              setTool("pen");
              toggleMenu("pen");
            }}
            className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              tool === "pen"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Brush Tools"
          >
            <ActivePenIcon className="w-5 h-5" />
          </button>

          {activeMenu === "pen" && (
            <div className="absolute left-20 top-0 w-44 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col gap-1 z-40">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                Brush Style
              </span>
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
                    className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs w-full transition-colors cursor-pointer ${
                      penType === p.id && tool === "pen"
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{p.name}</span>
                    </div>
                    {penType === p.id && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
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
          className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            tool === "eraser"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Eraser"
        >
          <Eraser className="w-5 h-5" />
        </button>

        {/* Fill Bucket */}
        <button
          onClick={() => {
            setTool("bucket");
            setActiveMenu(null);
          }}
          className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
            tool === "bucket"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Flood Fill"
        >
          <PaintBucket className="w-5 h-5" />
        </button>

        <div className="w-8 h-[1px] bg-slate-200 my-1" />

        {/* Shapes */}
        <div className="relative">
          <button
            onClick={() => {
              if (!["rectangle", "circle", "triangle", "line"].includes(tool)) {
                setTool("rectangle");
              }
              toggleMenu("shape");
            }}
            className={`p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              ["rectangle", "circle", "triangle", "line"].includes(tool)
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
            title="Shapes"
          >
            {tool === "circle" ? (
              <CircleIcon className="w-5 h-5" />
            ) : tool === "triangle" ? (
              <Triangle className="w-5 h-5" />
            ) : tool === "line" ? (
              <Minus className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>

          {activeMenu === "shape" && (
            <div className="absolute left-20 top-0 w-40 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col gap-1 z-40">
              <button
                onClick={() => {
                  setTool("rectangle");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs w-full text-left transition-colors cursor-pointer ${
                  tool === "rectangle"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Square className="w-4 h-4" /> Rectangle
              </button>
              <button
                onClick={() => {
                  setTool("circle");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs w-full text-left transition-colors cursor-pointer ${
                  tool === "circle"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <CircleIcon className="w-4 h-4" /> Circle
              </button>
              <button
                onClick={() => {
                  setTool("triangle");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs w-full text-left transition-colors cursor-pointer ${
                  tool === "triangle"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Triangle className="w-4 h-4" /> Triangle
              </button>
              <button
                onClick={() => {
                  setTool("line");
                  setActiveMenu(null);
                }}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs w-full text-left transition-colors cursor-pointer ${
                  tool === "line"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Minus className="w-4 h-4" /> Line
              </button>
              <div className="pt-2 mt-1 border-t border-slate-100 flex items-center justify-between px-2 text-xs text-slate-600">
                <span>Fill Shape</span>
                <input
                  type="checkbox"
                  checked={isFilled}
                  onChange={(e) => setIsFilled(e.target.checked)}
                  className="accent-blue-600 cursor-pointer rounded"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-8 h-[1px] bg-slate-200 my-1" />

        {/* Color Palette */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("color")}
            className="p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center hover:bg-slate-100"
            title="Color Palette"
          >
            <span
              className="w-5 h-5 rounded-full border border-slate-300 shadow-sm"
              style={{ backgroundColor: color }}
            />
          </button>

          {activeMenu === "color" && (
            <div className="absolute left-20 top-0 w-48 p-3 rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col gap-3 z-40">
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setColor(c.value);
                      if (tool === "eraser") setTool("pen");
                      setActiveMenu(null);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-transform hover:scale-105 cursor-pointer ${
                      color === c.value
                        ? "border-blue-600 scale-105 shadow-sm"
                        : "border-slate-200"
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
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
            className="p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Brush Size"
          >
            <Sliders className="w-5 h-5" />
          </button>

          {activeMenu === "size" && (
            <div className="absolute left-20 top-0 w-48 p-3 rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col gap-2 z-40">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Thickness</span>
                <span className="font-mono text-blue-600 font-semibold">
                  {lineWidth}px
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => toggleMenu("grid")}
            className="p-3 rounded-xl transition-all cursor-pointer flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Background Theme"
          >
            <Grid className="w-5 h-5" />
          </button>

          {activeMenu === "grid" && (
            <div className="absolute left-20 top-0 w-36 p-1.5 rounded-xl bg-white border border-slate-200 shadow-2xl flex flex-col gap-1 z-40">
              <button
                onClick={() => {
                  setBgTheme("light");
                  setActiveMenu(null);
                }}
                className={`px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                  bgTheme === "light"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Clean Light
              </button>
              <button
                onClick={() => {
                  setBgTheme("grid");
                  setActiveMenu(null);
                }}
                className={`px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                  bgTheme === "grid"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Grid Matrix
              </button>
              <button
                onClick={() => {
                  setBgTheme("dots");
                  setActiveMenu(null);
                }}
                className={`px-3 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                  bgTheme === "dots"
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                Dot Matrix
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-8 h-[1px] bg-slate-200 my-1" />

      {/* History Controls */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
