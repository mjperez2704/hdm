import { ExpensesManager } from "@/components/expenses-manager";
import { getGastos, getEmpleados } from "@/lib/data";

export default async function ExpensesPage() {
  const expenses = await getGastos();
  const employees = await getEmpleados();

  return <ExpensesManager initialExpenses={expenses} employees={employees} />;
}
