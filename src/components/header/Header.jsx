
import { Link, NavLink } from "react-router-dom";

function Header() {
    const navClass = ({ isActive }) =>
        `whitespace-nowrap text-xs transition-colors duration-200 sm:text-sm ${isActive
            ? "text-moss-400"
            : "text-muted hover:text-paper"
        }`;

    return (
        <header className="border-b border-line bg-ink-950">
            <nav className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-4 sm:gap-3 sm:px-5 md:px-8 md:py-5">
                <Link
                    to="/"
                    className="group flex min-w-0 shrink items-center gap-2 sm:gap-3"
                >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-moss-400 text-ink-950 sm:h-9 sm:w-9">
                        <span className="text-lg font-bold">/</span>
                    </span>

                    <span className="min-w-0">
                        <span className="block whitespace-nowrap text-xs font-semibold tracking-tight text-paper sm:text-sm">
                            OpenSource Explorer
                        </span>
                        <span className="mt-0.5 hidden text-xs text-muted sm:block">
                            A field guide to open source
                        </span>
                    </span>
                </Link>

                <div className="flex shrink-0 items-center gap-2 sm:gap-5 md:gap-7">
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