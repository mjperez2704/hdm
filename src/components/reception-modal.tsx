
"use client";

import * as React from "react";
import type { Purchase, ReceptionItem, Almacen, Coordenada, Producto } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useToast } from "@/hooks/use-toast";

type ReceptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
  almacenes: Almacen[];
  coordenadas: Coordenada[];
  allProducts: Producto[];
};

export function ReceptionModal({ isOpen, onClose, purchase, almacenes, coordenadas, allProducts }: ReceptionModalProps) {
  const [receptionItems, setReceptionItems] = React.useState<ReceptionItem[]>([]);
  const [showBackorderAlert, setShowBackorderAlert] = React.useState(false);
  const [backorderItem, setBackorderItem] = React.useState<ReceptionItem | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    if (purchase) {
      setReceptionItems(
        purchase.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          orderedQuantity: item.quantity,
          unitCost: item.price,
          receivedQuantity: item.quantity,
          isComplete: true,
          warehouseId: undefined,
          coordenadaId: undefined,
        }))
      );
    }
  }, [purchase]);

  const handleItemChange = (itemName: string, field: keyof ReceptionItem, value: any) => {
    setReceptionItems((prev) =>
      prev.map((item) => {
        if (item.name === itemName) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'isComplete') {
            updatedItem.receivedQuantity = value ? updatedItem.orderedQuantity : 0;
          }

          if (field === 'warehouseId') {
            updatedItem.coordenadaId = undefined;
          }
          
          return updatedItem;
        }
        return item;
      })
    );
  };
  
  const handleSaveReception = () => {
    const productWithBackorder = receptionItems.find(item => {
        const product = allProducts.find(p => p.id === item.productId);
        return product && product.backorder && product.backorder > 0;
    });

    if (productWithBackorder) {
        setBackorderItem(productWithBackorder);
        setShowBackorderAlert(true);
    } else {
        confirmReception();
    }
  }

  const confirmReception = (applyToBackorder = false) => {
    if (applyToBackorder && backorderItem) {
        console.log(`Aplicando ${backorderItem.receivedQuantity} unidades al backorder de ${backorderItem.name}`);
        // TODO: Implementar lógica de actualización de backorder y stock
    }
    console.log("Confirmando recepción:", receptionItems);
    // Lógica para guardar la recepción y actualizar el inventario
    toast({
        title: "Recepción Confirmada",
        description: "El inventario ha sido actualizado (simulado)."
    });
    setShowBackorderAlert(false);
    onClose();
  }
  
  const getCoordenadaForWarehouse = (warehouseId?: string) => {
    if(!warehouseId) return [];
    return coordenadas.filter(coordenada => String(coordenada.almacen_id) === warehouseId);
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Recibir Mercancía de Compra: {purchase.id}</DialogTitle>
          <DialogDescription>
            Confirma las cantidades recibidas y asigna la ubicación para cada artículo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU/Descripción</TableHead>
                <TableHead className="w-[120px] text-center">Cant. Pedida</TableHead>
                <TableHead className="w-[150px] text-center">Cant. Recibida</TableHead>
                <TableHead className="w-[100px] text-center">Completa</TableHead>
                <TableHead className="w-[200px]">Almacén</TableHead>
                <TableHead className="w-[200px]">Coordenada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {receptionItems.map(item => {
                    const availableCoordenadas = getCoordenadaForWarehouse(item.warehouseId);
                    return (
                    <TableRow key={item.name}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                        <TableCell className="text-center">
                            <Input
                                type="number"
                                value={item.receivedQuantity}
                                onChange={(e) => handleItemChange(item.name, 'receivedQuantity', parseInt(e.target.value, 10) || 0)}
                                className="w-24 mx-auto"
                                disabled={item.isComplete}
                            />
                        </TableCell>
                        <TableCell className="text-center">
                            <Checkbox 
                                checked={item.isComplete}
                                onCheckedChange={(checked) => handleItemChange(item.name, 'isComplete', !!checked)}
                            />
                        </TableCell>
                        <TableCell>
                            <Select onValueChange={(value) => handleItemChange(item.name, 'warehouseId', value)} value={item.warehouseId}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                <SelectContent>
                                    {almacenes.map(almacen => (
                                        <SelectItem key={almacen.id} value={String(almacen.id)}>{almacen.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableCell>
                        <TableCell>
                             <Select onValueChange={(value) => handleItemChange(item.name, 'coordenadaId', value)} value={item.coordenadaId} disabled={!item.warehouseId}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                <SelectContent>
                                    {availableCoordenadas.map(coordenada => (
                                        <SelectItem key={coordenada.id} value={String(coordenada.id)}>{coordenada.codigo_coordenada}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </TableCell>
                    </TableRow>
                )})}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSaveReception}>Confirmar Recepción</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <AlertDialog open={showBackorderAlert} onOpenChange={setShowBackorderAlert}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Producto con Backorder Detectado</AlertDialogTitle>
            <AlertDialogDescription>
                El producto "{backorderItem?.name}" tiene un saldo pendiente en backorder.
                ¿Deseas que la cantidad recibida ({backorderItem?.receivedQuantity}) se aplique para surtir este saldo?
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => confirmReception(false)}>No, Ingresar al Inventario</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirmReception(true)}>Sí, Surtir Backorder</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
   </>
  );
}
