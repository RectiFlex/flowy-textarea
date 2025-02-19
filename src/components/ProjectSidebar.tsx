
import { useState, useCallback } from 'react';
import { Announcement } from "@/components/ui/announcement";
import { ChevronLeft, ChevronRight, FolderKanban, Users, BookOpen, HelpCircle, MessageSquarePlus } from 'lucide-react';

const NAV_ITEMS = [
  {
    icon: MessageSquarePlus,
    title: "New Chat",
    variant: "primary"
  },
  {
    icon: FolderKanban,
    title: "Projects"
  },
  {
    icon: Users,
    title: "Community"
  },
  {
    icon: BookOpen,
    title: "Library"
  },
  {
    icon: HelpCircle,
    title: "Feedback"
  }
];

const RECENT_PROJECTS = [
  "Landing Page Design",
  "API Integration Help",
  "Next.js Auth Setup",
  "Database Schema Review",
  "Tailwind Components",
];

export function ProjectSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleMouseEnter = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  return (
    <div 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative h-screen backdrop-blur-xl bg-background/5 border-r border-white/10 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="h-full flex flex-col p-2">
        <nav className="space-y-2">
          {NAV_ITEMS.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-2 py-2 px-2 rounded-lg text-sm transition-colors ${
                item.variant === "primary" 
                  ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className={`transition-opacity duration-200 ${
                isCollapsed ? 'opacity-0' : 'opacity-100'
              }`}>
                {item.title}
              </span>
            </button>
          ))}
        </nav>

        <div className={`mt-6 pt-6 border-t border-white/10 transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm px-2 text-white/60">Recent Projects</span>
          </div>
          <div className="space-y-2">
            {RECENT_PROJECTS.map((project, index) => (
              <button 
                key={index} 
                className="w-full text-left px-2 py-1 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                {project}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-auto transition-opacity duration-200 ${
          isCollapsed ? 'opacity-0' : 'opacity-100'
        }`}>
          <Announcement
            title="New Feature"
            description="Create and share your project templates with the community."
            href="#"
            onClose={() => console.log('Closing announcement')}
          />
        </div>
      </div>
    </div>
  );
}
