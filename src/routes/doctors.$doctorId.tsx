import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, Briefcase, Building2, Video, ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { BookingDialog } from "@/components/booking-dialog";
import { AiAssistant } from "@/components/ai-assistant";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/doctors/$doctorId")({
  component: DoctorPage,
});

function DoctorPage() {
  const { doctorId } = Route.useParams();

  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ["doctor", doctorId],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("*").eq("id", doctorId).single();
      if (error) throw error;
      return data;
    },
  });

  if (error) throw notFound();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link to="/search" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to results
        </Link>

        {isLoading || !doctor ? (
          <Skeleton className="h-96 rounded-2xl" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div className="flex flex-col gap-5 sm:flex-row">
                <img src={doctor.profile_image ?? ""} alt={doctor.full_name} className="h-32 w-32 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h1 className="text-2xl font-bold">{doctor.full_name}</h1>
                      <p className="text-primary">{doctor.specialization}</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
                      <Star className="h-4 w-4 fill-current" />
                      {doctor.rating?.toFixed(1) ?? "—"}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {doctor.city}</span>
                    {doctor.hospital_name && <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {doctor.hospital_name}</span>}
                    <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {doctor.experience_years} yrs</span>
                    {doctor.consultation_type !== "physical" && <span className="flex items-center gap-1.5 text-primary"><Video className="h-4 w-4" /> Online available</span>}
                  </div>

                  <div className="mt-3">
                    <Badge className={doctor.is_available ? "bg-success text-success-foreground hover:bg-success/90" : ""} variant={doctor.is_available ? "default" : "secondary"}>
                      {doctor.is_available ? "Available today" : "Currently unavailable"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h2>
                <p className="mt-2 leading-relaxed">{doctor.bio}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Available slots</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(doctor.available_timings ?? []).map((s: string) => (
                    <span key={s} className="rounded-lg border bg-secondary px-3 py-1.5 text-sm">{s}</span>
                  ))}
                  {(doctor.available_timings ?? []).length === 0 && (
                    <p className="text-sm text-muted-foreground">No slots listed.</p>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-4">
              {doctor.is_available ? (
                <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <h3 className="font-semibold">Book a visit</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Pick a slot that works for you.</p>
                  <div className="mt-4">
                    <BookingDialog
                      doctorId={doctor.id}
                      doctorName={doctor.full_name}
                      slots={doctor.available_timings ?? []}
                      consultationType={doctor.consultation_type}
                    />
                  </div>
                </div>
              ) : null}

              <AiAssistant
                doctorId={doctor.id}
                doctorName={doctor.full_name}
                specialization={doctor.specialization}
              />
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
