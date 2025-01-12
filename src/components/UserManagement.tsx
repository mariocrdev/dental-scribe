import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

type UserWithRole = {
  id: string;
  email: string;
  role: 'admin' | 'dentist' | 'assistant';
};

export function UserManagement() {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["users-with-roles"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { data: userRoles, error } = await supabase
        .from("user_roles")
        .select(`
          user_id,
          role,
          auth_users:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return userRoles.map(ur => ({
        id: ur.user_id,
        email: ur.auth_users.email,
        role: ur.role
      })) as UserWithRole[];
    },
  });

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'dentist' | 'assistant') => {
    try {
      setUpdatingUserId(userId);
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("Rol actualizado correctamente");
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error("Error al actualizar el rol");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-500';
      case 'dentist':
        return 'text-blue-500';
      case 'assistant':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2 dark:text-white">
          <Shield className="h-5 w-5" />
          Gestión de Usuarios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-700"
            >
              <div>
                <p className="font-medium dark:text-white">{user.email}</p>
                <p className={`text-sm ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
              <Select
                value={user.role}
                onValueChange={(value: 'admin' | 'dentist' | 'assistant') => 
                  handleRoleChange(user.id, value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="dentist">Dentista</SelectItem>
                  <SelectItem value="assistant">Asistente</SelectItem>
                </SelectContent>
              </Select>
              {updatingUserId === user.id && (
                <Button disabled className="ml-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}