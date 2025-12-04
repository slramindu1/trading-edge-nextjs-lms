import { Card } from "@/components/ui/card"
import { Users, UserCheck, AlertCircle } from "lucide-react"

export default function UserStats() {
  const stats = [
    {
      label: "Total Users",
      value: "2,451",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Active Users",
      value: "1,892",
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Pending Approval",
      value: "47",
      icon: AlertCircle,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950",
    },
  ]

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} rounded-lg p-3`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
