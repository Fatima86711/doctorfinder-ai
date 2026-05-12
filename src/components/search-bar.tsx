import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CITIES } from "@/lib/symptom-map";

export function SearchBar({ defaultQ = "", defaultCity = "" }: { defaultQ?: string; defaultCity?: string }) {
  const [q, setQ] = useState(defaultQ);
  const [city, setCity] = useState(defaultCity);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/search", search: { q: q || undefined, city: city || undefined } });
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 rounded-2xl border bg-card p-2 shadow-[var(--shadow-card)] sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 px-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Symptoms or specialization (e.g. back pain, dermatologist)"
          className="border-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="h-px bg-border sm:h-8 sm:w-px" />
      <Select value={city} onValueChange={setCity}>
        <SelectTrigger className="w-full border-0 shadow-none focus:ring-0 sm:w-44">
          <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All cities</SelectItem>
          {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button type="submit" size="lg" className="h-11">Search</Button>
    </form>
  );
}
