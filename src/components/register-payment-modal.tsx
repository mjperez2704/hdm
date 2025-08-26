
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import type { CuentaPorCobrar, CuentaPorPagar } from "@/lib/types";

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

const formSchema = z.object({
    amount: z.coerce.number().positive("El monto debe ser mayor a cero."),
    paymentMethod: z.string().min(1, "El método de pago es requerido."),
});

type RegisterPaymentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (amount: number) => void;
    accountType: "cobrar" | "pagar";
    account: CuentaPorCobrar | CuentaPorPagar;
    entityName: string;
};

export function RegisterPaymentModal({
                                         isOpen,
                                         onClose,
                                         onSave,
                                         account,
                                         accountType,
                                         entityName
                                     }: RegisterPaymentModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: account.saldo,
        },
    });

    React.useEffect(() => {
        form.setValue("amount", account.saldo);
    }, [account, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        if (values.amount > account.saldo) {
            form.setError("amount", {
                type: "manual",
                message: "El pago no puede ser mayor al saldo pendiente.",
            });
            return;
        }
        onSave(values.amount);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Registrar Pago</DialogTitle>
    <DialogDescription>
    Registrando un pago a {accountType === 'cobrar' ? 'favor' : 'cargo'} de <strong>{entityName}</strong>. <br/>
    Saldo pendiente: <span className="font-bold">${account.saldo.toFixed(2)}</span>
    </DialogDescription>
    </DialogHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
    <FormField
        control={form.control}
    name="amount"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Monto a Pagar</FormLabel>
    <FormControl>
    <Input type="number" step="0.01" {...field} />
    </FormControl>
    <FormMessage />
    </FormItem>
)}
    />
    <FormField
    control={form.control}
    name="paymentMethod"
    render={({ field }) => (
        <FormItem>
            <FormLabel>Método de Pago</FormLabel>
    <Select onValueChange={field.onChange} defaultValue={field.value}>
    <FormControl>
        <SelectTrigger>
            <SelectValue placeholder="Seleccione un método" />
    </SelectTrigger>
    </FormControl>
    <SelectContent>
    <SelectItem value="EFECTIVO">Efectivo</SelectItem>
        <SelectItem value="TARJETA">Tarjeta</SelectItem>
        <SelectItem value="TRANSFERENCIA">Transferencia</SelectItem>
        <SelectItem value="OTRO">Otro</SelectItem>
        </SelectContent>
        </Select>
        <FormMessage />
        </FormItem>
)}
    />
    <DialogFooter className="pt-4 border-t">
    <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Confirmar Pago</Button>
    </DialogFooter>
    </form>
    </Form>
    </DialogContent>
    </Dialog>
);
}
