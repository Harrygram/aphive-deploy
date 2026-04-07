"use client"

import { useEffect, useState } from "react"
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Download } from "lucide-react"
import { getCommunityGrowthData } from "./getCommunityGrowth"

interface MonthlyCommunityCount {
  month: string
  communities: number
}

export default function CommunityReportPage() {
  const [chartData, setChartData] = useState<MonthlyCommunityCount[]>([])
  const [change, setChange] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      const data = await getCommunityGrowthData()
      setChartData(data)

      if (data.length >= 2) {
        const last = data[data.length - 1].communities
        const prev = data[data.length - 2].communities
        const percentChange = ((last - prev) / (prev || 1)) * 100
        setChange(percentChange)
      }
    }

    fetchData()
  }, [])

  const isUp = change >= 0
  const trendText = isUp ? "Trending up" : "Trending down"
  const trendColor = isUp ? "text-green-600" : "text-red-600"
  const TrendIcon = isUp ? TrendingUp : TrendingDown

  function handleExportCSV() {
    const headers = ["Month", "New Communities"]
    const rows = chartData.map((row) => [row.month, row.communities])
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "community_growth_report.csv"
    link.click()
  }

  return (
    <>
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Community Growth Report</h1>
              <p className="text-sm text-gray-600">
                View and analyze how many communities were created each month
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 border px-3 py-1.5 rounded-md text-sm hover:bg-gray-100"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">New Communities Over Time</h2>
              <p className="text-gray-500">
                Total communities created by month
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="communities"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCom)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 text-sm text-gray-600">
              <p className={`font-medium flex items-center gap-2 ${trendColor}`}>
                {trendText} by {Math.abs(change).toFixed(1)}%
                <TrendIcon className="h-4 w-4" />
              </p>
              <p className="text-muted-foreground">
                Data reflects community creation by month
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
