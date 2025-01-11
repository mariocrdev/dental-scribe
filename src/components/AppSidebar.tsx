import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Users, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    navigate("/login");
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        collapsed={collapsed}
        backgroundColor="rgb(255 255 255)"
        className="h-screen border-r"
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h2 className="text-xl font-bold">DentalApp</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        <Menu>
          <MenuItem
            icon={<Home size={20} />}
            onClick={() => navigate("/")}
            className="hover:bg-gray-100"
          >
            Inicio
          </MenuItem>
          <MenuItem
            icon={<Users size={20} />}
            onClick={() => navigate("/")}
            className="hover:bg-gray-100"
          >
            Pacientes
          </MenuItem>
          <MenuItem
            icon={<LogOut size={20} />}
            onClick={handleLogout}
            className="hover:bg-gray-100 mt-auto"
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}