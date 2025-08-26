
"use client";

import * as React from "react";
import type { Cliente } from "@/lib/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Search } from "lucide-react";

type ClientSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: Cliente) => void;
  clients: Cliente[];
};

export function ClientSearchModal({
  isOpen,
  onClose,
  onSelectClient,
  clients,
}: ClientSearchModalProps) {
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredClients = clients.filter(
    (client) =>
      client.razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.rfc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (client: Cliente) => {
    onSelectClient(client);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buscar Cliente</DialogTitle>
          <DialogDescription>
            Selecciona un cliente de la lista.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre, RFC o email..."
              className="w-full rounded-lg bg-background pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <ScrollArea className="h-72">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre / Razón Social</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      {client.razon_social}
                    </TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleSelect(client)}>
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredClients.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center h-24">
                            No se encontraron clientes.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
