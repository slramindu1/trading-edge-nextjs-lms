"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Mail, Trash2, Edit, Lock } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "active" | "inactive" | "pending"
  role: string
  joinDate: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    status: "active",
    role: "Admin",
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    status: "active",
    role: "Editor",
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    status: "pending",
    role: "Viewer",
    joinDate: "2024-11-28",
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.rodriguez@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    status: "active",
    role: "Editor",
    joinDate: "2024-03-10",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa.anderson@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    status: "inactive",
    role: "Viewer",
    joinDate: "2023-12-05",
  },
  {
    id: "6",
    name: "David Martinez",
    email: "david.martinez@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    status: "active",
    role: "Admin",
    joinDate: "2024-01-22",
  },
]

interface UserListProps {
  searchQuery: string
  statusFilter: string
}

export default function UserList({ searchQuery, statusFilter }: UserListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200"
      case "Editor":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200"
      case "Viewer":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Join Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.joinDate}</td>
                <td className="px-6 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Lock className="mr-2 h-4 w-4" />
                        Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-muted-foreground">No users found matching your criteria.</p>
        </div>
      )}
    </Card>
  )
}
