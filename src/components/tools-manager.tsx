
"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Herramienta, Empleado } from "@/lib/types";
import { Badge } from "./ui/badge";
import { ToolFormModal } from "./tool-form-modal";
import { useToast } from "@/hooks/use-toast";
import { AssignToolModal } from "./assign-tool-modal";
import { UpdateToolStatusDialog } from "./update-tool-status-dialog";
import { saveTool, assignTool, updateToolStatus, deleteTool } from "@/lib/actions";
import type { ToolFormValues } from "@/lib/schemas";


type ToolsManagerProps = {
  initialTools: Herramienta[];
  employees: Empleado[];
};

type ModalState = {
    type: 'ADD' | 'EDIT' | 'ASSIGN' | 'UPDATE_STATUS' | null;
    data: Herramienta | null;
    newStatus?: Herramienta['estado'];
};

export function ToolsManager({ initialTools, employees }: ToolsManagerProps) {
  const { toast } = useToast();
  const [modalState, setModalState] = React.useState<ModalState>({ type: null, data: null });

  const getEmployeeName = (employeeId?: number) => {
    if (!employeeId) return "N/A";
    const employee = employees.find((e) => e.id === employeeId);
    return employee ? `${employee.nombre} ${employee.apellido_p}` : `ID ${employeeId}`;
  };

  const statusVariant: Record<Herramienta["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    DISPONIBLE: "default",
    ASIGNADA: "secondary",
    EN_MANTENIMIENTO: "outline",
    DE_BAJA: "destructive",
  };
  
  const handleSaveTool = async (values: ToolFormValues, toolId?: number) => {
    const result = await saveTool(values, toolId);
    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setModalState({ type: null, data: null });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };
  
  const handleAssignTool = async (toolId: number, employeeId: number) => {
    const result = await assignTool(toolId, employeeId);
    if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setModalState({ type: null, data: null });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };
  
  const handleUpdateStatus = async (toolId: number, newStatus: Herramienta['estado']) => {
     const result = await updateToolStatus(toolId, newStatus);
     if (result.success) {
      toast({ title: "Éxito", description: result.message });
      setModalState({ type: null, data: null });
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const handleDeleteTool = async (toolId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta herramienta? Esta acción no se puede deshacer.")) {
        const result = await deleteTool(toolId);
        if (result.success) {
            toast({ title: "Herramienta Eliminada", description: result.message });
        } else {
            toast({ variant: "destructive", title: "Error al Eliminar", description: result.message });
        }
    }
  };


  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Catálogo de Herramientas</CardTitle>
              <CardDescription>
                Administra el inventario de herramientas internas del taller.
              </CardDescription>
            </div>
            <Button onClick={() => setModalState({ type: 'ADD', data: null })}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Herramienta
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Marca/Modelo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignada a</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialTools.map((tool) => (
                <TableRow key={tool.id}>
                  <TableCell className="font-medium">{tool.sku}</TableCell>
                  <TableCell>{tool.nombre}</TableCell>
                  <TableCell>{tool.marca || '-'} / {tool.modelo || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[tool.estado]}>{tool.estado.replace('_', ' ')}</Badge>
                  </TableCell>
                  <TableCell>{getEmployeeName(tool.asignada_a_empleado_id)}</TableCell>
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
                        <DropdownMenuItem onClick={() => setModalState({ type: 'EDIT', data: tool })}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalState({ type: 'ASSIGN', data: tool })} disabled={tool.estado !== 'DISPONIBLE'}>Asignar a Técnico</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setModalState({ type: 'UPDATE_STATUS', data: tool, newStatus: 'EN_MANTENIMIENTO' })}>Enviar a Mantenimiento</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteTool(tool.id)} className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {initialTools.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        No hay herramientas registradas.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ToolFormModal 
        isOpen={modalState.type === 'ADD' || modalState.type === 'EDIT'}
        onClose={() => setModalState({ type: null, data: null })}
        onSave={handleSaveTool}
        tool={modalState.data}
      />
      
      <AssignToolModal
        isOpen={modalState.type === 'ASSIGN'}
        onClose={() => setModalState({ type: null, data: null })}
        onAssign={handleAssignTool}
        tool={modalState.data}
        employees={employees}
      />
      
      <UpdateToolStatusDialog
        isOpen={modalState.type === 'UPDATE_STATUS'}
        onClose={() => setModalState({ type: null, data: null })}
        onConfirm={handleUpdateStatus}
        tool={modalState.data}
        newStatus={modalState.newStatus}
      />
    </>
  );
}
