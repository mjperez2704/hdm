
"use client";

import * as React from "react";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Bot,
  Trash2,
  Search,
  Package2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Producto, Proveedor, Marca, ProductoConStock, SolicitudInterna } from "@/lib/types";
import { AiSuggestionDialog } from "./ai-suggestion-dialog";
import { ProductFormModal } from "./product-form-modal";
import { RequestBajaModal } from "./request-baja-modal";
import { useToast } from "@/hooks/use-toast";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";

export function ProductCatalog({
  initialProducts,
  providers,
  brands
}: {
  initialProducts: ProductoConStock[];
  providers: Proveedor[];
  brands: Marca[];
}) {
  const { toast } = useToast();
  const [products, setProducts] = React.useState<ProductoConStock[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = React.useState<ProductoConStock[]>(initialProducts);
  const [searchTerm, setSearchTerm] = React.useState("");

  const [selectedItemForAI, setSelectedItemForAI] = React.useState<Producto | null>(null);
  const [isAIDialogOpen, setAIDialogOpen] = React.useState(false);
  const [isProductModalOpen, setProductModalOpen] = React.useState(false);
  const [isBajaModalOpen, setBajaModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Producto | null>(null);

  React.useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = products.filter(item => {
      return (
        item.nombre.toLowerCase().includes(lowercasedFilter) ||
        item.sku.toLowerCase().includes(lowercasedFilter)
      );
    });
    setFilteredProducts(filteredData);
  }, [searchTerm, products]);

  const handleOpenAISuggestion = (item: Producto) => {
    const itemWithStock: ProductoConStock = { ...item, stock: (item as ProductoConStock).stock || 0 };
    setSelectedItemForAI(itemWithStock);
    setAIDialogOpen(true);
  }
  
  const handleSaveProduct = (values: any) => {
    console.log("Saving product:", values);
    setProductModalOpen(false);
    setSelectedProduct(null);
  }
  
  const handleRequestBaja = (values: { motivo: string }) => {
    console.log("Requesting baja for product:", selectedProduct?.id, "Reason:", values.motivo);
    
    const newRequest: SolicitudInterna = {
        id: Math.floor(Math.random() * 10000),
        folio: `SOL-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        solicitante_id: 1, 
        fecha_solicitud: new Date().toISOString(),
        tipo: 'BAJA_PRODUCTO',
        descripcion: `Solicitud de baja para SKU: ${selectedProduct?.sku} (${selectedProduct?.nombre}). Motivo: ${values.motivo}`,
        estado: 'PENDIENTE',
        monto: selectedProduct?.costo_promedio,
    };
    
    console.log("Nueva solicitud interna creada:", newRequest);
    
    toast({
      title: "Solicitud de Baja Enviada",
      description: "Tu solicitud ha sido enviada para aprobación.",
    });

    setBajaModalOpen(false);
  }

  const handleOpenProductModal = (product: Producto | null) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  }
  
  const handleOpenBajaModal = (product: Producto) => {
    setSelectedProduct(product);
    setBajaModalOpen(true);
  }
  
  const handleExport = () => {
    toast({
      title: "Exportación Iniciada",
      description: "Se está generando el catálogo de productos (simulado).",
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
            <div>
              <CardTitle>Catálogo de Productos</CardTitle>
              <CardDescription>
                Administra todos los productos, servicios y artículos del sistema.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 gap-1" onClick={() => alert('La funcionalidad de filtros avanzados estará disponible pronto.')}>
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filtrar
                    </span>
                </Button>
                <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleExport}>
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Exportar
                    </span>
                </Button>
                <Button size="sm" className="h-7 gap-1" onClick={() => handleOpenProductModal(null)}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Agregar Producto
                    </span>
                </Button>
            </div>
          </div>
           <div className="relative mt-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre o SKU..."
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
                <TableHead>SKU</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Existencia</TableHead>
                <TableHead>Backorder</TableHead>
                <TableHead className="text-right">Precio de Lista</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                     <Button variant="link" className="p-0 h-auto font-medium" onClick={() => handleOpenProductModal(item)}>
                        {item.sku}
                    </Button>
                  </TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>
                    <Badge variant={item.stock > 0 ? "default" : "destructive"}>
                      {item.stock} {item.unidad}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.backorder && item.backorder > 0 ? "secondary" : "outline"}>
                      {item.backorder || 0} {item.unidad}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">${item.precio_lista.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenProductModal(item)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleOpenAISuggestion(item)}>
                          <Bot className="mr-2 h-4 w-4" />
                          Sugerencia de Stock (IA)
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleOpenBajaModal(item)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Solicitar Baja
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No se encontraron productos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Mostrando <strong>1-{filteredProducts.length}</strong> de{" "}
            <strong>{products.length}</strong> productos
          </div>
        </CardFooter>
      </Card>

      <ProductFormModal
        isOpen={isProductModalOpen}
        onClose={() => {
            setProductModalOpen(false);
            setSelectedProduct(null);
        }}
        onSave={handleSaveProduct}
        providers={providers}
        brands={brands}
        product={selectedProduct}
      />

       {selectedItemForAI && (
        <AiSuggestionDialog
          item={selectedItemForAI}
          open={isAIDialogOpen}
          onOpenChange={setAIDialogOpen}
        />
      )}
      
      {selectedProduct && (
        <RequestBajaModal
            isOpen={isBajaModalOpen}
            onClose={() => setBajaModalOpen(false)}
            onSave={handleRequestBaja}
            product={selectedProduct}
        />
      )}
    </>
  );
}
