
import { useState, useCallback } from 'react';
import { MessageSquarePlus, FolderKanban, Users, BookOpen, HelpCircle } from 'lucide-react';

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
      className={`relative h-screen backdrop-blur-xl bg-background/10 border-r border-white/20 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out ${
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
                  ? "bg-white/10 border border-white/20 text-white hover:bg-white/15"
                  : "text-white/90 hover:bg-white/10"
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
      </div>
    </div>
  );
}
