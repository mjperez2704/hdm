
"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
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
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrdenServicio, Cliente, Marca, Modelo } from "@/lib/types";
import { ReceptionEquipmentForm } from "./reception-equipment-form";
import { Badge } from "./ui/badge";

type RepairsProps = {
  initialServiceOrders: OrdenServicio[];
  clients: Cliente[];
  brands: Marca[];
  models: Modelo[];
};

export function Repairs({ initialServiceOrders, clients, brands, models }: RepairsProps) {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const getClientName = (clientId: number) => {
    return clients.find(c => c.id === clientId)?.razon_social || "N/A";
  }

  const handleSaveReception = (values: any) => {
    console.log("Saving new reception:", values);
    toast({
        title: "Recepción Registrada",
        description: "El equipo ha sido registrado exitosamente para diagnóstico.",
    });
    setIsModalOpen(false);
  }

  const statusVariant: Record<OrdenServicio["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    RECEPCION: "outline",
    DIAGNOSTICO: "secondary",
    AUTORIZACION: "secondary",
    EN_REPARACION: "default",
    PRUEBAS: "default",
    LISTO: "default",
    ENTREGADO: "default",
    CANCELADO: "destructive",
  };

  return (
    <>
    <Tabs defaultValue="reception">
        <div className="flex items-center mb-4">
          <TabsList>
            <TabsTrigger value="reception">Recepción de Equipo</TabsTrigger>
            <TabsTrigger value="in_progress">Reparaciones en Proceso</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
           <Button variant="outline" size="sm" className="h-7 gap-1">
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filtrar
              </span>
            </Button>
            <Button size="sm" variant="outline" className="h-7 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
             <Button size="sm" className="h-7 gap-1" onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Registrar Recepción
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="reception">
            <Card>
            <CardHeader>
                <CardTitle>Equipos Recibidos para Diagnóstico</CardTitle>
                <CardDescription>
                Equipos que han ingresado al taller y están pendientes de diagnóstico y presupuesto.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Folio</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>
                        <span className="sr-only">Acciones</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialServiceOrders.map((order) => (
                         <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.folio}</TableCell>
                            <TableCell>{new Date(order.fecha).toLocaleDateString()}</TableCell>
                            <TableCell>{getClientName(order.cliente_id)}</TableCell>
                            <TableCell>
                                <Badge variant={statusVariant[order.estado]}>
                                    {order.estado.replace('_', ' ')}
                                </Badge>
                            </TableCell>
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
                                    <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                                    <DropdownMenuItem>Crear Presupuesto</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                    Cancelar Recepción
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                         </TableRow>
                    ))}
                </TableBody>
                </Table>
            </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="in_progress">
             <Card>
                <CardHeader>
                    <CardTitle>Reparaciones en Proceso</CardTitle>
                    <CardDescription>
                    Aquí se mostrarán las órdenes de servicio que ya han sido aprobadas.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No hay reparaciones en proceso actualmente.
                    </p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>

    <ReceptionEquipmentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveReception}
        clients={clients}
        brands={brands}
        models={models}
    />
    </>
  );
}
