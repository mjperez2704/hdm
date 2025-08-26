
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
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
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Upload } from "lucide-react";
import type { Cliente, Marca, Modelo } from "@/lib/types";
import { ReceptionChecklist, type ChecklistState } from "./reception-checklist";

const receptionChecklistItems = [
    { id: 'display', label: 'Pantalla / Táctil' },
    { id: 'camera_front', label: 'Cámara Frontal' },
    { id: 'camera_rear', label: 'Cámara Trasera' },
    { id: 'microphone', label: 'Micrófono' },
    { id: 'speaker', label: 'Bocina Superior (Llamadas)' },
    { id: 'loudspeaker', label: 'Altavoz' },
    { id: 'buttons', label: 'Botones Físicos' },
    { id: 'charging_port', label: 'Puerto de Carga' },
    { id: 'wifi_bluetooth', label: 'WiFi / Bluetooth' },
    { id: 'sim', label: 'Lector de SIM' },
    { id: 'sensors', label: 'Sensores (Proximidad, etc.)' },
];

const formSchema = z.object({
  clientId: z.string().min(1, "Debe seleccionar un cliente."),
  brandId: z.string().min(1, "Debe seleccionar una marca."),
  modelId: z.string().min(1, "Debe seleccionar un modelo."),
  imei: z.string().optional(),
  reportedFault: z.string().min(10, "La descripción de la falla es requerida (mín. 10 caracteres)."),
  observations: z.string().min(10, "Las observaciones son requeridas (mín. 10 caracteres)."),
  checklist: z.record(z.object({
    status: z.enum(['ok', 'fail']).optional(),
    notes: z.string().optional(),
  })).optional(),
});

type ReceptionEquipmentFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>) => void;
  clients: Cliente[];
  brands: Marca[];
  models: Modelo[];
};

export function ReceptionEquipmentForm({
  isOpen,
  onClose,
  onSave,
  clients,
  brands,
  models
}: ReceptionEquipmentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportedFault: "",
      observations: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values);
    form.reset();
  };

  const brandId = form.watch("brandId");
  const filteredModels = models.filter(m => String(m.marca_id) === brandId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Registrar Recepción de Equipo</DialogTitle>
          <DialogDescription>
            Complete el formulario y la checklist de diagnóstico para registrar el ingreso de un nuevo equipo.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="max-h-[70vh] overflow-y-auto p-1 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Columna Izquierda: Datos y checklist */}
              <div className="space-y-4">
                 <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un cliente" /></SelectTrigger></FormControl>
                        <SelectContent>{clients.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.razon_social}</SelectItem>))}</SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brandId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca del Equipo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                            <SelectContent>{brands.map((b) => (<SelectItem key={b.id} value={String(b.id)}>{b.nombre}</SelectItem>))}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="modelId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!brandId}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl>
                            <SelectContent>{filteredModels.map((m) => (<SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>))}</SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                 </div>
                 <FormField
                  control={form.control}
                  name="imei"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IMEI / Número de Serie</FormLabel>
                      <FormControl><Input placeholder="Identificador único del equipo" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="reportedFault"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Falla Reportada por el Cliente</FormLabel>
                      <FormControl><Textarea placeholder="Ej: No enciende, la pantalla está rota..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones de Recepción</FormLabel>
                      <FormControl><Textarea placeholder="Ej: Equipo con rayones en la parte trasera, sin cargador..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Columna Derecha: Checklist y fotos */}
              <div className="space-y-4">
                 <FormField
                    control={form.control}
                    name="checklist"
                    render={({ field }) => (
                       <FormItem>
                         <FormLabel>Checklist de Diagnóstico Inicial</FormLabel>
                         <ReceptionChecklist 
                            items={receptionChecklistItems}
                            value={field.value as ChecklistState}
                            onChange={field.onChange}
                         />
                         <FormMessage/>
                       </FormItem>
                    )}
                 />
                <div>
                  <FormLabel>Fotografías del Equipo</FormLabel>
                  <div className="flex items-center justify-center w-full mt-2">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/75">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Cargar fotos</span></p>
                            <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 5MB)</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" disabled />
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">Registrar Equipo</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
