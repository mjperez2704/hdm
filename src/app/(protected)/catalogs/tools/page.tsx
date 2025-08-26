
import { ToolsManager } from "@/components/tools-manager";
import { getHerramientas, getEmpleados } from "@/lib/data";

export default async function ToolsCatalogPage() {
  const tools = await getHerramientas();
  const employees = await getEmpleados();

  return (
    <ToolsManager initialTools={tools} employees={employees} />
  );
}
