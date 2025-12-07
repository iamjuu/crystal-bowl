"use client";

import { useState, useEffect } from "react";

interface DynamicMetricCardProps {
  title: string;
  filterType: "month" | "day";
  revenueData: { date: string; revenue: number }[];
  bgColor: string;
}

const formatCurrency = (amount: number) => {
  const value = amount / 100;
  if (value >= 1000000) {
    return `₹${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toFixed(2)}`;
};

export default function DynamicMetricCard({
  title,
  filterType,
  revenueData,
  bgColor,
}: DynamicMetricCardProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [filteredValue, setFilteredValue] = useState<number>(0);
  const [percentage, setPercentage] = useState<string>("0.0");
  const [trend, setTrend] = useState<"up" | "down">("up");
  const [options, setOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (filterType === "month") {
      // Generate month options from revenue data
      const monthsSet = new Set<string>();
      revenueData.forEach((item) => {
        const date = new Date(item.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        monthsSet.add(monthYear);
      });
      
      const monthOptions = Array.from(monthsSet)
        .sort()
        .reverse()
        .map((monthYear) => {
          const [year, month] = monthYear.split("-");
          const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString("en-US", { month: "long" });
          return {
            value: monthYear,
            label: `${monthName} ${year}`,
          };
        });
      
      setOptions(monthOptions);
      if (monthOptions.length > 0) {
        setSelectedFilter(monthOptions[0].value);
      }
    } else if (filterType === "day") {
      // Generate last 30 days options
      const dayOptions = revenueData
        .slice(-30)
        .reverse()
        .map((item) => {
          const date = new Date(item.date);
          return {
            value: item.date,
            label: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          };
        });
      
      setOptions(dayOptions);
      if (dayOptions.length > 0) {
        setSelectedFilter(dayOptions[0].value);
      }
    }
  }, [filterType, revenueData]);

  useEffect(() => {
    if (!selectedFilter) return;

    if (filterType === "month") {
      // Calculate month revenue
      const [year, month] = selectedFilter.split("-");
      const monthRevenue = revenueData
        .filter((item) => {
          const date = new Date(item.date);
          return (
            date.getFullYear() === parseInt(year) &&
            date.getMonth() + 1 === parseInt(month)
          );
        })
        .reduce((sum, item) => sum + item.revenue, 0);

      // Calculate previous month for comparison
      const prevMonth = parseInt(month) === 1 ? 12 : parseInt(month) - 1;
      const prevYear = parseInt(month) === 1 ? parseInt(year) - 1 : parseInt(year);
      const prevMonthRevenue = revenueData
        .filter((item) => {
          const date = new Date(item.date);
          return date.getFullYear() === prevYear && date.getMonth() + 1 === prevMonth;
        })
        .reduce((sum, item) => sum + item.revenue, 0);

      setFilteredValue(monthRevenue);
      
      if (prevMonthRevenue > 0) {
        const growth = ((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100;
        setPercentage(Math.abs(growth).toFixed(1));
        setTrend(growth >= 0 ? "up" : "down");
      } else {
        setPercentage("0.0");
        setTrend("up");
      }
    } else if (filterType === "day") {
      // Calculate day revenue
      const dayData = revenueData.find((item) => item.date === selectedFilter);
      const dayRevenue = dayData ? dayData.revenue : 0;

      // Calculate previous day for comparison
      const currentIndex = revenueData.findIndex((item) => item.date === selectedFilter);
      const prevDayRevenue = currentIndex > 0 ? revenueData[currentIndex - 1].revenue : 0;

      setFilteredValue(dayRevenue);
      
      if (prevDayRevenue > 0) {
        const growth = ((dayRevenue - prevDayRevenue) / prevDayRevenue) * 100;
        setPercentage(Math.abs(growth).toFixed(1));
        setTrend(growth >= 0 ? "up" : "down");
      } else {
        setPercentage("0.0");
        setTrend("up");
      }
    }
  }, [selectedFilter, filterType, revenueData]);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${bgColor} p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {formatCurrency(filteredValue)}
          </p>
          <span className={`text-sm font-semibold ${trend === "up" ? "text-green-400" : "text-red-400"}`}>
            {trend === "up" ? "+" : "-"}{percentage}%
          </span>
        </div>
        <div className={`p-3 rounded-xl ${trend === "up" ? "bg-green-500/20" : "bg-red-500/20"}`}>
          {trend === "up" ? (
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-white">{title}</h3>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="text-xs bg-zinc-700/50 text-white rounded-lg px-2 py-1 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

