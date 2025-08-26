
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Producto } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  productIds: z.array(z.number()).refine((value) => value.some((item) => item), {
    message: "Tienes que seleccionar al menos un producto.",
  }),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
}).refine((data) => data.dateRange.to >= data.dateRange.from, {
    message: "La fecha final no puede ser anterior a la fecha inicial.",
    path: ["dateRange"],
});

type KardexFormProps = {
  products: Producto[];
};

export function KardexForm({ products }: KardexFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productIds: [],
      dateRange: {
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
      },
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Generando reporte de Kardex con:", values);
    toast({
        title: "Reporte Generado (Simulado)",
        description: `Se generó el Kardex para ${values.productIds.length} producto(s) desde ${format(values.dateRange.from, "PPP", { locale: es })} hasta ${format(values.dateRange.to, "PPP", { locale: es })}.`
    })
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Kardex de Producto(s)</CardTitle>
        <CardDescription>
          Selecciona los productos y el rango de fechas para generar el reporte de movimientos.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="productIds"
              render={() => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Productos</FormLabel>
                  <ScrollArea className="h-64 w-full rounded-md border p-4">
                    {products.map((product) => (
                      <FormField
                        key={product.id}
                        control={form.control}
                        name="productIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={product.id}
                              className="flex flex-row items-center space-x-3 space-y-0 mb-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(product.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, product.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== product.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {product.nombre} (SKU: {product.sku})
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-semibold">Rango de Fechas</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, "PPP", { locale: es })} -{" "}
                                {format(field.value.to, "PPP", { locale: es })}
                              </>
                            ) : (
                              format(field.value.from, "PPP", { locale: es })
                            )
                          ) : (
                            <span>Selecciona un rango de fechas</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field.value.from}
                        selected={{ from: field.value.from, to: field.value.to }}
                        onSelect={(range) => {
                            if(range) {
                                field.onChange(range)
                            }
                        }}
                        numberOfMonths={2}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Generar Reporte</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
