import React from "react";

export default function CategoryPills({ list, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition
            ${
              value === c
                ? "bg-green-600 text-white"
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-100"
            }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
