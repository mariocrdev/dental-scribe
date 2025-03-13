
import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Moon,
  Sun,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error al cerrar sesión");
      return;
    }
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        rootStyles={{ "& .ps-sidebar-container": { backgroundColor: "transparent !important" } }}
        collapsed={collapsed}
        className="h-screen border-r bg-background dark:bg-gray-800 dark:border-gray-800"
      >
        <div className="p-4 flex justify-between items-center">
          {!collapsed && <h2 className="text-xl font-bold dark:text-white">DentalApp</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto dark:hover:bg-gray-900"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
        <Menu className="gap-4 dark:bg-gray-900 dark:text-white">
          <MenuItem
            icon={<Home size={20} />}
            onClick={() => navigate("/")}
            className="hover:bg-gray-800 dark:hover:bg-gray-900"
          >
            Inicio
          </MenuItem>
          <MenuItem
            icon={<Users size={20} />}
            onClick={() => navigate("/")}
            className="hover:bg-gray-800 dark:hover:bg-gray-900"
          >
            Pacientes
          </MenuItem>
          <MenuItem
            icon={<Calendar size={20} />}
            onClick={() => navigate("/appointments")}
            className="hover:bg-gray-800 dark:hover:bg-gray-900"
          >
            Citas
          </MenuItem>
          <div className="mt-auto">
            <MenuItem
              icon={theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              onClick={toggleTheme}
              className="hover:bg-gray-800 dark:hover:bg-gray-900"
            >
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </MenuItem>
            <MenuItem
              icon={<LogOut size={20} />}
              onClick={handleLogout}
              className="hover:bg-gray-800 dark:hover:bg-gray-900"
            >
              Cerrar Sesión
            </MenuItem>
          </div>
        </Menu>
      </Sidebar>
    </div>
  );
}
