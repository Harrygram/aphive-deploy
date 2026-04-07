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
import { getCommentGrowthData } from "./getCommentGrowth"

interface MonthlyCommentCount {
  month: string
  comments: number
}

export default function CommentReportPage() {
  const [chartData, setChartData] = useState<MonthlyCommentCount[]>([])
  const [change, setChange] = useState<number>(0)

  useEffect(() => {
    async function fetchData() {
      const data = await getCommentGrowthData()
      setChartData(data)

      if (data.length >= 2) {
        const last = data[data.length - 1].comments
        const prev = data[data.length - 2].comments
        const percentChange = ((last - prev) / (prev || 1)) * 100
        setChange(percentChange)
      }
    }

    fetchData()
  }, [])

  const isUp = change >= 0
  const trendText = isUp ? "Trending up" : "Trending down"
  const trendColor = isUp ? "text-[#e87db4]" : "text-red-600"
  const TrendIcon = isUp ? TrendingUp : TrendingDown

  function handleExportCSV() {
    const headers = ["Month", "Comments"]
    const rows = chartData.map((row) => [row.month, row.comments])
    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "comment_growth_report.csv"
    link.click()
  }

  return (
    <>
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Comment Growth Report</h1>
              <p className="text-sm text-gray-600">
                View and analyze monthly comment activity
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
              <h2 className="text-xl font-semibold">Comments Over Time</h2>
              <p className="text-gray-500">
                Showing total new comments created each month
              </p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fa5cae" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fa5cae" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="comments"
                  stroke="#e87db4"
                  fillOpacity={1}
                  fill="url(#colorComments)"
                />
              </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 text-sm text-gray-600">
              <p className={`font-medium flex items-center gap-2 ${trendColor}`}>
                {trendText} by {Math.abs(change).toFixed(1)}%
                <TrendIcon className="h-4 w-4" />
              </p>
              <p className="text-muted-foreground">
                Data reflects comments posted by month
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
