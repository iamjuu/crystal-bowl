"use client";

import { useState, useMemo } from "react";

interface YogaSessionsCardProps {
  yogaSessions: {
    total: number;
    totalSeats: number;
    bookedSeats: number;
    byType: {
      regular: { count: number; bookedSeats: number; totalSeats: number };
      corporate: { count: number; bookedSeats: number; totalSeats: number };
      private: { count: number; bookedSeats: number; totalSeats: number };
    };
  };
}

export default function YogaSessionsCard({ yogaSessions }: YogaSessionsCardProps) {
  const [selectedType, setSelectedType] = useState<"all" | "regular" | "corporate" | "private">("all");

  const filteredData = useMemo(() => {
    if (selectedType === "all") {
      return {
        count: yogaSessions.total,
        bookedSeats: yogaSessions.bookedSeats,
        totalSeats: yogaSessions.totalSeats,
      };
    }
    return {
      count: yogaSessions.byType[selectedType].count,
      bookedSeats: yogaSessions.byType[selectedType].bookedSeats,
      totalSeats: yogaSessions.byType[selectedType].totalSeats,
    };
  }, [selectedType, yogaSessions]);

  const occupancyRate = filteredData.totalSeats > 0 
    ? Math.round((filteredData.bookedSeats / filteredData.totalSeats) * 100)
    : 0;

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "regular": return "Discovery";
      case "corporate": return "Corporate";
      case "private": return "Private";
      default: return "All Sessions";
    }
  };

  return (
    <div className="group p-8 hover:bg-zinc-800/50 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-xs font-semibold text-indigo-400">{occupancyRate}% Full</span>
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="text-xs bg-zinc-700/50 text-white rounded-lg px-3 py-1.5 border border-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="regular">Discovery</option>
              <option value="corporate">Corporate</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-2">
          Yoga Sessions
          {selectedType !== "all" && (
            <span className="ml-2 text-indigo-400">• {getTypeLabel(selectedType)}</span>
          )}
        </h3>
        <p className="text-4xl font-bold text-white mb-1">{filteredData.count}</p>
        <p className="text-xs text-zinc-500">
          {filteredData.bookedSeats}/{filteredData.totalSeats} seats booked
        </p>
      </div>
    </div>
  );
}

