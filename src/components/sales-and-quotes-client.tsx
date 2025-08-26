"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sales } from "@/components/sales";
import { QuotesManager } from "@/components/quotes-manager";
import type {
    Venta,
    Cliente,
    Producto,
    Coordenada,
    Presupuesto,
} from "@/lib/types";

type SalesAndQuotesClientProps = {
    initialSales: Venta[];
    initialQuotes: Presupuesto[];
    clients: Cliente[];
    products: Producto[];
    coordenadas: Coordenada[];
};

export function SalesAndQuotesClient({
                                         initialSales,
                                         initialQuotes,
                                         clients,
                                         products,
                                         coordenadas,
                                     }: SalesAndQuotesClientProps) {
    return (
        <Tabs defaultValue="quotes">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quotes">Presupuestos</TabsTrigger>
                <TabsTrigger value="sales">Ventas</TabsTrigger>
            </TabsList>
            <TabsContent value="quotes">
                <QuotesManager initialQuotes={initialQuotes} clients={clients} products={products} />
            </TabsContent>
            <TabsContent value="sales">
                <Sales initialSales={initialSales} clients={clients} products={products} coordenadas={coordenadas} />
            </TabsContent>
        </Tabs>
    );
}
