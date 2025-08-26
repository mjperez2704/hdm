
"use client";

import * as React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    ListFilter,
    File,
    DollarSign,
} from "lucide-react";
import type { CuentaPorPagar, Proveedor } from "@/lib/types";
import { Badge } from "./ui/badge";
import { useToast } from "@/hooks/use-toast";
import { RegisterPaymentModal } from "./register-payment-modal";
import { format, differenceInDays, parseISO } from "date-fns";

type CxpManagerProps = {
    initialAccounts: CuentaPorPagar[];
    providers: Proveedor[];
};

export function CxpManager({ initialAccounts, providers }: CxpManagerProps) {
    const { toast } = useToast();
    const [accounts, setAccounts] = React.useState(initialAccounts);
    const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
    const [selectedAccount, setSelectedAccount] =
        React.useState<CuentaPorPagar | null>(null);

    const getProviderName = (providerId: number) => {
        return providers.find((p) => p.id === providerId)?.razon_social || "N/A";
    };

    const handleOpenPaymentModal = (account: CuentaPorPagar) => {
        setSelectedAccount(account);
        setPaymentModalOpen(true);
    }

    const handleRegisterPayment = (amount: number) => {
        if (!selectedAccount) return;

        // Simulate payment logic
        const newSaldo = selectedAccount.saldo - amount;
        const newStatus = newSaldo <= 0 ? "CERRADA" : "PARCIAL";

        setAccounts(prev => prev.map(acc =>
            acc.id === selectedAccount.id ? {...acc, saldo: newSaldo, estado: newStatus } : acc
        ));

        toast({
            title: "Pago Registrado",
            description: `Se registró un pago de $${amount.toFixed(2)} para la factura de ${getProviderName(selectedAccount.proveedor_id)}.`
        });
        setPaymentModalOpen(false);
    }

    const getDaysOverdue = (dueDate: string) => {
        const days = differenceInDays(new Date(), parseISO(dueDate));
        return days > 0 ? days : 0;
    }

    const statusVariant: Record<
        CuentaPorPagar["estado"],
        "default" | "secondary" | "destructive" | "outline"
    > = {
        ABIERTA: "secondary",
        PARCIAL: "outline",
        CERRADA: "default",
        VENCIDA: "destructive",
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle>Cuentas por Pagar (CXP)</CardTitle>
                            <CardDescription>
                                Gestiona las facturas y deudas pendientes con tus proveedores.
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-9 gap-1">
                                <ListFilter className="h-4 w-4" /> Filtrar
                            </Button>
                            <Button variant="outline" className="h-9 gap-1">
                                <File className="h-4 w-4" /> Exportar
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Proveedor</TableHead>
                                <TableHead>Compra</TableHead>
                                <TableHead>Fecha Venc.</TableHead>
                                <TableHead>Días Vencida</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Saldo Pendiente</TableHead>
                                <TableHead>
                                    <span className="sr-only">Acciones</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accounts.map((account) => (
                                <TableRow key={account.id}>
                                    <TableCell className="font-medium">
                                        {getProviderName(account.proveedor_id)}
                                    </TableCell>
                                    <TableCell>OC-{account.orden_compra_id}</TableCell>
                                    <TableCell>{format(parseISO(account.fecha_venc), 'dd/MM/yyyy')}</TableCell>
                                    <TableCell className="text-center">
                                        {getDaysOverdue(account.fecha_venc) > 0 ? (
                                            <Badge variant="destructive">{getDaysOverdue(account.fecha_venc)}</Badge>
                                        ) : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[account.estado]}>{account.estado}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        ${account.saldo.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => handleOpenPaymentModal(account)} disabled={account.estado === 'CERRADA'}>
                                                    <DollarSign className="mr-2 h-4 w-4" /> Registrar Pago
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>Ver Orden de Compra</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {accounts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No hay cuentas por pagar pendientes.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedAccount && (
                <RegisterPaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    onSave={handleRegisterPayment}
                    accountType="pagar"
                    account={selectedAccount}
                    entityName={getProviderName(selectedAccount.proveedor_id)}
                />
            )}
        </>
    );
}
