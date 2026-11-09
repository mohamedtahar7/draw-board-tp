"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { DeleteModal } from "@/components/Modals";

export default function MagicBoard() {
  const canvasRef = useRef(null);
  const canvasSnapshot = useRef(null); // Fix for shape drawing previews
  const [tool, setTool] = useState("pen");
  const [penType, setPenType] = useState("standard");
  const [color, setColor] = useState("#2563eb"); // Vibrant Blue default
  const [lineWidth, setLineWidth] = useState(4);
  const [isFilled, setIsFilled] = useState(false);
  const [bgTheme, setBgTheme] = useState("light");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const getBackgroundColor = useCallback(() => {
    return "#ffffff";
  }, []);

  const drawGrid = useCallback(
    (ctx, width, height) => {
      if (bgTheme === "grid") {
        ctx.strokeStyle = "#f1f5f9";
        ctx.lineWidth = 1;
        const gridSize = 32;
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (bgTheme === "dots") {
        ctx.fillStyle = "#cbd5e1";
        const gridSize = 24;
        for (let x = 12; x < width; x += gridSize) {
          for (let y = 12; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    },
    [bgTheme],
  );

  const saveState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL();
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyStep + 1);
      return [...newHistory, dataUrl];
    });
    setHistoryStep((prev) => prev + 1);
  }, [historyStep]);

  const restoreState = useCallback(
    (step) => {
      const canvas = canvasRef.current;
      if (!canvas || !history[step]) return;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = history[step];
      img.onload = () => {
        ctx.fillStyle = getBackgroundColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGrid(ctx, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
    },
    [history, getBackgroundColor, drawGrid],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      ctx.fillStyle = getBackgroundColor();
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, canvas.width, canvas.height);
      ctx.drawImage(tempCanvas, 0, 0);

      if (historyStep === -1) {
        saveState();
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [bgTheme, getBackgroundColor, drawGrid, historyStep, saveState]);

  const handleUndo = () => {
    if (historyStep > 0) {
      const nextStep = historyStep - 1;
      setHistoryStep(nextStep);
      restoreState(nextStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const nextStep = historyStep + 1;
      setHistoryStep(nextStep);
      restoreState(nextStep);
    }
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = getBackgroundColor();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawGrid(ctx, canvas.width, canvas.height);
    saveState();
    setIsDeleteConfirmOpen(false);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const floodFill = (startX, startY, fillColorHex) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const sx = Math.floor(startX);
    const sy = Math.floor(startY);
    if (sx < 0 || sx >= width || sy < 0 || sy >= height) return;

    const startIdx = (sy * width + sx) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];
    const startA = data[startIdx + 3];

    const r = parseInt(fillColorHex.slice(1, 3), 16);
    const g = parseInt(fillColorHex.slice(3, 5), 16);
    const b = parseInt(fillColorHex.slice(5, 7), 16);
    const a = 255;

    if (startR === r && startG === g && startB === b && startA === a) return;

    const colorMatch = (idx) => {
      return (
        data[idx] === startR &&
        data[idx + 1] === startG &&
        data[idx + 2] === startB &&
        data[idx + 3] === startA
      );
    };

    const stack = [[sx, sy]];
    const visited = new Uint8Array(width * height);

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      if (x < 0 || x >= width || y < 0 || y >= height) continue;

      const idx = y * width + x;
      if (visited[idx]) continue;
      visited[idx] = 1;

      const pixelIdx = idx * 4;
      if (!colorMatch(pixelIdx)) continue;

      data[pixelIdx] = r;
      data[pixelIdx + 1] = g;
      data[pixelIdx + 2] = b;
      data[pixelIdx + 3] = a;

      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
    }

    ctx.putImageData(imgData, 0, 0);
    saveState();
  };

  const setupBrushContext = (ctx) => {
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1.0;

    if (tool === "eraser") {
      ctx.strokeStyle = getBackgroundColor();
      ctx.lineWidth = lineWidth * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      return;
    }

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    if (penType === "highlighter") {
      ctx.globalAlpha = 0.35;
      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
    } else if (penType === "neon") {
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    } else {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  };

  const startDrawing = (e) => {
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);

    if (tool === "bucket") {
      floodFill(x, y, color);
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Capture snapshot for shape previews (fixes shape drawing bug)
    if (["rectangle", "circle", "triangle", "line"].includes(tool)) {
      canvasSnapshot.current = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height,
      );
    }

    setupBrushContext(ctx);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (tool === "pen" || tool === "eraser") {
      if (penType === "spray" && tool === "pen") {
        ctx.fillStyle = color;
        const density = lineWidth * 3;
        for (let i = 0; i < density; i++) {
          const offsetX = (Math.random() - 0.5) * lineWidth * 2.5;
          const offsetY = (Math.random() - 0.5) * lineWidth * 2.5;
          ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
      } else if (penType === "calligraphy" && tool === "pen") {
        ctx.beginPath();
        ctx.moveTo(x - lineWidth, y - lineWidth);
        ctx.lineTo(x + lineWidth, y + lineWidth);
        ctx.stroke();
      } else {
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    } else {
      // Restore clean snapshot synchronously for lag-free shape previews
      if (canvasSnapshot.current) {
        ctx.putImageData(canvasSnapshot.current, 0, 0);
      }

      setupBrushContext(ctx);
      ctx.beginPath();

      if (tool === "rectangle") {
        const w = x - startPos.x;
        const h = y - startPos.y;
        if (isFilled) ctx.fillRect(startPos.x, startPos.y, w, h);
        ctx.strokeRect(startPos.x, startPos.y, w, h);
      } else if (tool === "circle") {
        const radius = Math.sqrt(
          Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2),
        );
        ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
        if (isFilled) ctx.fill();
        ctx.stroke();
      } else if (tool === "triangle") {
        ctx.moveTo(startPos.x + (x - startPos.x) / 2, startPos.y);
        ctx.lineTo(startPos.x, y);
        ctx.lineTo(x, y);
        ctx.closePath();
        if (isFilled) ctx.fill();
        ctx.stroke();
      } else if (tool === "line") {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = (e) => {
    if (isDrawing) {
      if (e && e.cancelable) e.preventDefault();
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      setIsDrawing(false);
      canvasSnapshot.current = null;
      saveState();
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-screen select-none overflow-hidden bg-slate-50">
      <Header onClearRequest={() => setIsDeleteConfirmOpen(true)} />

      <main className="relative flex-1 w-full h-full cursor-crosshair">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block bg-white"
        />

        <Sidebar
          tool={tool}
          setTool={setTool}
          penType={penType}
          setPenType={setPenType}
          color={color}
          setColor={setColor}
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          isFilled={isFilled}
          setIsFilled={setIsFilled}
          handleUndo={handleUndo}
          handleRedo={handleRedo}
          canUndo={historyStep > 0}
          canRedo={historyStep < history.length - 1}
          bgTheme={bgTheme}
          setBgTheme={setBgTheme}
        />
      </main>

      <DeleteModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={clearBoard}
      />
    </div>
  );
}
