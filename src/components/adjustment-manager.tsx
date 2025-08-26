"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Almacen, Producto, Coordenada, Seccion } from "@/lib/types";

const manualAdjustmentSchema = z.object({
  adjustmentType: z.enum(["ENTRADA", "SALIDA"], { required_error: "El tipo es requerido."}),
  warehouseId: z.string().min(1, "El almacén es requerido."),
  sectionId: z.string().min(1, "La sección es requerida."),
  coordenadaId: z.string().min(1, "La coordenada es requerida."),
  productId: z.string().min(1, "El producto es requerido."),
  quantity: z.coerce.number().int().positive("La cantidad debe ser mayor a cero."),
  reason: z.string().min(10, "La razón debe tener al menos 10 caracteres."),
});

type AdjustmentManagerProps = {
  almacenes: Almacen[];
  productos: Producto[];
  coordenadas: Coordenada[];
};

export function AdjustmentManager({
  almacenes,
  productos,
  coordenadas,
}: AdjustmentManagerProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof manualAdjustmentSchema>>({
    resolver: zodResolver(manualAdjustmentSchema),
  });

  const warehouseId = form.watch("warehouseId");
  const sectionId = form.watch("sectionId");

  const getSectionsForWarehouse = (id?: string): Seccion[] => {
    if (!id) return [];
    return almacenes.find((a) => String(a.id) === id)?.secciones || [];
  };

  const getCoordenadasForSection = (id?: string): Coordenada[] => {
    if (!id) return [];
    return coordenadas.filter((c) => String(c.seccion_id) === id);
  };
  
  const availableSections = getSectionsForWarehouse(warehouseId);
  const availableCoordenadas = getCoordenadasForSection(sectionId);

  // Simulación de permisos
  const userHasPermission = false; 

  function onManualSubmit(values: z.infer<typeof manualAdjustmentSchema>) {
    console.log("Ajuste manual:", values);
    if (userHasPermission) {
      toast({
        title: "Ajuste Realizado",
        description: `Se ha registrado el ajuste de ${values.quantity} unidad(es).`,
      });
    } else {
      toast({
        title: "Solicitud Enviada para Aprobación",
        description: "No tienes permiso para realizar ajustes directos. Tu solicitud ha sido enviada.",
      });
    }
    form.reset();
  }

  const handleDownloadLayout = () => {
    toast({
      title: "Descargando Layout (Simulado)",
      description: "En una aplicación real, se descargaría un archivo CSV de ejemplo."
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ajustes de Inventario</CardTitle>
        <CardDescription>
          Registra entradas, salidas o realiza un inventario físico mediante carga masiva.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="manual">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Ajuste Manual</TabsTrigger>
            <TabsTrigger value="massive">Carga Masiva (Inventario Real)</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <Card className="border-none shadow-none">
              <CardHeader>
                <CardTitle>Formulario de Ajuste Manual</CardTitle>
                <CardDescription>
                  Completa el formulario para registrar un movimiento de entrada o salida.
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onManualSubmit)}>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={form.control} name="adjustmentType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Ajuste</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..."/></SelectTrigger></FormControl>
                                    <SelectContent>
                                        <SelectItem value="ENTRADA">Entrada (Ajuste Positivo)</SelectItem>
                                        <SelectItem value="SALIDA">Salida (Ajuste Negativo)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="productId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Producto (SKU)</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..."/></SelectTrigger></FormControl>
                                    <SelectContent>{productos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre} ({p.sku})</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField control={form.control} name="warehouseId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Almacén</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..."/></SelectTrigger></FormControl>
                                    <SelectContent>{almacenes.map(a => <SelectItem key={a.id} value={String(a.id)}>{a.nombre}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <FormField control={form.control} name="sectionId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sección</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!warehouseId}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..."/></SelectTrigger></FormControl>
                                    <SelectContent>{availableSections.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.nombre}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="coordenadaId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Coordenada</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} disabled={!sectionId}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..."/></SelectTrigger></FormControl>
                                    <SelectContent>{availableCoordenadas.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.codigo_coordenada}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}/>
                    </div>
                     <FormField control={form.control} name="quantity" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl><Input type="number" placeholder="0" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                     <FormField control={form.control} name="reason" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Motivo / Justificación</FormLabel>
                            <FormControl><Textarea placeholder="Describe el motivo de este ajuste..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                </CardContent>
                <CardFooter>
                    <Button type="submit">Realizar Ajuste</Button>
                </CardFooter>
                </form>
                </Form>
            </Card>
          </TabsContent>
          <TabsContent value="massive">
             <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>Carga Masiva</CardTitle>
                    <CardDescription>
                        Sube un archivo CSV con el conteo de tu inventario real para ajustar el stock masivamente.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Haz clic para cargar</span> o arrastra y suelta</p>
                                <p className="text-xs text-muted-foreground">CSV (MAX. 5MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" disabled />
                        </label>
                    </div>
                    <Button variant="link" onClick={handleDownloadLayout}>
                        <Download className="mr-2 h-4 w-4" />
                        Descargar Layout de Ejemplo
                    </Button>
                </CardContent>
                 <CardFooter>
                    <Button disabled>Procesar Archivo</Button>
                </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
