import { Link, NavLink } from "react-router-dom";

function Header() {
    const navClass = ({ isActive }) =>
        `text-sm transition-colors duration-200 ${isActive
            ? "text-moss-400"
            : "text-muted hover:text-paper"
        }`;

    return (
        <header className="border-b border-line bg-ink-950">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-5 md:px-8 md:py-5">
                <Link to="/" className="group flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-moss-400 text-ink-950">
                        <span className="text-lg font-bold">/</span>
                    </span>

                    <span>
                        <span className="block text-sm font-semibold tracking-tight text-paper">
                            OpenSource Explorer
                        </span>
                        <span className="mt-0.5  text-xs text-muted sm:block hidden">
                            A field guide to open source
                        </span>
                    </span>
                </Link>

                <div className="flex items-center gap-5 sm:gap-7">
                    <NavLink to="/" end className={navClass}>
                        Discover
                    </NavLink>

                    <NavLink to="/search" className={navClass}>
                        Search
                    </NavLink>

                    <NavLink to="/profile" className={navClass}>
                        Developers
                    </NavLink>
                </div>
            </nav>
        </header>
    );
}

export default Header;