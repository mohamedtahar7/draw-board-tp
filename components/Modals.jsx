export function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-xs">
        <h3 className="text-base font-semibold text-slate-900">
          Clear Magic Board?
        </h3>
        <p className="text-slate-500 mt-1.5 leading-relaxed">
          This action will erase all drawings on your canvas. This cannot be
          undone.
        </p>
        <div className="flex items-center justify-end gap-2.5 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium cursor-pointer transition-colors shadow-sm"
          >
            Clear Everything
          </button>
        </div>
      </div>
    </div>
  );
}
