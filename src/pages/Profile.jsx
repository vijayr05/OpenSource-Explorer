import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react"

function Profile() {

    const { username } = useParams()
    const navigate = useNavigate()
    const [searchUsername, setSearchUsername] = useState("")
    const [profileData, setProfileData] = useState(null)
    const [loading, setLoading] = useState(Boolean(username))
    const [error, setError] = useState("")
    const [repositories, setRepositories] = useState([])
    const [reposLoading, setReposLoading] = useState(Boolean(username))

    const handleSearch = (e) => {
        e.preventDefault();

        const trimmedUsername = searchUsername.trim();
        if (!trimmedUsername) return;

        navigate(`/profile/${encodeURIComponent(trimmedUsername)}`)
    }

    useEffect(() => {
        const userChange = async () => {
            try {
                setLoading(true)
                setError("");
                const response = await fetch(
                    `https://api.github.com/users/${username}`
                )

                if (!response.ok) {
                    throw new Error("User Not Found")
                }

                const data = await response.json()
                setProfileData(data)

            } catch (error) {
                console.error("Error fetching user profile : ", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (username) {
            userChange()
        } else {
            setLoading(false)
        }
    }, [username])

    useEffect(() => {
        const fetchRepositories = async () => {
            try {
                setReposLoading(true)
                const response = await fetch(
                    `https://api.github.com/users/${username}/repos?sort=updated&per_page=10`
                )

                if (!response.ok) {
                    throw new Error("Unable to load repositories")
                }

                const data = await response.json();
                setRepositories(data)
            } catch (error) {
                console.error("Error fetching repositories:", error)
            } finally {
                setReposLoading(false)
            }
        }

        if (username) {
            fetchRepositories()
        } else {
            setReposLoading(false)
            setRepositories([])
        }
    }, [username])



    return (
        <main className="mx-auto min-h-screen max-w-7xl px-5 pb-16 md:px-8">
            <section className="border-b border-line py-8">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
                    <span className="text-moss-400">Developer Index</span>
                    <span className="text-muted">02 / Profile</span>
                </div>
            </section>

            <section className="border-b border-line py-8">
                <div className="mx-auto max-w-2xl">
                    <h2 className="text-xl font-semibold text-paper">
                        Find a developer
                    </h2>

                    <p className="mt-2 text-sm text-muted">
                        Enter a GitHub username to explore their profile and repositories.
                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="mt-5 flex flex-col gap-3 sm:flex-row"
                    >
                        <input
                            type="text"
                            value={searchUsername}
                            onChange={(e) => setSearchUsername(e.target.value)}
                            placeholder="Enter GitHub username"
                            aria-label="GitHub username"
                            autoComplete="off"
                            className="min-w-0 flex-1 rounded-md border border-line bg-ink-900 px-4 py-3 text-paper outline-none placeholder:text-muted focus:border-moss-400"
                        />

                        <button
                            type="submit"
                            disabled={!searchUsername.trim()}
                            className="rounded-md bg-moss-400 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-moss-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Searching..." : "Search profile"}
                        </button>
                    </form>
                </div>
            </section>

            {loading ? (
                <section
                    className="flex min-h-[40vh] items-center justify-center"
                    aria-live="polite"
                >
                    <p className="text-sm text-muted">
                        Loading developer profile...
                    </p>
                </section>
            ) : error ? (
                <section
                    className="mx-auto max-w-2xl py-12"
                    role="alert"
                >
                    <h2 className="text-xl font-semibold text-paper">
                        Unable to load developer profile
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted">
                        {error === "User Not Found"
                            ? "We couldn't find that GitHub username. Check the spelling and try again."
                            : error}
                    </p>
                </section>
            ) : !username ? (
                <section className="mx-auto max-w-2xl py-16">
                    <p className="text-xs uppercase tracking-[0.2em] text-moss-400">
                        Developer discovery
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold tracking-tight text-paper md:text-4xl">
                        Find someone building something interesting.
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
                        Search for any GitHub username to explore their profile,
                        public repositories, programming languages, and activity.
                    </p>
                </section>
            ) : (
                <>

                    <section className="border-b border-line py-12 md:py-16">
                        <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
                            <img
                                src={profileData?.avatar_url}
                                alt={`${username}'s avatar`}
                                className="h-28 w-28 rounded-lg border border-line object-cover md:h-36 md:w-36"
                            />

                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-moss-400">
                                    @{profileData?.login || username}
                                </p>

                                <h1 className="mt-2 break-words text-4xl font-semibold tracking-[-0.045em] text-paper md:text-6xl">
                                    {profileData?.name || profileData?.login}
                                    <span className="text-moss-400">.</span>
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                                    {profileData?.bio || "No bio provided by this developer."}
                                </p>

                                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted">
                                    {profileData?.company && (
                                        <span>{profileData.company}</span>
                                    )}

                                    {profileData?.location && (
                                        <span>{profileData.location}</span>
                                    )}

                                    {profileData?.blog && (
                                        <a
                                            href={
                                                profileData.blog.startsWith("http")
                                                    ? profileData.blog
                                                    : `https://${profileData.blog}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition hover:text-moss-400"
                                        >
                                            Website ↗
                                        </a>
                                    )}
                                </div>

                                <a
                                    href={profileData?.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-7 inline-flex items-center gap-3 rounded-md bg-moss-400 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-moss-500"
                                >
                                    View GitHub profile
                                    <span aria-hidden="true">↗</span>
                                </a>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 border-b border-line sm:grid-cols-3">
                        {[
                            {
                                label: "Public repositories",
                                value: profileData?.public_repos,
                            },
                            {
                                label: "Followers",
                                value: profileData?.followers,
                            },
                            {
                                label: "Following",
                                value: profileData?.following,
                            },
                        ].map((stat, index) => (
                            <div
                                key={stat.label}
                                className={`py-7 ${index > 0
                                    ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-6"
                                    : "sm:pr-6"
                                    }`}
                            >
                                <p className="text-sm text-muted">{stat.label}</p>

                                <p className="mt-3 text-3xl font-semibold tracking-tight text-paper">
                                    {stat.value?.toLocaleString() ?? "—"}
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="py-10">
                        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-moss-400">
                                    Developer activity
                                </p>

                                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-paper">
                                    Public repositories
                                </h2>
                            </div>

                            <a
                                href={`https://github.com/${username}?tab=repositories`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted transition hover:text-moss-400"
                            >
                                View all repositories ↗
                            </a>

                            <span className="text-sm text-muted">
                                {repositories.length} shown
                            </span>
                        </div>

                        {reposLoading ? (
                            <p className="py-8 text-sm text-muted">
                                Loading repositories...
                            </p>
                        ) : repositories.length === 0 ? (
                            <p className="py-8 text-sm text-muted">
                                No public repositories found.
                            </p>
                        ) : (
                            <div className="divide-y divide-line">
                                {repositories.map((item, index) => (
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
                                                <h3 className="font-semibold text-paper transition group-hover:text-moss-400">
                                                    {item.name}
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-muted">
                                                    {item.description ||
                                                        "No description provided by the repository owner."}
                                                </p>

                                                <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-muted">
                                                    {item.language && (
                                                        <span className="text-moss-400">
                                                            {item.language}
                                                        </span>
                                                    )}

                                                    <span>
                                                        ★ {item.stargazers_count.toLocaleString()}
                                                    </span>

                                                    <span>
                                                        Updated{" "}
                                                        {new Date(item.updated_at).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                year: "numeric",
                                                            }
                                                        )}
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
                        )}
                    </section>
                </>
            )}
        </main>
    );


}

export default Profile