import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle, Loader2, CheckCircle2, Bot } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  patient_name: z.string().trim().min(2).max(100),
  contact_info: z.string().trim().min(5).max(120),
  symptoms: z.string().trim().min(3).max(500),
});

interface Props {
  doctorId: string;
  doctorName: string;
  specialization: string;
}

export function AiAssistant({ doctorId, doctorName, specialization }: Props) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [form, setForm] = useState({ patient_name: "", contact_info: "", symptoms: "" });

  const mut = useMutation({
    mutationFn: async () => {
      const parsed = schema.parse(form);
      const { error } = await supabase.from("ai_inquiries").insert({
        ...parsed,
        suggested_specialization: specialization,
        assigned_doctor: doctorId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setStep(3);
      toast.success("Inquiry sent", { description: `${doctorName} will reach out to you.` });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not send"),
  });

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold">Smart Assistant</h3>
          <p className="text-xs text-muted-foreground">Quick inquiry — the doctor will get back to you</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {step === 0 && (
          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm">
              Hi! I'm {doctorName}'s assistant. If now isn't a good time to book,
              share a few details and we'll be in touch.
            </p>
            <Button size="sm" className="mt-3" onClick={() => setStep(1)}>
              <MessageCircle className="mr-2 h-4 w-4" /> Start inquiry
            </Button>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <div>
              <Label>Your name</Label>
              <Input value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} />
            </div>
            <div>
              <Label>Phone or email</Label>
              <Input value={form.contact_info} onChange={(e) => setForm({ ...form, contact_info: e.target.value })} />
            </div>
            <Button onClick={() => {
              if (form.patient_name.trim().length < 2 || form.contact_info.trim().length < 5) {
                toast.error("Please fill name and contact"); return;
              }
              setStep(2);
            }}>Next</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <Label>What are your symptoms?</Label>
              <Textarea rows={4} value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} placeholder="Describe what you're experiencing..." />
            </div>
            <Button onClick={() => mut.mutate()} disabled={mut.isPending}>
              {mut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send to doctor
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="flex items-start gap-3 rounded-xl bg-success/10 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
            <div>
              <p className="font-medium">Inquiry received</p>
              <p className="text-sm text-muted-foreground">{doctorName} will contact you shortly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
