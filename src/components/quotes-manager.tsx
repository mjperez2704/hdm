
"use client";

import * as React from "react";
import type { Presupuesto, Cliente, Producto } from "@/lib/types";
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
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, File, Search, Eye, FileEdit, CheckCircle } from "lucide-react";
import { Input } from "./ui/input";
import { QuoteFormModal } from "./quote-form-modal";
import { QuoteDetailModal } from "./quote-detail-modal";
import { useToast } from "@/hooks/use-toast";

type QuotesManagerProps = {
  initialQuotes: Presupuesto[];
  clients: Cliente[];
  products: Producto[];
};

export function QuotesManager({
  initialQuotes,
  clients,
  products,
}: QuotesManagerProps) {
  const { toast } = useToast();
  const [quotes, setQuotes] = React.useState(initialQuotes);
  const [filteredQuotes, setFilteredQuotes] = React.useState(initialQuotes);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [selectedQuote, setSelectedQuote] = React.useState<Presupuesto | null>(null);

  const getClientName = (clientId: number) => {
    return clients.find((c) => c.id === clientId)?.razon_social || "N/A";
  };

  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = quotes.filter(
      (item) =>
        item.folio.toLowerCase().includes(lowercasedFilter) ||
        getClientName(item.cliente_id).toLowerCase().includes(lowercasedFilter)
    );
    setFilteredQuotes(filteredData);
  }, [searchTerm, quotes, clients]);

  const handleSaveQuote = (values: any, quoteId?: number) => {
    if (quoteId) {
       // Logic to edit an existing quote
       setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, ...values, id: quoteId, cliente_id: Number(values.clientId), folio: q.folio, fecha: q.fecha } : q));
       toast({
         title: "Presupuesto Actualizado",
         description: `El presupuesto con folio ${values.folio} ha sido actualizado.`,
       });
    } else {
      // Logic to add a new quote
      const newQuote: Presupuesto = {
        id: Math.max(...quotes.map((s) => s.id), 0) + 1,
        folio: `PRE-2024-${String(
          Math.max(...quotes.map((s) => s.id), 0) + 2
        ).padStart(4, "0")}`,
        fecha: new Date().toISOString(),
        fecha_vencimiento: values.fecha_vencimiento.toISOString(),
        cliente_id: Number(values.clientId),
        estado: "BORRADOR",
        total: values.items.reduce(
          (acc: number, item: any) => acc + (item.quantity || 0) * (item.price || 0) - (values.discount || 0),
          0
        ),
        items: values.items,
        observaciones: values.observaciones,
        descuento_concepto: values.discountConcept,
        descuento_monto: values.discount,
      };
      setQuotes((prev) => [newQuote, ...prev]);
      toast({
        title: "Presupuesto Creado",
        description: `El presupuesto con folio ${newQuote.folio} ha sido guardado.`,
      });
    }
    setIsFormModalOpen(false);
    setSelectedQuote(null);
  };
  
  const handleExport = () => {
    toast({
      title: "Exportación Iniciada",
      description: "Se está generando la lista de presupuestos (simulado).",
    });
  };

  const handleOpenFormModal = (quote: Presupuesto | null) => {
    setSelectedQuote(quote);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailModal = (quote: Presupuesto) => {
    setSelectedQuote(quote);
    setIsDetailModalOpen(true);
  };
  
  const handleConvertToSale = (quote: Presupuesto) => {
    toast({
        title: "Funcionalidad en Desarrollo",
        description: `La conversión a venta para el presupuesto ${quote.folio} estará disponible próximamente.`
    })
  }

  const statusVariant: Record<
    Presupuesto["estado"],
    "default" | "secondary" | "destructive" | "outline"
  > = {
    BORRADOR: "outline",
    ENVIADO: "secondary",
    ACEPTADO: "default",
    RECHAZADO: "destructive",
    VENCIDO: "destructive",
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <CardTitle>Gestión de Presupuestos</CardTitle>
              <CardDescription>
                Crea, envía y gestiona los presupuestos para tus clientes.
              </CardDescription>
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" className="h-9 gap-1" onClick={handleExport}>
                <File className="h-4 w-4" />
                Exportar
              </Button>
              <Button size="sm" className="h-9 gap-1" onClick={() => handleOpenFormModal(null)}>
                <PlusCircle className="h-4 w-4" />
                Crear Presupuesto
              </Button>
            </div>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por folio o cliente..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Folio</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.map((quote) => (
                <TableRow key={quote.id}>
                  <TableCell className="font-medium">{quote.folio}</TableCell>
                  <TableCell>{getClientName(quote.cliente_id)}</TableCell>
                  <TableCell>
                    {new Date(quote.fecha).toLocaleDateString()}
                  </TableCell>
                   <TableCell>
                    {quote.fecha_vencimiento ? new Date(quote.fecha_vencimiento).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[quote.estado]}>
                      {quote.estado}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${quote.total.toFixed(2)}
                  </TableCell>
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
                        <DropdownMenuItem onClick={() => handleOpenDetailModal(quote)}>
                            <Eye className="mr-2 h-4 w-4"/>Ver Detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenFormModal(quote)}>
                            <FileEdit className="mr-2 h-4 w-4"/>Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleConvertToSale(quote)}>
                            <CheckCircle className="mr-2 h-4 w-4"/>Convertir a Venta
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredQuotes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No se encontraron presupuestos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <QuoteFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
            setIsFormModalOpen(false);
            setSelectedQuote(null);
        }}
        onSave={handleSaveQuote}
        clients={clients}
        products={products}
        quote={selectedQuote}
      />

      {selectedQuote && (
        <QuoteDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          quote={selectedQuote}
          clientName={getClientName(selectedQuote.cliente_id)}
        />
      )}
    </>
  );
}
