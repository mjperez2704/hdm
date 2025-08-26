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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import type { Bitacora, Usuario } from "@/lib/types";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

type LogManagerProps = {
  initialLogs: Bitacora[];
  users: Usuario[];
};

export function LogManager({ initialLogs, users }: LogManagerProps) {
  const [logs, setLogs] = React.useState(initialLogs);
  const [filteredLogs, setFilteredLogs] = React.useState(initialLogs);

  const [date, setDate] = React.useState<Date | undefined>();
  const [userFilter, setUserFilter] = React.useState<string>("");
  const [actionFilter, setActionFilter] = React.useState<string>("");

  const actionTypes = [...new Set(logs.map(log => log.accion))];

  const applyFilters = React.useCallback(() => {
    let filtered = logs;

    if (date) {
      filtered = filtered.filter(log => format(new Date(log.fecha), "yyyy-MM-dd") === format(date, "yyyy-MM-dd"));
    }

    if (userFilter) {
      filtered = filtered.filter(log => String(log.usuario_id) === userFilter);
    }
    
    if (actionFilter) {
        filtered = filtered.filter(log => log.accion === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, date, userFilter, actionFilter]);

  React.useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setDate(undefined);
    setUserFilter("");
    setActionFilter("");
  }
  
  const isFiltered = date || userFilter || actionFilter;

  const getUserName = (userId: number) => {
    return users.find(u => u.id === userId)?.nombre ?? `ID ${userId}`;
  }

  const actionVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    CREACION: "default",
    ACTUALIZACION: "secondary",
    ELIMINACION: "destructive",
    LOGIN: "outline",
    COMPRA: "outline",
    VENTA: "default",
    INVENTARIO: "secondary",
    SEGURIDAD: "destructive",
  };
  
  const getActionCategory = (action: string) => {
      if (action.includes("CREACIÓN")) return "CREACION";
      if (action.includes("ACTUALIZACIÓN") || action.includes("AJUSTE") || action.includes("MOVIMIENTO")) return "ACTUALIZACION";
      if (action.includes("ELIMINACIÓN")) return "ELIMINACION";
      if (action.includes("COMPRA")) return "COMPRA";
      if (action.includes("VENTA")) return "VENTA";
      return "SEGURIDAD";
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>Bitácora del Sistema</CardTitle>
        <CardDescription>
          Registro de todos los eventos importantes que ocurren en el sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-2 mb-4 p-4 border rounded-lg">
            <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <h4 className="font-semibold text-sm">Filtros</h4>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className="w-full md:w-[240px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Filtrar por fecha</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
            </Popover>
            <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por usuario" />
                </SelectTrigger>
                <SelectContent>
                    {users.map(user => (
                        <SelectItem key={user.id} value={String(user.id)}>{user.nombre}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filtrar por acción" />
                </SelectTrigger>
                <SelectContent>
                    {actionTypes.map(action => (
                        <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {isFiltered && (
                 <Button variant="ghost" onClick={clearFilters} className="text-sm">
                    <X className="mr-2 h-4 w-4" />
                    Limpiar filtros
                </Button>
            )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Fecha y Hora</TableHead>
              <TableHead className="w-[150px]">Usuario</TableHead>
              <TableHead className="w-[180px]">Acción</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.fecha).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{getUserName(log.usuario_id)}</TableCell>
                <TableCell>
                  <Badge variant={actionVariant[getActionCategory(log.accion)] || 'secondary'}>{log.accion}</Badge>
                </TableCell>
                <TableCell>{log.descripcion}</TableCell>
              </TableRow>
            ))}
             {filteredLogs.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                        No se encontraron registros con los filtros seleccionados.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
