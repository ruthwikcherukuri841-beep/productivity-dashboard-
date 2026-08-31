"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, TrendingDown, Target, CheckCircle2 } from "lucide-react";
import { useDashboard } from "@/context/dashboard-context";

export function BurndownChart() {
  const { burndownData } = useDashboard();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const width = 600;
  const height = 220;
  const padding = { top: 20, right: 30, bottom: 40, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxPoints = 50;

  // Calculate coordinates
  const idealPoints = burndownData.map((d, i) => {
    const x = padding.left + (i / (burndownData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.ideal / maxPoints) * chartHeight;
    return { x, y, day: d.day, val: d.ideal };
  });

  const actualPoints = burndownData.map((d, i) => {
    const x = padding.left + (i / (burndownData.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.actual / maxPoints) * chartHeight;
    return { x, y, day: d.day, val: d.actual };
  });

  const idealPath = `M ${idealPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const actualPath = `M ${actualPoints.map((p) => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Sprint #39 Burndown & Velocity
              </h3>
              <p className="text-xs text-zinc-400">
                Tracking remaining story points against the ideal burn trajectory
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-zinc-500 border border-zinc-400 border-dashed" />
            <span className="text-zinc-400">Ideal Guideline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            <span className="text-indigo-300 font-medium">Actual Burn</span>
          </div>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56 select-none overflow-visible">
          <defs>
            <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 10, 20, 30, 40, 50].map((val) => {
            const y = padding.top + chartHeight - (val / maxPoints) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 10}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area fill for actual */}
          <path
            d={`${actualPath} L ${actualPoints[actualPoints.length - 1].x},${
              padding.top + chartHeight
            } L ${actualPoints[0].x},${padding.top + chartHeight} Z`}
            fill="url(#actualGradient)"
          />

          {/* Ideal line (dashed) */}
          <path
            d={idealPath}
            fill="none"
            stroke="#71717a"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Actual line (solid indigo glow) */}
          <path
            d={actualPath}
            fill="none"
            stroke="#818cf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {actualPoints.map((p, i) => {
            const isHovered = hoveredIndex === i;
            return (
              <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? 6 : 4}
                  fill="#6366f1"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer transition-all"
                />
                {/* X axis label */}
                <text
                  x={p.x}
                  y={height - 12}
                  textAnchor="middle"
                  fill={isHovered ? "#ffffff" : "#a1a1aa"}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isHovered ? "bold" : "normal"}
                >
                  {p.day.replace(" (Today)", "")}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-2 right-4 bg-zinc-950/90 border border-zinc-700 px-3 py-1.5 rounded-lg shadow-xl text-xs font-mono">
            <span className="text-zinc-400">{burndownData[hoveredIndex].day}: </span>
            <span className="text-indigo-400 font-bold">
              {burndownData[hoveredIndex].actual} pts remaining
            </span>{" "}
            <span className="text-zinc-500">(Ideal: {burndownData[hoveredIndex].ideal} pts)</span>
          </div>
        )}
      </div>

      {/* Bottom Insights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/60 text-xs">
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
          <p className="text-zinc-500 text-[11px]">Sprint Target</p>
          <p className="text-base font-bold text-white font-mono mt-0.5">50 Story Pts</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
          <p className="text-zinc-500 text-[11px]">Completed Pts</p>
          <p className="text-base font-bold text-emerald-400 font-mono mt-0.5">42 Story Pts</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
          <p className="text-zinc-500 text-[11px]">Daily Burn Rate</p>
          <p className="text-base font-bold text-sky-400 font-mono mt-0.5">4.8 pts/day</p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800">
          <p className="text-zinc-500 text-[11px]">Projected Outcome</p>
          <p className="text-base font-bold text-purple-400 font-mono mt-0.5">On Schedule</p>
        </div>
      </div>
    </div>
  );
}
