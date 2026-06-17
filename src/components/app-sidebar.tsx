"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  BriefcaseBusiness,
  Building2,
  LayoutDashboard,
  Plus,
  Settings,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Organization = { id: string; name: string };

export function AppSidebar({ 
  role, 
  initialOrganizations = [] 
}: { 
  role: 'recruiter' | 'candidate',
  initialOrganizations?: Organization[]
}) {
  const pathname = usePathname();
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  
  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await fetch("/api/organizations/my");
        if (res.ok) {
          const data = await res.json();
          setOrganizations(data);
        }
      } catch (error) {
        console.error("SIDEBAR ORGS FETCH ERROR:", error);
      }
    }
    fetchOrgs();
  }, []);

  const candidateNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Jobs Marketplace",
      url: "/jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "My Applications",
      url: "/applications",
      icon: Sparkles,
    },
  ];

  const recruiterNavItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Post a Job",
      url: organizations.length > 0 ? `/organizations/${organizations[0].id}/jobs/new` : "/organizations/new",
      icon: Plus,
    },
    {
      title: "All Applicants",
      url: "/applications",
      icon: Users,
    },
  ];

  const navItems = role === 'recruiter' ? recruiterNavItems : candidateNavItems;

  const secondaryItems = [
    {
      title: "Profile",
      url: "/user-profile",
      icon: User,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-3 px-4 py-4 group/logo active:scale-95 transition-transform">
          <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-white border border-border">
            <BriefcaseBusiness className="size-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-data-[collapsible=icon]:hidden">
            NextHire
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group/item",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-muted-foreground hover:bg-[#1F2530] hover:text-foreground"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn("size-5 transition-transform group-hover/item:scale-110", isActive && "text-primary")} />
                        <span>{item.title}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
            Organizations
            <Link href="/organizations/new" className="hover:text-primary transition-colors">
              <Plus className="size-3" />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {organizations.map((org) => {
                const url = `/organizations/${org.id}`;
                const isActive = pathname.startsWith(url);
                return (
                  <SidebarMenuItem key={org.id}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={org.name}
                      isActive={isActive}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group/item",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-muted-foreground hover:bg-[#1F2530] hover:text-foreground"
                      )}
                    >
                      <Link href={url}>
                        <Building2 className={cn("size-5 text-muted-foreground opacity-70 group-hover/item:opacity-100", isActive && "text-primary opacity-100")} />
                        <span className="truncate">{org.name}</span>
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {organizations.length === 0 && (
                 <SidebarMenuItem>
                    <div className="px-3 py-2 text-xs text-muted-foreground/60 italic">
                      No organizations yet
                    </div>
                 </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={item.title}
                      isActive={isActive}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group/item",
                        isActive 
                          ? "bg-primary/10 text-primary font-semibold" 
                          : "text-muted-foreground hover:bg-[#1F2530] hover:text-foreground"
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className={cn("size-5", isActive && "text-primary")} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
           <UserButton />
           <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
             <span className="text-sm font-semibold truncate">My Account</span>
             <span className="text-[10px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Manage profile</span>
           </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
