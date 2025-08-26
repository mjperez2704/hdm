
"use client";

import * as React from "react";
import type { Presupuesto } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
import { Separator } from "./ui/separator";

type QuoteDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  quote: Presupuesto;
  clientName: string;
};

export function QuoteDetailModal({
  isOpen,
  onClose,
  quote,
  clientName
}: QuoteDetailModalProps) {
  
  const subtotal = quote.items?.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0) || 0;
  const total = subtotal - (quote.descuento_monto || 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalles del Presupuesto: {quote.folio}</DialogTitle>
          <DialogDescription>
             Estado: <Badge variant={quote.estado === 'ACEPTADO' ? 'default' : quote.estado === 'VENCIDO' || quote.estado === 'RECHAZADO' ? 'destructive' : 'secondary'}>{quote.estado}</Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[65vh] overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-semibold">Cliente:</p>
                    <p className="text-muted-foreground">{clientName}</p>
                </div>
                 <div>
                    <p className="font-semibold">Fecha de Emisión:</p>
                    <p className="text-muted-foreground">{format(new Date(quote.fecha), "PPP", { locale: es })}</p>
                </div>
                 <div>
                    <p className="font-semibold">Fecha de Vencimiento:</p>
                    <p className="text-muted-foreground">{format(new Date(quote.fecha_vencimiento!), "PPP", { locale: es })}</p>
                </div>
            </div>
            <Separator/>
            <h4 className="font-semibold">Artículos</h4>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-center">Cant.</TableHead>
                    <TableHead className="text-right">Precio Unit.</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {quote.items?.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{item.descripcion || `Producto ID: ${item.producto_id}`}</TableCell>
                        <TableCell className="text-center">{item.cantidad}</TableCell>
                        <TableCell className="text-right">${item.precio_unitario.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${(item.cantidad * item.precio_unitario).toFixed(2)}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            <Separator/>
            <div className="space-y-2 text-sm">
                 <div className="flex justify-end items-center gap-4">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-semibold w-28 text-right">${subtotal.toFixed(2)}</span>
                </div>
                {quote.descuento_monto && quote.descuento_monto > 0 && (
                    <div className="flex justify-end items-center gap-4">
                        <span className="text-muted-foreground">Descuento ({quote.descuento_concepto || 'General'}):</span>
                        <span className="font-semibold w-28 text-right text-destructive">-${quote.descuento_monto.toFixed(2)}</span>
                    </div>
                )}
                 <div className="flex justify-end items-center gap-4 font-bold text-base border-t pt-2">
                    <span >Total:</span>
                    <span className="w-28 text-right">${total.toFixed(2)}</span>
                </div>
            </div>

            {quote.observaciones && (
                <>
                <Separator/>
                 <div>
                    <h4 className="font-semibold mb-2">Observaciones</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-md">
                        {quote.observaciones}
                    </p>
                </div>
                </>
            )}
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Imprimir (Simulado)</Button>
            <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
