
"use client";

import * as React from "react";
import type { Almacen, Coordenada, Producto } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "@/hooks/use-toast";

type InventoryVisualizerProps = {
  product: Producto;
  allAlmacenes: Almacen[];
  allCoordenadas: Coordenada[];
};

type DragInfo = {
    fromCoordenadaId: number;
    productId: number;
    quantity: number;
};

type TransferInfo = {
    fromCoordenada: Coordenada;
    toCoordenada: Coordenada;
    product: Producto;
    quantity: number;
};

export function InventoryVisualizer({ product, allAlmacenes, allCoordenadas }: InventoryVisualizerProps) {
  const { toast } = useToast();
  const [transferState, setTransferState] = React.useState<TransferInfo | null>(null);
  const [transferQuantity, setTransferQuantity] = React.useState(0);

  const handleDragStart = (e: React.DragEvent<HTMLSpanElement>, coordenada: Coordenada) => {
    const dragInfo: DragInfo = {
        fromCoordenadaId: coordenada.id,
        productId: product.id,
        quantity: coordenada.cantidad,
    };
    e.dataTransfer.setData("application/json", JSON.stringify(dragInfo));
    e.currentTarget.style.opacity = '0.5';
  };
  
  const handleDragEnd = (e: React.DragEvent<HTMLSpanElement>) => {
    e.currentTarget.style.opacity = '1';
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); 
    e.currentTarget.classList.add('bg-primary/10');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('bg-primary/10');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, toCoordenadaId: number) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-primary/10');
    const dragInfo: DragInfo = JSON.parse(e.dataTransfer.getData("application/json"));
    
    if (dragInfo.fromCoordenadaId === toCoordenadaId) return;

    const fromCoordenada = allCoordenadas.find(c => c.id === dragInfo.fromCoordenadaId);
    // Simulating a potential empty coordinate
    const toCoordenadaData = allCoordenadas.find(c => c.id === toCoordenadaId);
    const toAlmacen = allAlmacenes.find(a => a.secciones?.some(s => s.id === toCoordenadaData?.seccion_id));
    const toSeccion = toAlmacen?.secciones?.find(s => s.id === toCoordenadaData?.seccion_id);


    const toCoordenada: Coordenada = {
        id: toCoordenadaId,
        producto_id: product.id,
        cantidad: 0,
        almacen_id: toAlmacen?.id || 0,
        seccion_id: toSeccion?.id || 0,
        codigo_coordenada: toCoordenadaData?.codigo_coordenada || `C-${toCoordenadaId}`
    };


    if(fromCoordenada){
        setTransferState({
            fromCoordenada,
            toCoordenada,
            product,
            quantity: fromCoordenada.cantidad,
        });
        setTransferQuantity(fromCoordenada.cantidad);
    }
  };

  const confirmTransfer = () => {
    if (!transferState) return;

    if (transferQuantity <= 0 || transferQuantity > transferState.fromCoordenada.cantidad) {
      toast({
        variant: "destructive",
        title: "Cantidad inválida",
        description: "La cantidad a transferir no puede ser cero, negativa o mayor a la existencia en origen.",
      });
      return;
    }

    console.log("Simulating transfer:", {
        ...transferState,
        quantity: transferQuantity,
    });
    
    toast({
        title: "Traslado Simulado Exitoso",
        description: `Se movieron ${transferQuantity} ${product.unidad} de ${product.nombre} de ${transferState.fromCoordenada.codigo_coordenada} a ${transferState.toCoordenada.codigo_coordenada}.`,
    });

    // Reset state and close dialog
    setTransferState(null);
    setTransferQuantity(0);
  }
  
  const getCoordenadaForSection = (sectionId: number, almacenId: number): Coordenada[] => {
    let coords = allCoordenadas.filter(c => c.seccion_id === sectionId && c.almacen_id === almacenId);
    // Para que se vea más realista, simulamos 1-10 coordenadas aunque no todas tengan stock
    const existingCoordCodes = new Set(coords.map(c => c.codigo_coordenada));
    const numRandomCoords = Math.floor(Math.random() * 10) + 1;

    while (coords.length < numRandomCoords) {
        const newId = (allCoordenadas.length + coords.length + 1) * 1000;
        const newCode = `C-${sectionId}-${coords.length + 1}`;
        if (!existingCoordCodes.has(newCode)) {
             coords.push({
                id: newId,
                producto_id: product.id,
                almacen_id: almacenId,
                seccion_id: sectionId,
                codigo_coordenada: newCode,
                cantidad: 0,
            });
            existingCoordCodes.add(newCode);
        }
    }
    return coords;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visualizador de Inventario</CardTitle>
        <CardDescription>
          Distribución de: <span className="font-bold text-primary">{product.nombre} (SKU: {product.sku})</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {allAlmacenes.map((almacen) => (
          <Card key={almacen.id} className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">{almacen.nombre}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {almacen.secciones?.map((seccion) => {
                const coordenadasEnSeccion = getCoordenadaForSection(seccion.id, almacen.id);
                return (
                    <div key={seccion.id} className="p-3 border rounded-md bg-background">
                        <h4 className="font-semibold mb-2">{seccion.nombre}</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {coordenadasEnSeccion.map((coordenada) => {
                            const stockEnCoordenada = coordenada.producto_id === product.id ? coordenada.cantidad : 0;
                            return (
                            <div
                                key={coordenada.id}
                                onDrop={(e) => handleDrop(e, coordenada.id)}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                className="border rounded-md p-1 min-h-[50px] flex flex-col items-center justify-center transition-colors"
                            >
                                <p className="text-xs text-muted-foreground">{coordenada.codigo_coordenada}</p>
                                {stockEnCoordenada > 0 ? (
                                    <Badge
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, coordenada)}
                                        onDragEnd={handleDragEnd}
                                        className="text-lg cursor-grab active:cursor-grabbing"
                                    >
                                        {stockEnCoordenada}
                                    </Badge>
                                ) : (
                                    <div className="h-[22px]" />
                                )}
                            </div>
                            );
                        })}
                        </div>
                    </div>
                )
              })}
            </CardContent>
          </Card>
        ))}
      </CardContent>
       {transferState && (
         <AlertDialog open={!!transferState} onOpenChange={() => setTransferState(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Traslado</AlertDialogTitle>
                <AlertDialogDescription>
                    Estás a punto de mover <span className="font-bold">{transferState.product.nombre}</span>.
                    <br/>
                    Desde: <span className="font-semibold">{transferState.fromCoordenada.codigo_coordenada}</span>
                    <br/>
                    Hacia: <span className="font-semibold">{transferState.toCoordenada.codigo_coordenada}</span>
                </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                    <Label htmlFor="transfer-quantity">Cantidad a trasladar (Máx: {transferState.fromCoordenada.cantidad})</Label>
                    <Input
                        id="transfer-quantity"
                        type="number"
                        value={transferQuantity}
                        onChange={(e) => setTransferQuantity(parseInt(e.target.value) || 0)}
                        max={transferState.fromCoordenada.cantidad}
                        min={1}
                    />
                </div>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setTransferState(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={confirmTransfer}>Confirmar Traslado</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </Card>
  );
}
