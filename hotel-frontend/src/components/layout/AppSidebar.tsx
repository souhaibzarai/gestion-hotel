
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
  CreditCard
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const { logout, isAdmin } = useAuth();

  const menuItems = [
    { title: "Tableau de bord", url: "/dashboard", icon: PieChart },
    { title: "Chambres", url: "/rooms", icon: BedDouble },
    { title: "Réservations", url: "/reservations", icon: CalendarCheck },
    { title: "Clients", url: "/clients", icon: Users },
    { title: "Paiements", url: "/payments", icon: CreditCard },
  ];

  if (isAdmin) {
    menuItems.push({ title: "Paramètres", url: "/settings", icon: Settings });
  }

  const isActive = (path: string) => currentPath === path;
  const isGroupActive = menuItems.some((item) => isActive(item.url));
  
  // Function to get the className for NavLink based on active state
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      isActive 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    );

  return (
    <Sidebar
      className={cn(
        "border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[70px]" : "w-64"
      )}
      collapsible="icon"
    >
      <div className="flex h-14 items-center px-3 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          {!collapsed && <span className="font-semibold text-sidebar-foreground">HotelManager</span>}
        </div>
        <SidebarTrigger className={cn("ml-auto text-sidebar-foreground", !collapsed && "hidden")} />
      </div>
      
      <SidebarContent>
        <SidebarTrigger className={cn("m-2 self-end text-sidebar-foreground", collapsed && "hidden")} />
        
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
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
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <div className="mt-auto p-3 border-t border-sidebar-border">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
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
