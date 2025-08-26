"use client";

import * as React from "react";
import type { Herramienta, Empleado } from "@/lib/types";
import { AssignToolModal } from "./assign-tool-modal";
import { Button } from "./ui/button";
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

type ToolsListClientProps = {
  initialTools: Herramienta[];
  employees: Empleado[];
};

export function ToolsListClient_ori({ initialTools, employees }: ToolsListClientProps) {
  const [tools, setTools] = React.useState(initialTools);
  const [selectedTool, setSelectedTool] = React.useState<Herramienta | null>(null);

  const handleAssign = async (toolId: number, employeeId: number) => {
    console.log(`Lógica para asignar herramienta ${toolId} a empleado ${employeeId}`);
    // Aquí iría tu llamada a la API para guardar la asignación
    // await assignToolToEmployee(toolId, employeeId);
    // Podrías actualizar el estado `tools` aquí para reflejar el cambio
    setSelectedTool(null); // Cierra el modal
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Herramientas</CardTitle>
          <CardDescription>Lista de herramientas disponibles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            {/* ... Aquí iría el TableHeader y el TableBody listando las herramientas ... */}
            {/* Ejemplo de una fila con el botón para abrir el modal: */}
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>{tool.nombre}</TableCell>
                <TableCell>{tool.sku}</TableCell>
                <TableCell>
                  <Button variant="outline" onClick={() => setSelectedTool(tool)}>
                    Asignar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </CardContent>
      </Card>

      <AssignToolModal
        isOpen={!!selectedTool}
        onClose={() => setSelectedTool(null)}
        onAssign={handleAssign}
        tool={selectedTool}
        employees={employees}
      />
    </>
  );
}
