import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

function Repository() {
    const { owner, repo } = useParams()

    const [repoData, setRepoData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {

        const showRepo = async () => {
            try {
                setLoading(true)
                setError("")
                const response = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}`

                )

                if (!response.ok) {
                    throw new Error("Repository not found")
                }

                const data = await response.json()
                setRepoData(data)
            } catch (error) {
                console.error("Error fetching repository : ", error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        if (owner && repo) {
            showRepo()
        }

    }, [owner, repo])


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-2xl font-semibold text-gray-500 animate-pulse">Loading repository data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto mt-10 max-w-4xl px-6 text-center">
                <h2 className="text-2xl font-bold text-red-600">
                    Unable to load repository
                </h2>
                <p className="mt-2 text-gray-600">{error}</p>
            </div>
        );
    }


    return (
        <main className="mx-auto min-h-screen max-w-7xl px-5 pb-16 md:px-8">
            <div className="border-b border-line py-8">
                <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.2em]">
                    <span className="text-moss-400">
                        Repository / Details
                    </span>
                    <span className="text-muted">Public source</span>
                </div>
            </div>

            <section className="border-b border-line py-12 md:py-16">
                <div className="flex flex-col gap-7">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-line bg-ink-900 text-moss-400">
                            <span className="text-2xl">⌘</span>
                        </div>

                        <div className="min-w-0 flex-1">
                            <Link
                                to={`/profile/${owner}`}
                                className="text-sm text-muted transition hover:text-moss-400"
                            >
                                {owner} ↗
                            </Link>

                            <h1 className="mt-1 break-words text-4xl font-semibold tracking-[-0.045em] text-paper md:text-6xl">
                                {repo}
                                <span className="text-moss-400">.</span>
                            </h1>
                        </div>
                    </div>

                    {repoData?.description && (
                        <p className="max-w-3xl text-base leading-8 text-muted md:text-lg">
                            {repoData.description}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3">
                        {repoData?.language && (
                            <span className="rounded-md border border-line px-3 py-2 text-sm text-paper">
                                {repoData.language}
                            </span>
                        )}

                        <span className="rounded-md border border-line px-3 py-2 text-sm text-muted">
                            {repoData?.private ? "Private repository" : "Public repository"}
                        </span>

                        <a
                            href={repoData?.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 rounded-md bg-moss-400 px-5 py-3 text-sm font-semibold text-ink-950 transition hover:bg-moss-500"
                        >
                            View on GitHub
                            <span aria-hidden="true">↗</span>
                        </a>
                    </div>
                </div>
            </section>

            {repoData?.topics?.length > 0 && (
                <section className="border-b border-line py-7">
                    <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
                        Topics
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {repoData.topics.map((topic) => (
                            <span
                                key={topic}
                                className="rounded-md border border-line px-3 py-2 text-sm text-moss-400"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                </section>
            )}


            <section className="border-b border-line py-8">
                <p className="mb-6 text-xs uppercase tracking-[0.2em] text-muted">
                    Repository at a glance
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4">
                    {[
                        {
                            label: "Stars",
                            value: repoData?.stargazers_count,
                        },
                        {
                            label: "Forks",
                            value: repoData?.forks_count,
                        },
                        {
                            label: "Open issues",
                            value: repoData?.open_issues_count,
                        },
                        {
                            label: "Watchers",
                            value: repoData?.subscribers_count,
                        },
                    ].map((stat, index) => (
                        <div
                            key={stat.label}
                            className={`py-5 ${index % 2 === 0 ? "pr-4" : "pl-4"
                                } ${index < 2 ? "border-b border-line md:border-b-0" : ""
                                } ${index === 1
                                    ? "md:border-r md:border-line"
                                    : ""
                                } ${index === 2
                                    ? "md:pl-6"
                                    : ""
                                } ${index === 0
                                    ? "md:border-r md:border-line md:pr-6"
                                    : ""
                                }`}
                        >
                            <p className="text-sm text-muted">{stat.label}</p>

                            <p className="mt-3 text-3xl font-semibold tracking-tight text-paper">
                                {stat.value?.toLocaleString() ?? "—"}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-10">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">
                        Project details
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-paper">
                        Repository information
                    </h2>
                </div>

                <div className="grid grid-cols-1 border-t border-line sm:grid-cols-2">
                    <div className="border-b border-line py-5 sm:pr-8">
                        <p className="text-sm text-muted">Default branch</p>
                        <p className="mt-2 font-mono text-sm text-moss-400">
                            {repoData?.default_branch || "Not available"}
                        </p>
                    </div>

                    <div className="border-b border-line py-5 sm:pl-8">
                        <p className="text-sm text-muted">License</p>
                        <p className="mt-2 text-sm text-paper">
                            {repoData?.license?.spdx_id || "No license specified"}
                        </p>
                    </div>

                    <div className="border-b border-line py-5 sm:pr-8">
                        <p className="text-sm text-muted">Created</p>
                        <p className="mt-2 text-sm text-paper">
                            {repoData?.created_at
                                ? new Date(repoData.created_at).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )
                                : "Not available"}
                        </p>
                    </div>

                    <div className="border-b border-line py-5 sm:pl-8">
                        <p className="text-sm text-muted">Last updated</p>
                        <p className="mt-2 text-sm text-paper">
                            {repoData?.updated_at
                                ? new Date(repoData.updated_at).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    }
                                )
                                : "Not available"}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default Repository