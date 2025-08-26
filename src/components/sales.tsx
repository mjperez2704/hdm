
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
import { File, ListFilter, MoreHorizontal, PlusCircle, Search } from "lucide-react";
import type { Venta, Cliente, Producto, Coordenada } from "@/lib/types";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { SaleFormModal } from "./sale-form-modal";
import { Input } from "./ui/input";

type SalesProps = {
    initialSales: Venta[];
    clients: Cliente[];
    products: Producto[];
    coordenadas: Coordenada[];
}

export function Sales({ initialSales, clients, products, coordenadas }: SalesProps) {
  const { toast } = useToast();
  const [sales, setSales] = React.useState(initialSales);
  const [filteredSales, setFilteredSales] = React.useState(initialSales);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = sales.filter(item => {
      return (
        item.folio.toLowerCase().includes(lowercasedFilter) ||
        getClientName(item.cliente_id).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredSales(filteredData);
  }, [searchTerm, sales, getClientName]);


  const getClientName = React.useCallback((clientId: number) => {
    return clients.find((c) => c.id === clientId)?.razon_social || "N/A";
  }, [clients]);

  const handleSaveSale = (values: any) => {
    // This is a simulation. In a real app, this would call an API.
    const newSale: Venta = {
        id: Math.max(...sales.map(s => s.id), 0) + 1,
        folio: `VTA-2024-${String(Math.max(...sales.map(s => s.id), 0) + 1).padStart(3, '0')}`,
        fecha: new Date().toISOString(),
        cliente_id: Number(values.clientId),
        estado: 'PAGADA',
        total: values.items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0),
        items: values.items,
    };
    setSales(prev => [newSale, ...prev]);
    toast({
        title: "Venta Registrada",
        description: `La venta con folio ${newSale.folio} ha sido creada.`
    });
    setIsModalOpen(false);
  };
  
  const handleExport = () => {
    toast({
      title: "Exportación Iniciada",
      description: "Se está generando el reporte de ventas (simulado).",
    });
  }
  
  const statusVariant: Record<Venta["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    PAGADA: "default",
    PARCIAL: "secondary",
    CANCELADA: "destructive",
    BORRADOR: "outline",
  };

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
                 <CardTitle>Ventas</CardTitle>
                <CardDescription>
                Revisa el historial de ventas.
                </CardDescription>
            </div>
            <div className="flex justify-end gap-2">
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
                <Button size="sm" className="h-7 gap-1" onClick={() => setIsModalOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Agregar Venta
                </span>
                </Button>
            </div>
        </div>
        <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por folio o cliente..."
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
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.folio}</TableCell>
                    <TableCell>{getClientName(sale.cliente_id)}</TableCell>
                    <TableCell>{new Date(sale.fecha).toLocaleDateString()}</TableCell>
                    <TableCell>
                        <Badge variant={statusVariant[sale.estado]}>{sale.estado}</Badge>
                    </TableCell>
                    <TableCell className="text-right">${sale.total.toFixed(2)}</TableCell>
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
                            <DropdownMenuItem>Editar</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                            Cancelar Venta
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            ))}
             {filteredSales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron ventas.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <SaleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSale}
        clients={clients}
        products={products}
        coordenadas={coordenadas}
    />
    </>
  );
}
