import { AppearanceForm } from "@/components/appearance-form";

export default function AppearancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Apariencia</h1>
        <p className="text-muted-foreground">
          Personaliza la apariencia del sistema. Los cambios se reflejarán en tiempo real.
        </p>
      </div>
      <AppearanceForm />
    </div>
  );
}
