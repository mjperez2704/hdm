import { Employees } from "@/components/employees";
import { getEmpleados } from "@/lib/data";

export default async function EmployeesPage() {
  const employees = await getEmpleados();
  return (
    <Employees initialEmployees={employees} />
  );
}
