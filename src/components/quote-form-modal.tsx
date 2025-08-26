
"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { PlusCircle, Trash2, UserSearch, Calendar as CalendarIcon } from "lucide-react";
import type { Cliente, Producto, Presupuesto } from "@/lib/types";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { ClientSearchModal } from "./client-search-modal";
import { useToast } from "@/hooks/use-toast";
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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "./ui/calendar";

const quoteItemSchema = z.object({
  productName: z.string().min(1, "El nombre del producto es requerido."),
  quantity: z.coerce.number().positive("La cantidad debe ser mayor a cero."),
  price: z.coerce.number().min(0, "El precio no puede ser negativo."),
});

const formSchema = z.object({
  clientId: z.number({ required_error: "Debe seleccionar un cliente." }),
  clientName: z.string(),
  items: z
    .array(quoteItemSchema)
    .min(1, "Debe agregar al menos un artículo."),
  discountConcept: z.string().optional(),
  discount: z.coerce
    .number()
    .min(0, "El descuento no puede ser negativo.")
    .optional()
    .default(0),
  observaciones: z.string().optional(),
  fecha_vencimiento: z.date({
    required_error: "La fecha de vencimiento es requerida.",
  }),
});

type QuoteFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: z.infer<typeof formSchema>, quoteId?: number) => void;
  clients: Cliente[];
  products: Producto[];
  quote: Presupuesto | null;
};

export function QuoteFormModal({
  isOpen,
  onClose,
  onSave,
  clients,
  products,
  quote
}: QuoteFormModalProps) {
  const { toast } = useToast();
  const [isClientModalOpen, setIsClientModalOpen] = React.useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState<"save" | "send">("save");
  
  const isEditing = !!quote;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  React.useEffect(() => {
    if (isOpen) {
      if (isEditing && quote) {
        const client = clients.find(c => c.id === quote.cliente_id);
        form.reset({
          clientId: quote.cliente_id,
          clientName: client?.razon_social || '',
          items: quote.items?.map(item => ({
            productName: item.producto_id ? products.find(p => p.id === item.producto_id)?.nombre || `ID: ${item.producto_id}` : item.descripcion || '',
            quantity: item.cantidad,
            price: item.precio_unitario,
          })) || [],
          discountConcept: quote.descuento_concepto || '',
          discount: quote.descuento_monto || 0,
          observaciones: quote.observaciones || '',
          fecha_vencimiento: new Date(quote.fecha_vencimiento!),
        });
      } else {
        form.reset({
          items: [{ productName: "", quantity: 1, price: 0 }],
          discount: 0,
          fecha_vencimiento: new Date(new Date().setDate(new Date().getDate() + 7)),
          observaciones: '',
          discountConcept: '',
        });
      }
    }
  }, [isOpen, isEditing, quote, form, clients, products]);


  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = form.watch("items");
  const watchedDiscount = form.watch("discount");

  const subtotal = React.useMemo(
    () =>
      (watchedItems || []).reduce(
        (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
        0
      ),
    [watchedItems]
  );

  const total = React.useMemo(
    () => subtotal - (watchedDiscount || 0),
    [subtotal, watchedDiscount]
  );
  
  const handleSelectClient = (client: Cliente) => {
    form.setValue("clientId", client.id);
    form.setValue("clientName", client.razon_social);
  };
  
  const handleSaveOrSend = (action: "save" | "send") => {
    setConfirmAction(action);
    form.trigger().then(isValid => {
      if(isValid) {
        setIsConfirmOpen(true);
      } else {
        toast({
            variant: "destructive",
            title: "Formulario Incompleto",
            description: "Por favor, revisa los campos marcados en rojo.",
        })
      }
    });
  }

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSave(values, quote?.id);
    form.reset();
  };
  
  const confirmAndSubmit = () => {
    setIsConfirmOpen(false);
    form.handleSubmit(handleSubmit)();

    if (confirmAction === 'send') {
      toast({
        title: "Presupuesto Enviado (Simulado)",
        description: "El PDF se ha generado y enviado al cliente por WhatsApp y Email.",
      });
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? `Editar Presupuesto: ${quote?.folio}` : 'Crear Nuevo Presupuesto'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica los detalles del presupuesto.' : 'Complete el formulario para generar un nuevo presupuesto.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4">
              <div className="max-h-[65vh] overflow-y-auto p-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-4">
                    <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cliente</FormLabel>
                                <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input {...field} readOnly placeholder="Seleccione un cliente..."/>
                                </FormControl>
                                <Button type="button" variant="outline" size="icon" onClick={() => setIsClientModalOpen(true)}>
                                    <UserSearch className="h-4 w-4"/>
                                </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                  <div className="flex-grow">
                    <FormLabel>Artículos</FormLabel>
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-2 items-start p-2 border rounded-md mb-2"
                      >
                         <FormField
                            control={form.control}
                            name={`items.${index}.productName`}
                            render={({ field }) => (
                                <FormItem className="col-span-5">
                                {index === 0 && <FormLabel>Producto/Servicio</FormLabel>}
                                <FormControl>
                                    <Input placeholder="Descripción..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                         />
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              {index === 0 && <FormLabel>Cant.</FormLabel>}
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`items.${index}.price`}
                          render={({ field }) => (
                            <FormItem className="col-span-3">
                              {index === 0 && <FormLabel>Precio</FormLabel>}
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="col-span-2 flex flex-col items-end gap-1 pt-1">
                            {index === 0 && <FormLabel className="opacity-0 hidden sm:inline-block">Total</FormLabel>}
                             <p className="text-sm font-medium w-full text-right self-center">
                                {( (watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.price || 0) ).toFixed(2)}
                            </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive h-8 w-8 mt-auto"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => append({ productName: "", quantity: 1, price: 0 })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Agregar Artículo
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fecha_vencimiento"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de Vencimiento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Seleccione una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Observaciones Generales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Añade notas, términos y condiciones..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-lg">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between items-center text-lg">
                         <FormField
                            control={form.control}
                            name="discountConcept"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormLabel className="m-0">Descuento:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Concepto (ej. Promoción)" {...field} className="w-40 h-8 text-sm"/>
                                    </FormControl>
                                </FormItem>
                            )}
                         />
                         <FormField
                            control={form.control}
                            name="discount"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} className="w-24 h-8"/>
                                    </FormControl>
                                </FormItem>
                            )}
                         />
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="button" variant="outline" onClick={() => handleSaveOrSend("save")}>
                  Guardar
                </Button>
                <Button type="button" onClick={() => handleSaveOrSend("send")}>
                  Guardar y Enviar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <ClientSearchModal 
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSelectClient={handleSelectClient}
        clients={clients}
      />

       <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Confirmar y {confirmAction === 'send' ? 'Enviar' : 'Guardar'} Presupuesto?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "send"
                ? "Se guardará el presupuesto y se simulará el envío por WhatsApp y Email al cliente. ¿Deseas continuar?"
                : `Se ${isEditing ? 'actualizarán los cambios' : 'guardará el presupuesto'} como borrador. Podrás enviarlo más tarde.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAndSubmit}>
                {confirmAction === "send" ? "Sí, Guardar y Enviar" : "Sí, Guardar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
