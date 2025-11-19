"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Wifi, Shield } from "lucide-react"

const systemMetrics = [
  {
    name: "API Response Time",
    value: 145,
    unit: "ms",
    status: "good",
    icon: Server,
    color: "text-green-600",
  },
  {
    name: "Database Performance",
    value: 92,
    unit: "%",
    status: "excellent",
    icon: Database,
    color: "text-blue-600",
  },
  {
    name: "Network Uptime",
    value: 99.9,
    unit: "%",
    status: "excellent",
    icon: Wifi,
    color: "text-green-600",
  },
  {
    name: "Security Score",
    value: 98,
    unit: "%",
    status: "excellent",
    icon: Shield,
    color: "text-purple-600",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "excellent":
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    case "good":
      return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    case "warning":
      return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
    case "critical":
      return <Badge className="bg-red-100 text-red-800">Critical</Badge>
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
  }
}

export function SystemHealth() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemMetrics.map((metric) => (
            <div key={metric.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                </div>
                {getStatusBadge(metric.status)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                    {metric.unit}
                  </span>
                </div>

                {metric.unit === "%" && <Progress value={metric.value} className="h-2" />}

                {metric.unit === "ms" && (
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (300 - metric.value) / 3)}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional System Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Active Users</h4>
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-sm text-gray-600">Currently online</p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Transactions/min</h4>
            <p className="text-2xl font-bold text-green-600">23</p>
            <p className="text-sm text-gray-600">Average last hour</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Error Rate</h4>
            <p className="text-2xl font-bold text-purple-600">0.02%</p>
            <p className="text-sm text-gray-600">Last 24 hours</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
