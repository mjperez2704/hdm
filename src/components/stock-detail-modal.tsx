
"use client";

import * as React from "react";
import type { ProductoConStock, Coordenada, Almacen, Seccion } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

type StockDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: ProductoConStock;
  coordenadas: Coordenada[];
  almacenes: Almacen[];
};

export function StockDetailModal({
  isOpen,
  onClose,
  product,
  coordenadas,
  almacenes,
}: StockDetailModalProps) {
  
  const productCoordenadas = coordenadas.filter(coordenada => coordenada.producto_id === product.id && coordenada.cantidad > 0);

  const getFullLocation = (coordenada: Coordenada) => {
    const almacen = almacenes.find(a => a.id === coordenada.almacen_id);
    if (!almacen) return { almacen: 'N/A', seccion: 'N/A' };
    
    const seccion = almacen.secciones?.find(s => s.id === coordenada.seccion_id);
    return {
      almacen: almacen.nombre,
      seccion: seccion ? seccion.nombre : 'N/A',
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalle de Existencias: {product.nombre}</DialogTitle>
          <DialogDescription asChild>
            <span>
              SKU: {product.sku} | Existencia Total: <Badge>{product.stock}</Badge>
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Almacén</TableHead>
                <TableHead>Sección</TableHead>
                <TableHead>Coordenada</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productCoordenadas.map((coordenada) => {
                const location = getFullLocation(coordenada);
                return (
                  <TableRow key={coordenada.id}>
                    <TableCell>{location.almacen}</TableCell>
                    <TableCell>{location.seccion}</TableCell>
                    <TableCell className="font-medium">{coordenada.codigo_coordenada}</TableCell>
                    <TableCell className="text-right">{coordenada.cantidad}</TableCell>
                  </TableRow>
                );
              })}
              {productCoordenadas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No hay existencias registradas en ninguna coordenada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

