import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/create-event", label: "Create" },
];

export default function Navbar() {
  return (
    <header className="bg-indigo-600 text-white shadow">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-wide">
          🎓 CAMPUS EVENTS
        </Link>
        <ul className="flex gap-4 text-sm font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded px-2 py-1 hover:bg-indigo-500"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}