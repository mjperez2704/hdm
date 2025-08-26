
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Empleado } from "@/lib/types";
import { DateRange } from "react-day-picker";

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
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

const filterSchema = z.object({
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
  }).optional(),
  category: z.string().optional(),
  employeeId: z.string().optional(),
  authorizerId: z.string().optional(),
  status: z.string().optional(),
});

export type ExpensesFilterValues = z.infer<typeof filterSchema>;

type ExpensesFilterDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: ExpensesFilterValues) => void;
  onClear: () => void;
  employees: Empleado[];
  allCategories: string[];
};

export function ExpensesFilterDialog({
  isOpen,
  onClose,
  onApply,
  onClear,
  employees,
  allCategories,
}: ExpensesFilterDialogProps) {
  const form = useForm<ExpensesFilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      category: "all",
      employeeId: "all",
      authorizerId: "all",
      status: "all",
    },
  });

  const handleSubmit = (values: ExpensesFilterValues) => {
    onApply(values);
    onClose();
  };

  const handleClear = () => {
    form.reset();
    onClear();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Filtrar Gastos</DialogTitle>
          <DialogDescription>
            Aplica filtros para encontrar los gastos que buscas.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rango de Fechas</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal h-10",
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
                            <span>Selecciona un rango</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        selected={field.value as DateRange | undefined}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría de Gasto</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione una categoría"/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="all">Todas las categorías</SelectItem>
                            {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Realizado por</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un empleado"/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="all">Todos los empleados</SelectItem>
                            {employees.map(emp => <SelectItem key={emp.id} value={String(emp.id)}>{emp.nombre} {emp.apellido_p}</SelectItem>)}
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un estado"/></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                            <SelectItem value="APROBADO">Aprobado</SelectItem>
                            <SelectItem value="RECHAZADO">Rechazado</SelectItem>
                        </SelectContent>
                    </Select>
                  <FormMessage />
                </FormItem>
              )}
            />


            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={handleClear}>Limpiar Filtros</Button>
                <Button type="submit">Aplicar Filtros</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
