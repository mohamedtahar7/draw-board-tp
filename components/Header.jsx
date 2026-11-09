import { Trash2 } from "lucide-react";

export default function Header({ onClearRequest }) {
  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between z-20 select-none shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-bold text-sm tracking-tight text-slate-800">
          DrawingBoard
        </span>
      </div>

      <button
        onClick={onClearRequest}
        className="flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-100 transition-all cursor-pointer shadow-xs"
      >
        <Trash2 className="w-4 h-4" />
        Clear Board
      </button>
    </header>
  );
}
