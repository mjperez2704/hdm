import { DatabaseSettingsForm } from "@/components/database-settings-form";

export default function DatabaseSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ajustes de Base de Datos</h1>
        <p className="text-muted-foreground">
          Configura y prueba la conexión a tu base de datos MySQL.
        </p>
      </div>
      <DatabaseSettingsForm />
    </div>
  );
}
