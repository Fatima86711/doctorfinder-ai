import { Link } from "@tanstack/react-router";
import { Star, MapPin, Briefcase, Video, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface Doctor {
  id: string;
  full_name: string;
  specialization: string;
  city: string;
  hospital_name: string | null;
  consultation_type: string;
  experience_years: number | null;
  rating: number | null;
  bio: string | null;
  profile_image: string | null;
  is_available: boolean | null;
}

export function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="group flex flex-col gap-4 rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)] transition hover:shadow-[var(--shadow-card)] sm:flex-row">
      <img
        src={doctor.profile_image ?? ""}
        alt={doctor.full_name}
        className="h-24 w-24 flex-shrink-0 rounded-xl object-cover"
        loading="lazy"
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold leading-tight">{doctor.full_name}</h3>
            <p className="text-sm text-primary">{doctor.specialization}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <Star className="h-3.5 w-3.5 fill-current" />
            {doctor.rating?.toFixed(1) ?? "—"}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {doctor.city}</span>
          {doctor.hospital_name && (
            <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {doctor.hospital_name}</span>
          )}
          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {doctor.experience_years} yrs</span>
          {doctor.consultation_type !== "physical" && (
            <span className="flex items-center gap-1 text-primary"><Video className="h-3.5 w-3.5" /> Online</span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">{doctor.bio}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <Badge variant={doctor.is_available ? "default" : "secondary"} className={doctor.is_available ? "bg-success text-success-foreground hover:bg-success/90" : ""}>
            {doctor.is_available ? "Available" : "Unavailable"}
          </Badge>
          <Link to="/doctors/$doctorId" params={{ doctorId: doctor.id }}>
            <Button size="sm">View profile</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
