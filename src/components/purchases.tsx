
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
import { MoreHorizontal, PlusCircle, File, ListFilter, Truck, Search } from "lucide-react";
import type { Purchase, Proveedor, Almacen, Coordenada, Producto, SolicitudInterna } from "@/lib/types";
import { Badge } from "./ui/badge";
import { ReceptionModal } from "./reception-modal";
import { PurchaseRequestForm } from "./purchase-request-form";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";

export function Purchases({
  initialPurchases,
  initialProviders,
  almacenes,
  coordenadas,
  productos,
}: {
  initialPurchases: Purchase[];
  initialProviders: Proveedor[];
  almacenes: Almacen[];
  coordenadas: Coordenada[];
  productos: Producto[];
}) {
  const { toast } = useToast();
  const [purchases, setPurchases] = React.useState(initialPurchases);
  const [filteredPurchases, setFilteredPurchases] = React.useState(initialPurchases);
  const [providers, setProviders] = React.useState(initialProviders);
  const [selectedPurchase, setSelectedPurchase] = React.useState<Purchase | null>(null);
  const [isReceptionModalOpen, setReceptionModalOpen] = React.useState(false);
  const [isRequestModalOpen, setRequestModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");


  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = purchases.filter(item => {
      return (
        item.id.toLowerCase().includes(lowercasedFilter) ||
        getProviderName(item.providerId).toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredPurchases(filteredData);
  }, [searchTerm, purchases, providers]);


  const getProviderName = (providerId: string) => {
    return providers.find((p) => String(p.id) === providerId)?.razon_social || "N/A";
  };
  
  const handleOpenReception = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setReceptionModalOpen(true);
  }

  const handleSaveRequest = (values: any) => {
    console.log("Guardando nueva solicitud de compra:", values);
    
    // TODO: En una app real, esto llamaría a una API para crear una SolicitudInterna
    const total = values.items.reduce((acc: number, item: any) => acc + item.quantity * item.price, 0);
    const newRequest: SolicitudInterna = {
        id: Math.floor(Math.random() * 10000),
        folio: `SOL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        solicitante_id: 1, // Asumimos que el admin (user 1) lo registra por ahora
        fecha_solicitud: new Date().toISOString(),
        tipo: 'COMPRA',
        descripcion: `Solicitud de compra para proveedor ID: ${values.providerId}. ${values.items.length} artículos.`,
        estado: 'PENDIENTE',
        monto: total,
    };
    
    console.log("Nueva solicitud interna creada:", newRequest);
    
    toast({
      title: "Solicitud de Compra Enviada",
      description: "Tu solicitud ha sido enviada para aprobación.",
    });

    setRequestModalOpen(false);
  };
  
  const handleExport = () => {
    toast({
      title: "Exportación Iniciada",
      description: "Se está generando el reporte de compras (simulado).",
    });
  }

  const statusVariant: Record<Purchase["status"], "default" | "secondary" | "outline"> = {
    "Pendiente": "secondary",
    "Recibida Parcial": "outline",
    "Recibida Completa": "default"
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
          <div>
            <CardTitle>Compras</CardTitle>
            <CardDescription>
              Administra las órdenes de compra a proveedores.
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
            <Button size="sm" className="h-7 gap-1" onClick={() => setRequestModalOpen(true)}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Solicitar Compra
              </span>
            </Button>
          </div>
        </div>
         <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por ID o proveedor..."
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
              <TableHead>ID Compra</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">{purchase.id}</TableCell>
                <TableCell>{getProviderName(purchase.providerId)}</TableCell>
                <TableCell>{purchase.date}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[purchase.status]}>{purchase.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  ${purchase.total.toFixed(2)}
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
                      <DropdownMenuItem onClick={() => handleOpenReception(purchase)}>
                        <Truck className="mr-2 h-4 w-4" />
                        Recibir Mercancía
                      </DropdownMenuItem>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {filteredPurchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron compras.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     {selectedPurchase && (
        <ReceptionModal
          isOpen={isReceptionModalOpen}
          onClose={() => setReceptionModalOpen(false)}
          purchase={selectedPurchase}
          almacenes={almacenes}
          coordenadas={coordenadas}
          allProducts={productos}
        />
      )}
      <PurchaseRequestForm
        isOpen={isRequestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSave={handleSaveRequest}
        providers={providers}
        products={productos}
       />
    </>
  );
}
