import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Hotel,
  PieChart,
  BedDouble,
  CalendarCheck,
  Users,
  Settings,
  LogOut,
  CreditCard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, isAdmin } = useAuth();

  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { title: "Tableau de bord", url: "/dashboard", icon: PieChart },
    { title: "Chambres", url: "/rooms", icon: BedDouble },
    { title: "Réservations", url: "/reservations", icon: CalendarCheck },
    { title: "Clients", url: "/clients", icon: Users },
    { title: "Paiements", url: "/payments", icon: CreditCard },
    ...(isAdmin ? [{ title: "Paramètres", url: "/settings", icon: Settings }] : []),
  ];

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 border-l-4",
      isActive
        ? "bg-blue-700 text-white font-semibold border-blue-500"
        : "text-white/70 hover:bg-blue-800 hover:text-white border-transparent"
    );

  return (
    <Sidebar
      className={cn(
        "bg-[#0f172a] text-white border-r border-gray-700 transition-all duration-300 ease-in-out h-screen",
        collapsed ? "w-[70px]" : "w-64"
      )}
    >
      <div className="flex h-14 items-center px-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          {!collapsed && <span className="font-semibold text-white">Gestion D'hotel</span>}
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="ml-auto"
          onClick={() => setCollapsed(prev => !prev)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/70">
            {!collapsed && "Menu principal"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClassName}>
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {collapsed && <span className="sr-only">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-3 border-t border-gray-700">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start text-white/70 hover:bg-blue-800 hover:text-white",
            collapsed && "justify-center p-2"
          )}
          onClick={logout}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="ml-2">Déconnexion</span>}
        </Button>
      </div>
    </Sidebar>
  );
}
