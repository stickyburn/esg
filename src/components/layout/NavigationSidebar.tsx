'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Building2,
  HelpCircle,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: 'Company Management',
    href: '/issuers',
    icon: <Building2 className="h-5 w-5" />,
    children: [
      { title: 'List View', href: '/issuers', icon: <Building2 className="h-4 w-4" /> },
      { title: 'Add Issuer', href: '/issuers/add', icon: <Building2 className="h-4 w-4" /> },
      { title: 'Bulk Import', href: '/issuers/import', icon: <Building2 className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Questions & Scoring',
    href: '/questions',
    icon: <HelpCircle className="h-5 w-5" />,
    children: [
      { title: 'Section Management', href: '/questions/sections', icon: <HelpCircle className="h-4 w-4" /> },
      { title: 'Question Builder', href: '/questions/builder', icon: <HelpCircle className="h-4 w-4" /> },
      { title: 'Scoring Engine', href: '/questions/scoring', icon: <HelpCircle className="h-4 w-4" /> },
      { title: 'Template Library', href: '/questions/templates', icon: <HelpCircle className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Assessments',
    href: '/assessments',
    icon: <FileText className="h-5 w-5" />,
    children: [
      { title: 'New Assessment', href: '/assessments/new', icon: <FileText className="h-4 w-4" /> },
      { title: 'Assessment List', href: '/assessments', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Reports & Analytics',
    href: '/reports',
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      { title: 'Assessment Results', href: '/reports/results', icon: <BarChart3 className="h-4 w-4" /> },
      { title: 'Historical Analysis', href: '/reports/historical', icon: <BarChart3 className="h-4 w-4" /> },
      { title: 'Comparison Views', href: '/reports/comparison', icon: <BarChart3 className="h-4 w-4" /> },
      { title: 'Export Center', href: '/reports/export', icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />,
    children: [
      { title: 'Company Profile', href: '/settings/company', icon: <Settings className="h-4 w-4" /> },
      { title: 'Export Templates', href: '/settings/templates', icon: <Settings className="h-4 w-4" /> },
      { title: 'User Management', href: '/settings/users', icon: <Settings className="h-4 w-4" /> },
      { title: 'System Configuration', href: '/settings/system', icon: <Settings className="h-4 w-4" /> },
    ],
  },
];

export default function NavigationSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md bg-primary text-primary-foreground"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 custom-scrollbar overflow-y-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 px-4 border-b border-border">
            <h1 className="text-xl font-bold text-primary">ESG Calculator</h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const isExpanded = expandedItems.includes(item.title);

              return (
                <div key={item.title} className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center w-full p-2 rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                      onClick={() => {
                        if (item.children) {
                          toggleExpanded(item.title);
                        }
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="flex-1">{item.title}</span>
                      {item.children && (
                        <span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </Link>
                  </div>

                  {item.children && isExpanded && (
                    <div className="ml-6 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;

                        return (
                          <Link
                            key={child.title}
                            href={child.href}
                            className={cn(
                              "flex items-center w-full p-2 rounded-md transition-colors",
                              isChildActive
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                          >
                            <span className="mr-3">{child.icon}</span>
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-medium">U</span>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@esg.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
