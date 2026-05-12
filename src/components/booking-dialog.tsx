import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  patient_name: z.string().trim().min(2, "Enter your name").max(100),
  patient_contact: z.string().trim().min(7, "Enter a valid contact").max(40),
  symptoms: z.string().trim().max(500).optional(),
  selected_slot: z.string().min(1, "Pick a slot"),
  appointment_type: z.enum(["online", "physical"]),
});

interface Props {
  doctorId: string;
  doctorName: string;
  slots: string[];
  consultationType: string;
}

export function BookingDialog({ doctorId, doctorName, slots, consultationType }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    patient_name: "", patient_contact: "", symptoms: "",
    selected_slot: "", appointment_type: consultationType === "online" ? "online" : "physical",
  });

  const mut = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse(form);
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from("appointments").insert({
        ...parsed,
        doctor_id: doctorId,
        user_id: user?.id ?? null,
      });
      if (error) {
        if (error.code === "23505") throw new Error("This slot is already booked. Pick another.");
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Appointment confirmed", { description: `${doctorName} — ${form.selected_slot}` });
      setOpen(false);
      setForm({ ...form, patient_name: "", patient_contact: "", symptoms: "", selected_slot: "" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full"><Calendar className="mr-2 h-4 w-4" /> Book appointment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book with {doctorName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Your name</Label>
            <Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} />
          </div>
          <div>
            <Label>Contact (phone or email)</Label>
            <Input value={form.patient_contact} onChange={(e) => setForm({ ...form, patient_contact: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Slot</Label>
              <Select value={form.selected_slot} onValueChange={(v) => setForm({ ...form, selected_slot: v })}>
                <SelectTrigger><SelectValue placeholder="Pick" /></SelectTrigger>
                <SelectContent>
                  {slots.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={form.appointment_type} onValueChange={(v) => setForm({ ...form, appointment_type: v as "online" | "physical" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {consultationType !== "physical" && <SelectItem value="online">Online</SelectItem>}
                  {consultationType !== "online" && <SelectItem value="physical">Physical</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Symptoms (optional)</Label>
            <Textarea rows={3} value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => mut.mutate()} disabled={mut.isPending} className="w-full">
            {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
