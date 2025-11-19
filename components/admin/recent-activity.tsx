import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  amount: number
  type: string
  status: string
  created_at: string
  user_profiles?: {
    full_name: string
  }
}

interface RecentActivityProps {
  transactions: Transaction[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "transfer":
        return "↔️"
      case "payment":
        return "💳"
      case "deposit":
        return "⬇️"
      case "withdrawal":
        return "⬆️"
      default:
        return "💰"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
                  {getTypeIcon(transaction.type)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.user_profiles?.full_name || "Unknown User"}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {transaction.type} • {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${Math.abs(transaction.amount).toLocaleString()}</p>
                <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
              </div>
            </div>
          ))}
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">No recent transactions found</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
