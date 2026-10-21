import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Home() {

  const [repositories, setRepositories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://api.github.com/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=4"
        )

        if (!response.ok) {
          throw new Error("Failed to fetch repositories")
        }

        const data = await response.json()

        setRepositories(data.items)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchRepositories()
  }, [])

  const topics = [
    "React",
    "TypeScript",
    "Rust",
    "Developer Tools",
  ];



  return (
    <div className="mx-auto max-w-7xl px-5 md:px-8">
      <section className="border-b border-line py-8">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em]">
          <span className="text-moss-400">
            The Open Source Index
          </span>
          <span className="text-muted">
            Vol. 001 / Discover
          </span>
        </div>
      </section>

      <section className="grid grid-cols-1 border-b border-line lg:grid-cols-[1.6fr_1fr]">
        <div className="py-16 lg:pr-16 lg:py-24">
          <p className="mb-7 text-xs font-medium uppercase tracking-[0.25em] text-moss-400">
            Explore the code behind the ideas
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-[-0.055em] text-paper md:text-7xl">
            Find code worth
            <br />
            exploring<span className="text-moss-400">.</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-8 text-muted">
            Discover open-source repositories, understand
            what developers are building, and explore
            projects that deserve your attention.
          </p>

          <Link
            to="/search"
            className="mt-10 inline-flex items-center gap-4 rounded-md bg-moss-400 px-6 py-4 text-sm font-semibold text-ink-950 transition hover:bg-moss-500"
          >
            Explore repositories
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <aside className="border-t border-line py-12 lg:border-l lg:border-t-0 lg:py-24 lg:pl-12">
          <p className="mb-8 text-xs uppercase tracking-[0.2em] text-muted">
            Explore by topic
          </p>

          <div className="divide-y divide-line border-t border-line">
            {topics.map((topic, index) => (
              <Link
                key={topic}
                to={`/search?q=${encodeURIComponent(topic)}`}
                className="group flex items-center justify-between py-5 transition hover:pl-2"
              >
                <div className="flex items-center gap-5">
                  <span className="font-mono text-xs text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-lg text-paper transition group-hover:text-moss-400">
                    {topic}
                  </span>
                </div>

                <span className="text-muted transition group-hover:text-moss-400">
                  ↗
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-10 font-mono text-xs uppercase tracking-widest text-moss-400">
            Built for the curious.
          </p>
        </aside>
      </section>


      <section className="border-b border-line py-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-moss-400">
              Worth exploring
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-paper">
              Popular repositories
            </h2>
          </div>

          <Link
            to="/search?q=stars"
            className="text-sm text-muted transition hover:text-moss-400"
          >
            Explore all ↗
          </Link>
        </div>

        {loading ? (
          <p className="py-6 text-sm text-muted">
            Loading repositories...
          </p>
        ) : (
          <div className="divide-y divide-line border-y border-line">
            {repositories.map((repo, index) => (
              <Link
                key={repo.id}
                to={`/repository/${repo.owner.login}/${repo.name}`}
                className="group flex items-start gap-4 py-6 transition hover:bg-ink-900/60 sm:px-4"
              >
                <span className="pt-1 font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-paper transition group-hover:text-moss-400">
                    {repo.full_name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {repo.description || "No description available."}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-5 text-xs text-muted">
                    {repo.language && <span>{repo.language}</span>}
                    <span>
                      ★ {repo.stargazers_count.toLocaleString()}
                    </span>
                  </div>
                </div>

                <span className="text-muted transition group-hover:text-moss-400">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>


      <footer className="flex flex-wrap justify-between gap-4 py-7 text-xs uppercase tracking-[0.15em] text-muted">
        <span>Search / Inspect / Discover</span>
        <span>Powered by GitHub API</span>
      </footer>
    </div>
  );
}

export default Home;