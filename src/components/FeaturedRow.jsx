import React from "react";

export default function FeaturedRow({ items }) {
  return (
    <div className="mb-8 -mx-6 px-6">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none py-1">
        {items.map((c) => (
          <article
            key={c.id}
            className={`min-w-[280px] sm:min-w-[320px] snap-start rounded-2xl overflow-hidden
                        bg-gradient-to-br ${c.color} shadow-sm hover:shadow-md transition`}
          >
            <div className="grid grid-cols-5">
              <div className="col-span-3 p-5">
                <h3 className="text-green-900 font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-700">{c.subtitle}</p>
              </div>
              <div className="col-span-2 h-24 overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
