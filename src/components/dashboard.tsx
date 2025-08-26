
"use client"

import * as React from "react"
import {
  DollarSign,
  Users,
  CreditCard,
  Package,
  LineChart,
  PieChart,
  Wrench,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart as RechartsPieChart, Cell, ResponsiveContainer } from "recharts"
import type { Venta, Gasto, Cliente, ProductoConStock, OrdenServicio, Marca } from "@/lib/types"
import { subMonths, format } from "date-fns"
import { es } from 'date-fns/locale';

type DashboardProps = {
  ventas: Venta[]
  gastos: Gasto[]
  clientes: Cliente[]
  productos: ProductoConStock[]
  ordenesServicio: OrdenServicio[]
  marcas: Marca[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

export function Dashboard({
  ventas = [],
  gastos = [],
  clientes = [],
  productos = [],
  ordenesServicio = [],
  marcas = []
}: DashboardProps) {

  // --- Procesamiento de Datos para Métricas y Gráficos ---

  // 1. Métricas Clave (KPIs)
  const totalIngresos = ventas.reduce((acc, venta) => acc + venta.total, 0);
  const totalVentas = ventas.length;
  const totalClientes = clientes.length;
  const totalGastos = gastos.reduce((acc, gasto) => acc + gasto.monto, 0);

  // 2. Gráfico de Ventas por Mes (últimos 6 meses)
  const salesData = React.useMemo(() => {
    const monthNames = Array.from({ length: 6 }).map((_, i) => {
        const date = subMonths(new Date(), i);
        return format(date, 'MMM', { locale: es });
    }).reverse();
    
    const monthlySales = monthNames.map(monthName => ({ name: monthName, total: 0 }));

    ventas.forEach(venta => {
        const month = format(new Date(venta.fecha), 'MMM', { locale: es });
        const monthData = monthlySales.find(m => m.name.toLowerCase() === month.toLowerCase());
        if (monthData) {
            monthData.total += venta.total;
        }
    });

    return monthlySales;
  }, [ventas]);

  const salesChartConfig = {
    total: {
      label: "Ventas",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  // 3. Gráfico de Gastos por Categoría
   const expensesData = React.useMemo(() => {
    const expenseMap = new Map<string, number>();
    gastos.forEach(gasto => {
        const currentTotal = expenseMap.get(gasto.categoria) || 0;
        expenseMap.set(gasto.categoria, currentTotal + gasto.monto);
    });
    return Array.from(expenseMap, ([name, value]) => ({ name, value }));
  }, [gastos]);

  const expensesChartConfig = {
    value: {
      label: "Gastos",
    },
    ...expensesData.reduce((acc, expense, index) => {
      acc[expense.name] = {
        label: expense.name,
        color: COLORS[index % COLORS.length]
      }
      return acc
    }, {} as ChartConfig)
  } satisfies ChartConfig
  
  // 4. Ventas Recientes
  const ventasRecientes = ventas.slice(0, 5);

  // 5. Marcas más reparadas
  const repairsByBrandData = React.useMemo(() => {
    const brandCounts = new Map<number, number>();
    ordenesServicio.forEach(order => {
        if (order.marca_id) {
            brandCounts.set(order.marca_id, (brandCounts.get(order.marca_id) || 0) + 1);
        }
    });

    const sortedBrands = Array.from(brandCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5

    return sortedBrands.map(([brandId, count]) => {
        const brand = marcas.find(m => m.id === brandId);
        return {
            name: brand ? brand.nombre : `ID ${brandId}`,
            count,
        };
    });
  }, [ordenesServicio, marcas]);

   const repairsChartConfig = {
    count: {
      label: "Reparaciones",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col gap-4">
      {/* Tarjetas de Métricas Principales (KPIs) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIngresos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Total de ingresos generados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalVentas}</div>
            <p className="text-xs text-muted-foreground">
              Número total de transacciones
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              Total de clientes registrados
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGastos.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground">
              Total de gastos registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Ventas de los Últimos 6 Meses
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={salesChartConfig} className="min-h-[300px] w-full">
                <BarChart accessibilityLayer data={salesData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="name"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="total" fill="var(--color-total)" radius={4} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5"/>
                Gastos por Categoría
            </CardTitle>
            <CardDescription>
                Distribución de los gastos registrados.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
             <ChartContainer
              config={expensesChartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <RechartsPieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={expensesData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  strokeWidth={5}
                >
                   {expensesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                 <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </RechartsPieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Ventas Recientes */}
        <Card className="lg:col-span-4">
            <CardHeader>
            <CardTitle>Ventas Recientes</CardTitle>
            <CardDescription>
                Un vistazo a las últimas 5 transacciones realizadas.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {ventasRecientes.map((venta) => (
                    <TableRow key={venta.id}>
                    <TableCell>
                        <div className="font-medium">{clientes.find(c => c.id === venta.cliente_id)?.razon_social || 'Cliente no encontrado'}</div>
                    </TableCell>
                    <TableCell>{format(new Date(venta.fecha), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="text-right">${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                ))}
                {ventasRecientes.length === 0 && (
                    <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                        No hay ventas recientes.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
            </CardContent>
        </Card>
        
        {/* Marcas más reparadas */}
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Marcas Más Reparadas
                </CardTitle>
                <CardDescription>
                    Top 5 marcas con más órdenes de servicio.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={repairsChartConfig} className="min-h-[250px] w-full">
                    <BarChart layout="vertical" data={repairsByBrandData}>
                        <CartesianGrid horizontal={false} />
                        <YAxis 
                            dataKey="name" 
                            type="category" 
                            tickLine={false} 
                            axisLine={false} 
                            width={80}
                            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <XAxis dataKey="count" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} layout="vertical" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}
