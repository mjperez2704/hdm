
import { BusinessRulesEngine } from "@/components/business-rules-engine";
import { getAlmacenes, getMarcas } from "@/lib/data";

export default async function RulesPage() {
  const almacenes = await getAlmacenes();
  const marcas = await getMarcas();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reglas de Negocio</h1>
        <p className="text-muted-foreground">
          Establece y personaliza las reglas de funcionamiento y las restricciones del sistema.
        </p>
      </div>
      <BusinessRulesEngine initialAlmacenes={almacenes} initialMarcas={marcas} />
    </div>
  );
}
