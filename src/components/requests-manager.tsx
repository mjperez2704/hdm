
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
import { MoreHorizontal, PlusCircle, ListFilter, File, Check, X, Search } from "lucide-react";
import type { SolicitudInterna, Empleado } from "@/lib/types";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";

type RequestsManagerProps = {
  initialRequests: SolicitudInterna[];
  employees: Empleado[];
};

export function RequestsManager({ initialRequests, employees }: RequestsManagerProps) {
  const [requests, setRequests] = React.useState(initialRequests);
  const [filteredRequests, setFilteredRequests] = React.useState(initialRequests);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = requests.filter(item => {
      return (
        item.folio.toLowerCase().includes(lowercasedFilter) ||
        item.descripcion.toLowerCase().includes(lowercasedFilter) ||
        getEmployeeName(item.solicitante_id).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredRequests(filteredData);
  }, [searchTerm, requests]);


  const getEmployeeName = (employeeId: number) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.nombre} ${employee.apellido_p}` : "N/A";
  };
  
  const handleUpdateRequestStatus = (requestId: number, newStatus: "APROBADA" | "RECHAZADA") => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, estado: newStatus, aprobador_id: 1, fecha_respuesta: new Date().toISOString() } : req
    ));
    toast({
        title: `Solicitud ${newStatus === 'APROBADA' ? 'Aprobada' : 'Rechazada'}`,
        description: `La solicitud ha sido actualizada.`
    });
  }
  
  const handleExport = () => {
    toast({
      title: "Exportación Iniciada",
      description: "Se está generando el reporte de solicitudes (simulado).",
    });
  }

  const statusVariant: Record<SolicitudInterna["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    PENDIENTE: "secondary",
    APROBADA: "default",
    RECHAZADA: "destructive",
    CANCELADA: "outline",
  };

  const typeVariant: Record<SolicitudInterna["tipo"], "default" | "secondary" | "destructive" | "outline"> = {
    COMPRA: "outline",
    GASTO: "outline",
    PERMISO: "secondary",
    VACACIONES: "secondary",
    BAJA_PRODUCTO: "destructive",
    OTRO: "secondary",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <CardTitle>Solicitudes Internas</CardTitle>
            <CardDescription>
              Gestiona las solicitudes de compra, gastos, permisos y más.
            </CardDescription>
          </div>
          <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => alert('La funcionalidad de filtros avanzados estará disponible pronto.')}>
              <ListFilter className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filtrar
              </span>
            </Button>
            <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleExport}>
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Exportar
              </span>
            </Button>
            <Button size="sm" className="h-7 gap-1" onClick={() => toast({ title: "Funcionalidad no disponible", description: "La creación de solicitudes se realizará desde sus módulos correspondientes (ej. Compras, Gastos)." })}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Crear Solicitud
              </span>
            </Button>
          </div>
        </div>
         <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por folio, descripción o solicitante..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Folio</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Monto</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">{request.folio}</TableCell>
                <TableCell>{new Date(request.fecha_solicitud).toLocaleDateString()}</TableCell>
                <TableCell>{getEmployeeName(request.solicitante_id)}</TableCell>
                <TableCell>
                    <Badge variant={typeVariant[request.tipo]}>{request.tipo.replace('_', ' ')}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{request.descripcion}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[request.estado]}>{request.estado}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  {request.monto ? `$${request.monto.toFixed(2)}` : "-"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={request.estado !== 'PENDIENTE'}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menú</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRequestStatus(request.id, 'APROBADA')}>
                        <Check className="mr-2 h-4 w-4"/>Aprobar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateRequestStatus(request.id, 'RECHAZADA')} className="text-destructive">
                        <X className="mr-2 h-4 w-4"/>Rechazar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {filteredRequests.length === 0 && (
                <TableRow>
                    <TableCell colSpan={8} className="text-center h-24">
                        No hay solicitudes que coincidan con los filtros actuales.
                    </TableCell>
                </TableRow>
            )}
            {filteredRequests.length > 0 && filteredRequests.every(r => r.estado !== 'PENDIENTE') && (
                 <TableRow>
                    <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                        No hay solicitudes pendientes de revisión.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

    