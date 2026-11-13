import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Registrations", icon: "📋" },
  { href: "/admin/events", label: "Events", icon: "📅" },
  { href: "/admin/donations", label: "Donations", icon: "💝" },
  { href: "/admin/memberships", label: "Memberships", icon: "👥" },
  { href: "/admin/volunteers", label: "Volunteers", icon: "🙋" },
  { href: "/admin/board-members", label: "Board Members", icon: "👔" },
  { href: "/admin/contacts", label: "Contacts", icon: "📞" },
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-white/[0.03] backdrop-blur-xl overflow-y-auto">
      <div className="sticky top-0 border-b border-white/10 bg-white/[0.05] p-6 backdrop-blur">
        <h1 className="text-xl font-bold text-white">Admin</h1>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-patasi/20 text-white border border-patasi/40"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-white/10 bg-white/[0.05] p-4">
        <button className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all">
          <span>👤</span>
          <span>Admin Profile</span>
        </button>
      </div>
    </aside>
  );
}
