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
import { useToast } from "@/hooks/use-toast";

type ToolsListClientProps = {
  initialTools: Herramienta[];
  employees: Empleado[];
};

export function ToolsListClient({ initialTools, employees }: ToolsListClientProps) {
  const { toast } = useToast();
  const [tools, setTools] = React.useState(initialTools);
  const [selectedTool, setSelectedTool] = React.useState<Herramienta | null>(null);

  // Esta función se define y se pasa dentro del cliente, lo cual es correcto.
  const handleAssign = async (toolId: number, employeeId: number) => {
    console.log(`Asignando herramienta ${toolId} a empleado ${employeeId}`);
    // Aquí iría tu llamada a una API o Server Action para guardar en la BD.
    // await assignToolAction(toolId, employeeId);

    toast({
        title: "Herramienta Asignada",
        description: `La herramienta ha sido asignada correctamente.`,
    });

    // Cierra el modal y podrías actualizar la lista de herramientas si es necesario.
    setSelectedTool(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Herramientas</CardTitle>
          <CardDescription>Lista de herramientas disponibles para asignar.</CardDescription>
        </CardHeader>
        <CardContent>
        <Table>
          <TableHeader>
              <TableRow>
                  <TableHead>Herramienta</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
              {tools.map((tool) => (
              <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.nombre}</TableCell>
                  <TableCell>{tool.sku}</TableCell>
                  <TableCell className="text-right">
                  <Button variant="outline" onClick={() => setSelectedTool(tool)}>
                      Asignar
                  </Button>
                  </TableCell>
              </TableRow>
              ))}
          </TableBody>
        </Table>
        </CardContent>
      </Card>

      {/* El modal se renderiza aquí, y las props son funciones locales del cliente. */}
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