import { useCallback, useEffect, useState } from "react";
import { MoreVertical, Mail, Trash2, Edit, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  fname: string | null;
  lname: string | null;
  email: string;
  status_id: number;
  user_type_id: number;
  joined_date: string;
  avatar?: string;
}

interface UserListProps {
  searchQuery: string;
  statusFilter: string;
}

export default function UserList({ searchQuery, statusFilter }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = useCallback(async () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append("searchQuery", searchQuery);
    if (statusFilter) params.append("statusFilter", statusFilter);

    const res = await fetch(`/api/users?${params.toString()}`);
    const data = await res.json();
    setUsers(data);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const statusIdToString = (id: number) =>
    id === 1
      ? "active"
      : id === 2
      ? "inactive"
      : id === 3
      ? "pending"
      : "unknown";
  const userTypeIdToRole = (id: number) =>
    id === 1 ? "Admin" : id === 2 ? "User" : id === 3 ? "Unkown" : "Not-Set";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-200";
      case "Editor":
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200";
      case "Viewer":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
            {users
              .filter((user) => user.user_type_id !== 1) // 1 = Admin, ඒවා remove කරනවා
              .map((user) => {
                const status = statusIdToString(user.status_id);
                const role = userTypeIdToRole(user.user_type_id);
                const name = `${user.fname || ""} ${user.lname || ""}`.trim();
                return (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={user.avatar || "/placeholder.svg"}
                            alt={name}
                          />
                          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getRoleColor(role)}>{role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(status)}>{status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.joined_date).toLocaleDateString()}
                    </td>
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
                );
              })}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="px-6 py-12 text-center">
          <p className="text-muted-foreground">
            No users found matching your criteria.
          </p>
        </div>
      )}
    </Card>
  );
}
