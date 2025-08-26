
"use client";

import * as React from "react";
import type { Gasto, Empleado, SolicitudInterna } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, ListFilter, File, Eye } from "lucide-react";
import { ExpensesFilterDialog, type ExpensesFilterValues } from "./expenses-filter-dialog";
import { ExpenseFormModal } from "./expense-form-modal";
import { useToast } from "@/hooks/use-toast";

type ExpensesManagerProps = {
  initialExpenses: Gasto[];
  employees: Empleado[];
};

export function ExpensesManager({ initialExpenses, employees }: ExpensesManagerProps) {
  const { toast } = useToast();
  const [expenses, setExpenses] = React.useState(initialExpenses);
  const [filteredExpenses, setFilteredExpenses] = React.useState(initialExpenses);
  const [isFilterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = React.useState(false);
  const [rowsToShow, setRowsToShow] = React.useState(10);

  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? `${employee.nombre} ${employee.apellido_p}` : `ID ${employeeId}`;
  };

  const handleApplyFilters = (filters: ExpensesFilterValues) => {
    let filtered = [...initialExpenses];

    if (filters.dateRange?.from) {
        filtered = filtered.filter(expense => new Date(expense.fecha) >= filters.dateRange!.from!);
    }
    if (filters.dateRange?.to) {
        filtered = filtered.filter(expense => new Date(expense.fecha) <= filters.dateRange!.to!);
    }
    if (filters.category && filters.category !== "all") {
        filtered = filtered.filter(expense => expense.categoria === filters.category);
    }
    if (filters.employeeId && filters.employeeId !== "all") {
        filtered = filtered.filter(expense => String(expense.empleado_id) === filters.employeeId);
    }
    if (filters.status && filters.status !== "all") {
        filtered = filtered.filter(expense => expense.estado === filters.status);
    }

    setFilteredExpenses(filtered);
  };
  
  const handleSaveExpense = (values: any) => {
    console.log("Creando solicitud de gasto:", values);
    // TODO: En una app real, esto llamaría a una API para crear una SolicitudInterna
    const newRequest: SolicitudInterna = {
        id: Math.floor(Math.random() * 10000),
        folio: `SOL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        solicitante_id: values.employeeId, // Asumimos que el admin (user 1) lo registra por ahora
        fecha_solicitud: new Date().toISOString(),
        tipo: 'GASTO',
        descripcion: values.descripcion,
        estado: 'PENDIENTE',
        monto: values.monto,
    };
    
    toast({
        title: "Solicitud de Gasto Creada",
        description: "La solicitud ha sido enviada para aprobación."
    });
    setExpenseModalOpen(false);
  }

  const handleExport = () => {
    toast({
      title: "Exportación Iniciada",
      description: "Se está generando el reporte de gastos (simulado).",
    });
  }

  const statusVariant: Record<Gasto["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    APROBADO: "default",
    PENDIENTE: "secondary",
    RECHAZADO: "destructive",
  };
  
  const paginatedExpenses = filteredExpenses.slice(0, rowsToShow);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                  <CardTitle>Gestión de Gastos</CardTitle>
                  <CardDescription>
                  Administra los gastos registrados en el sistema.
                  </CardDescription>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline" className="h-9 gap-1" onClick={() => setFilterDialogOpen(true)}>
                      <ListFilter className="h-4 w-4" />
                      Filtrar
                  </Button>
                  <Button variant="outline" className="h-9 gap-1" onClick={handleExport}>
                      <File className="h-4 w-4" />
                      Exportar
                  </Button>
                  <Button className="h-9 gap-1" onClick={() => setExpenseModalOpen(true)}>
                      <PlusCircle className="h-4 w-4" />
                      Registrar Gasto
                  </Button>
              </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Mostrar</span>
                <Select value={String(rowsToShow)} onValueChange={(value) => setRowsToShow(Number(value))}>
                    <SelectTrigger className="w-20 h-9">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                 <span className="text-sm text-muted-foreground">registros.</span>
            </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Realizado por</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedExpenses.map((gasto) => (
                <TableRow key={gasto.id}>
                  <TableCell>{new Date(gasto.fecha).toLocaleDateString()}</TableCell>
                  <TableCell><Badge variant="outline">{gasto.categoria}</Badge></TableCell>
                  <TableCell className="max-w-xs truncate">{gasto.descripcion}</TableCell>
                  <TableCell>{getEmployeeName(gasto.empleado_id)}</TableCell>
                  <TableCell><Badge variant={statusVariant[gasto.estado]}>{gasto.estado}</Badge></TableCell>
                  <TableCell className="text-right font-medium">${gasto.monto.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4"/>Ver Detalles</DropdownMenuItem>
                        {gasto.estado === 'PENDIENTE' && <DropdownMenuItem>Aprobar/Rechazar</DropdownMenuItem>}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {paginatedExpenses.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                        No se encontraron gastos con los filtros actuales.
                    </TableCell>
                </TableRow>
            )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ExpensesFilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={handleApplyFilters}
        onClear={() => setFilteredExpenses(initialExpenses)}
        employees={employees}
        allCategories={[...new Set(initialExpenses.map(e => e.categoria))]}
      />
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        onSave={handleSaveExpense}
        employees={employees}
      />
    </>
  );
}
