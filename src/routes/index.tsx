import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Clock, Stethoscope } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";

export const Route = createFileRoute("/")({
  component: Index,
});

const QUICK = ["back pain", "skin allergy", "chest pain", "fever", "anxiety", "migraine"];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section
          className="relative overflow-hidden"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Smart symptom matching
              </span>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                Find the right doctor,<br />
                <span className="text-primary">in seconds.</span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
                Describe your symptoms or pick a specialization. We match you with
                trusted doctors in your city — available now.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-8 max-w-3xl"
            >
              <SearchBar />
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
                <span>Try:</span>
                {QUICK.map((q) => (
                  <Link
                    key={q}
                    to="/search"
                    search={{ q }}
                    className="rounded-full border bg-card px-3 py-1 transition hover:border-primary hover:text-primary"
                  >
                    {q}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Stethoscope, title: "Symptom-aware search", body: "We map symptoms to the right specialization automatically." },
              { icon: ShieldCheck, title: "Verified doctors", body: "Profiles include credentials, hospital, and ratings." },
              { icon: Clock, title: "Instant booking", body: "Pick a slot, confirm, and you're done. No phone calls." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
