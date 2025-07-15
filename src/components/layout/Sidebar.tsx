import Link from 'next/link';

const navItems = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Slides', href: '/slides', icon: '🖼️' },
  { name: 'Loans', href: '/loans', icon: '💰' },
  { name: 'Footer', href: '/footer', icon: '📄' },
  { name: 'Header', href: '/header', icon: '🔝' },
  { name: 'Hero', href: '/hero', icon: '🦸' },
  { name: 'Quick Services', href: '/quick-services', icon: '⚡' },
  { name: 'Announcements', href: '/announcements', icon: '📢' },
  { name: 'Videos', href: '/videos', icon: '📹' },
  { name: 'Contact Info', href: '/contact-info', icon: '📞' },
  { name: 'Before Header', href: '/before-header', icon: '📄' },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Bank Admin
      </div>
      <nav className="flex-grow p-2">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors">
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
