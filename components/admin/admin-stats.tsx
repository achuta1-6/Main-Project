import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CreditCard, TrendingUp, DollarSign } from "lucide-react"

interface AdminStatsProps {
  totalUsers: number
  totalTransactions: number
}

export function AdminStats({ totalUsers, totalTransactions }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toLocaleString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Transactions",
      value: totalTransactions.toLocaleString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: CreditCard,
      color: "bg-green-500",
    },
    {
      title: "Revenue",
      value: "$2.4M",
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "bg-purple-500",
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "+2.1%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stat.change} from last month
            </p>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
        </Card>
      ))}
    </div>
  )
}
