import { LogManager } from "@/components/log-manager";
import { getBitacora, getUsuarios } from "@/lib/data";

export default async function LogPage() {
  const logEntries = await getBitacora();
  const users = await getUsuarios();
  
  return (
    <LogManager initialLogs={logEntries} users={users} />
  );
}
