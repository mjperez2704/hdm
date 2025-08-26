
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
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Cliente } from "@/lib/types";
import { CustomerFormModal } from "./customer-form-modal";
import { useToast } from "@/hooks/use-toast";
import { deleteCustomer } from "@/lib/actions";

export function Customers({ initialCustomers }: { initialCustomers: Cliente[] }) {
  const { toast } = useToast();
  // No necesitamos un estado local para los clientes, Next.js lo actualizará con revalidatePath
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Cliente | null>(null);

  const handleOpenModal = (customer: Cliente | null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  };

  // La acción de guardado ahora está en el formulario y llama a la Server Action

  const handleDeleteCustomer = async (customerId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.")) {
        const result = await deleteCustomer(customerId);
        if (result.success) {
            toast({
                title: "Cliente Eliminado",
                description: result.message,
            });
        } else {
             toast({
                variant: "destructive",
                title: "Error al Eliminar",
                description: result.message,
            });
        }
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Administra tu lista de clientes desde la base de datos.
              </CardDescription>
            </div>
            <Button onClick={() => handleOpenModal(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Cliente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Razón Social</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>RFC</TableHead>
                <TableHead>Fecha de Registro</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.razon_social}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.telefono}</TableCell>
                  <TableCell>{customer.rfc}</TableCell>
                  <TableCell>{new Date(customer.fecha_registro).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenModal(customer)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteCustomer(customer.id)}>
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {initialCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron clientes en la base de datos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CustomerFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={selectedCustomer}
      />
    </>
  );
}
