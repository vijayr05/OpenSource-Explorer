
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function Search() {


    const [searchParams] = useSearchParams();

    const [query, setQuery] = useState(
        () => sessionStorage.getItem("searchQuery") || searchParams.get("q") || ""
    );

    const [items, setItems] = useState(() => {
        const savedItems = sessionStorage.getItem("searchItems");
        return savedItems ? JSON.parse(savedItems) : [];
    });

    const [sortBy, setSortBy] = useState(
        () => sessionStorage.getItem("searchSortBy") || "stars"
    );

    const [language, setLanguage] = useState(
        () => sessionStorage.getItem("searchLanguage") || "all"
    );

    const [minStars, setMinStars] = useState(
        () => sessionStorage.getItem("searchMinStars") || "0"
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const topic = searchParams.get("q") || "";
        setQuery(topic)

        if (topic.trim()) {
            handleClick(topic)
        }
    }, [searchParams])


    const handleClick = async (searchQuery = query) => {
        if (!searchQuery.trim()) return;

        const searchTerms = [searchQuery.trim()];

        if (language !== "all") {
            searchTerms.push(`language:${language}`);
        }

        if (Number(minStars) > 0) {
            searchTerms.push(`stars:>=${minStars}`);
        }

        const params = new URLSearchParams({
            q: searchTerms.join(" "),
            per_page: "30",
        });

        if (sortBy === "stars") {
            params.set("sort", "stars");
            params.set("order", "desc");
        } else if (sortBy === "updated") {
            params.set("sort", "updated");
            params.set("order", "desc");
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `https://api.github.com/search/repositories?${params}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch repositories. Please try again.");
            }

            const data = await response.json();
            setItems(data.items);

            sessionStorage.setItem("searchQuery", searchQuery);
            sessionStorage.setItem("searchItems", JSON.stringify(data.items));
            sessionStorage.setItem("searchSortBy", sortBy);
            sessionStorage.setItem("searchLanguage", language);
            sessionStorage.setItem("searchMinStars", minStars);
        } catch (error) {
            setError(error.message);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    {
        loading && (
            <p className="py-8 text-sm text-muted">
                Searching repositories...
            </p>
        )
    }

    {
        error && (
            <p className="py-8 text-sm text-red-400">
                {error}
            </p>
        )
    }


    return (
        <main className="mx-auto min-h-screen max-w-7xl px-5 pb-16 md:px-8">
            <section className="border-b border-line py-8">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
                    <span className="text-moss-400">
                        Repository Index
                    </span>
                    <span className="text-muted">01 / Search</span>
                </div>

                <div className="max-w-3xl py-12 md:py-16">
                    <h1 className="text-4xl font-semibold leading-tight tracking-[-0.045em] text-paper md:text-6xl">
                        Find your next
                        <br />
                        rabbit hole
                        <span className="text-moss-400">.</span>
                    </h1>

                    <p className="mt-6 max-w-xl text-base leading-7 text-muted">
                        Explore repositories, tools, and ideas developers
                        are sharing in the open.
                    </p>
                </div>
            </section>

            <section className="border-b border-line py-7">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleClick();
                    }}
                    className="flex flex-col gap-3 sm:flex-row"
                >
                    <div className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-line bg-ink-900 px-4 transition focus-within:border-moss-400">
                        <span className="text-moss-400" aria-hidden="true">
                            /
                        </span>

                        <input
                            type="text"
                            placeholder="Try react, vite, developer tools..."
                            className="w-full bg-transparent py-4 text-sm text-paper outline-none placeholder:text-muted"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-md bg-moss-400 px-7 py-4 text-sm font-semibold text-ink-950 transition hover:bg-moss-500 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Searching..." : "Search repositories ↗"}
                    </button>
                </form>

                <p className="mt-3 text-xs text-muted">
                    Search across public GitHub repositories.
                </p>
            </section>

            <section className="pt-8">
                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        Discovery
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-paper">
                        {items.length > 0 ? "Repositories" : "Ready when you are"}
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 border-b border-line py-6 sm:grid-cols-3">
                    <label className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.15em] text-muted">
                            Sort by
                        </span>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="rounded-md border border-line bg-ink-900 px-3 py-3 text-sm text-paper outline-none focus:border-moss-400"
                        >
                            <option value="stars">Most stars</option>
                            <option value="updated">Recently updated</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.15em] text-muted">
                            Language
                        </span>

                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="rounded-md border border-line bg-ink-900 px-3 py-3 text-sm text-paper outline-none focus:border-moss-400"
                        >
                            <option value="all">All languages</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="TypeScript">TypeScript</option>
                            <option value="Python">Python</option>
                            <option value="Java">Java</option>
                            <option value="Rust">Rust</option>
                            <option value="Go">Go</option>
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs uppercase tracking-[0.15em] text-muted">
                            Minimum stars
                        </span>

                        <select
                            value={minStars}
                            onChange={(e) => setMinStars(e.target.value)}
                            className="rounded-md border border-line bg-ink-900 px-3 py-3 text-sm text-paper outline-none focus:border-moss-400"
                        >
                            <option value="0">Any number</option>
                            <option value="100">100+</option>
                            <option value="1000">1,000+</option>
                            <option value="10000">10,000+</option>
                        </select>
                    </label>

                    <button
                        type="button"
                        onClick={() => handleClick()}
                        disabled={loading}
                        className="rounded-md border border-line px-4 py-3 text-sm font-medium text-moss-400 transition hover:bg-ink-800 sm:col-span-3 sm:justify-self-end disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer"
                    >
                        {loading ? "Applying..." : "Apply filters ↗"}
                    </button>
                </div>

                {items.length > 0 && (
                    <p className="text-sm text-muted">
                        {items.length} results on this page
                    </p>
                )}

                <div className="mt-6 divide-y divide-line border-y border-line">

                    {!loading && !error && items.length === 0 && query.trim() && (
                        <p className="py-10 text-center text-sm text-muted">
                            No repositories found. Try a different search.
                        </p>
                    )}
                    {items.map((item, index) => (
                        <Link
                            key={item.id}
                            to={`/repository/${item.owner.login}/${item.name}`}
                            className="group block py-6 transition hover:bg-ink-900/60 sm:px-4"
                        >
                            <div className="flex items-start gap-4">
                                <span className="hidden pt-1 font-mono text-xs text-muted sm:block">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <span className="text-sm text-muted">
                                            {item.owner.login}
                                        </span>

                                        <span className="text-muted">/</span>

                                        <h3 className="font-semibold text-paper transition group-hover:text-moss-400">
                                            {item.name}
                                        </h3>
                                    </div>

                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                                        {item.description ||
                                            "No description provided by the repository owner."}
                                    </p>

                                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                                        {item.language && (
                                            <span className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-moss-400" />
                                                {item.language}
                                            </span>
                                        )}

                                        <span>
                                            ★ {item.stargazers_count.toLocaleString()}
                                        </span>

                                        <span>
                                            Forks {item.forks_count.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <span className="pt-1 text-muted transition group-hover:text-moss-400">
                                    ↗
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Search;