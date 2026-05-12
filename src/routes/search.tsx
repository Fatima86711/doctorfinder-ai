import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { SearchX } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { SearchBar } from "@/components/search-bar";
import { DoctorCard, type Doctor } from "@/components/doctor-card";
import { mapSymptomToSpecialization, SPECIALIZATIONS } from "@/lib/symptom-map";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const searchSchema = z.object({
  q: z.string().optional(),
  city: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: searchSchema,
  component: SearchPage,
});

function SearchPage() {
  const { q = "", city = "" } = Route.useSearch();

  const matchedSpec = q
    ? SPECIALIZATIONS.find((s) => s.toLowerCase() === q.toLowerCase()) ??
      mapSymptomToSpecialization(q)
    : null;

  const { data, isLoading } = useQuery({
    queryKey: ["doctors", q, city, matchedSpec],
    queryFn: async () => {
      let query = supabase.from("doctors").select("*");
      if (matchedSpec) query = query.eq("specialization", matchedSpec);
      if (city && city !== "all") query = query.ilike("city", `%${city}%`);
      const { data, error } = await query
        .order("is_available", { ascending: false })
        .order("rating", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data as Doctor[];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <SearchBar defaultQ={q} defaultCity={city} />
        </div>

        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              {matchedSpec ? `${matchedSpec}s` : q ? `Results for "${q}"` : "All doctors"}
              {city && city !== "all" ? ` in ${city}` : ""}
            </h1>
            {q && matchedSpec && (
              <p className="text-sm text-muted-foreground">
                Matched <span className="font-medium text-primary">{q}</span> → {matchedSpec}
              </p>
            )}
          </div>
          {data && <span className="text-sm text-muted-foreground">{data.length} found</span>}
        </div>

        {isLoading ? (
          <div className="grid gap-4">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : data && data.length > 0 ? (
          <div className="grid gap-4">
            {data.map((d) => <DoctorCard key={d.id} doctor={d} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-12 text-center">
            <SearchX className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">No doctors found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different symptom, specialization, or city.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
