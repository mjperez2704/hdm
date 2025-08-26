import { RequestsManager } from "@/components/requests-manager";
import { getSolicitudesInternas, getEmpleados } from "@/lib/data";

export default async function RequestsPage() {
  const requests = await getSolicitudesInternas();
  const employees = await getEmpleados();
  return (
    <RequestsManager initialRequests={requests} employees={employees} />
  );
}
