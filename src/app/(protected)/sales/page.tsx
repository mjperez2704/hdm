
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuotesManager } from "@/components/quotes-manager";
import { getVentas, getClientes, getProductos, getCoordenada, getPresupuestos } from "@/lib/data";
import { SalesAndQuotesClient } from "@/components/sales-and-quotes-client";

export default async function SalesAndQuotesPage() {
    const clients = await getClientes();
    const sales = await getVentas();
    const products = await getProductos();
    const quotes = await getPresupuestos();
    const coordenadas = await getCoordenada();

    return (
      <Tabs defaultValue="quotes">
        <TabsList className="grid w-full grid-cols-2">

        </TabsList>
          <TabsContent value="quotes">
          <QuotesManager
              clients={clients}
              initialQuotes={quotes}
              products={products}
          />
        </TabsContent>
        <TabsContent value="sales">
          <SalesAndQuotesClient
              clients={clients}
              initialQuotes={quotes}
              products={products}
              coordenadas={coordenadas}
              initialSales={sales}
          />

        </TabsContent>
      </Tabs>




  );
}
