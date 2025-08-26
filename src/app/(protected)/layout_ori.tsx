


import {
  Briefcase,
  Calculator,
  LayoutDashboard,
  LogOut,
  Package,
  PanelLeft,
  Settings,
  ShoppingCart,
  Users,
  Wrench,
  Warehouse,
  Truck,
  FileText,
  LineChart,
  UsersRound,
  Megaphone,
  User,
  Shield,
  Book,
  Contact,
  Building,
  FileCog,
  Landmark,
  Home,
  Menu,
  HeartHandshake,
  ArrowRightLeft,
  FileArchive,
  BookUser,
  BadgePercent,
  MessageSquare,
  ClipboardList,
  Fingerprint,
  Palette,
  Building2,
  BookLock,
  BookText,
  Gavel,
  Clipboard,
  BookHeadphones,
  MessagesSquare,
  Database,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { NavLink } from "@/components/nav-link";

const NavMenu = () => (
    <Accordion type="multiple" className="w-full" defaultValue={["seguridad", "catalogos", "contactos", "operaciones", "inventario", "administracion", "crm", "reportes", "comunicacion", "configuraciones"]}>
      <AccordionItem value="seguridad">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5" />
            <span>Seguridad</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/users">
              <User className="h-4 w-4" /> Usuarios
            </NavLink>
            <NavLink href="/roles">
              <Fingerprint className="h-4 w-4" /> Roles y Permisos
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="catalogos">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Book className="h-5 w-5" />
            <span>Catálogos</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/catalogs/products">
              <Package className="h-4 w-4" /> Productos
            </NavLink>
            <NavLink href="/catalogs/brands">
              <BadgePercent className="h-4 w-4" /> Marcas y Modelos
            </NavLink>
            <NavLink href="/catalogs/tools">
              <Wrench className="h-4 w-4" /> Herramientas
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="contactos">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Contact className="h-5 w-5" />
            <span>Contactos</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/customers">
              <Users className="h-4 w-4" /> Clientes
            </NavLink>
            <NavLink href="/providers">
              <Truck className="h-4 w-4" /> Proveedores
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="operaciones">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5" />
            <span>Operaciones</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/sales">
              <Briefcase className="h-4 w-4" /> Ventas y Presupuestos
            </NavLink>
            <NavLink href="/purchases">
              <ShoppingCart className="h-4 w-4" /> Compras
            </NavLink>
            <NavLink href="/repairs">
              <Wrench className="h-4 w-4" /> Reparaciones
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="inventario">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Warehouse className="h-5 w-5" />
            <span>Inventario</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/inventory">
              <Package className="h-4 w-4" /> Inventario General
            </NavLink>
            <NavLink href="/warehouse">
              <Home className="h-4 w-4" /> Gestión de Almacén
            </NavLink>
            <NavLink href="/transfers">
              <ArrowRightLeft className="h-4 w-4" /> Traslados
            </NavLink>
            <NavLink href="/adjustments">
              <FileCog className="h-4 w-4" /> Ajustes
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="administracion">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5" />
            <span>Administración</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/employees">
              <BookUser className="h-4 w-4" /> Empleados
            </NavLink>
            <NavLink href="/vendedores">
              <UsersRound className="h-4 w-4" /> Vendedores
            </NavLink>
            <NavLink href="/billing">
              <FileText className="h-4 w-4" /> Facturación
            </NavLink>
            <NavLink href="/finances/expenses">
              <Calculator className="h-4 w-4" /> Gastos
            </NavLink>
            <NavLink href="/finances/cxc">
              <FileArchive className="h-4 w-4" /> Cuentas por Cobrar
            </NavLink>
            <NavLink href="/finances/cxp">
              <FileArchive className="h-4 w-4" /> Cuentas por Pagar
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="crm">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <HeartHandshake className="h-5 w-5" />
            <span>CRM</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/crm/opportunities">
              <Briefcase className="h-4 w-4" /> Oportunidades
            </NavLink>
            <NavLink href="/crm/marketing">
              <Megaphone className="h-4 w-4" /> Marketing
            </NavLink>
            <NavLink href="/crm/support">
              <MessageSquare className="h-4 w-4" /> Soporte y Quejas
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="reportes">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <LineChart className="h-5 w-5" />
            <span>Reportes</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
            <NavLink href="/reports/predetermined">
              <FileText className="h-4 w-4" /> Predeterminados
            </NavLink>
            <NavLink href="/reports/custom">
              <FileCog className="h-4 w-4" /> Personalizados
            </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="comunicacion">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
              <Building className="h-5 w-5" />
              <span>Comunicación</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
              <NavLink href="/internal/log">
                  <ClipboardList className="h-4 w-4" /> Bitácora
              </NavLink>
              <NavLink href="/internal/requests">
                  <MessageSquare className="h-4 w-4" /> Solicitudes
              </NavLink>
              <NavLink href="/internal/chat">
                  <MessagesSquare className="h-4 w-4" /> Chat Interno
              </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>
      
      <AccordionItem value="configuraciones">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              <span>Configuraciones</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-4">
          <nav className="grid items-start gap-1">
              <NavLink href="/settings/appearance">
                  <Palette className="h-4 w-4" /> Apariencia
              </NavLink>
              <NavLink href="/settings/company">
                  <Building2 className="h-4 w-4" /> Datos Empresa
              </NavLink>
               <NavLink href="/settings/database">
                  <Database className="h-4 w-4" /> Base de Datos
              </NavLink>
              <NavLink href="/settings/privacy">
                  <BookLock className="h-4 w-4" /> Aviso de Privacidad
              </NavLink>
              <NavLink href="/settings/policies">
                  <BookText className="h-4 w-4" /> Políticas y Reglamentos
              </NavLink>
              <NavLink href="/settings/rules">
                  <Gavel className="h-4 w-4" /> Reglas de Negocio
              </NavLink>
              <NavLink href="/settings/formats">
                  <Clipboard className="h-4 w-4" /> Formatos
              </NavLink>
              <NavLink href="/settings/manuals">
                  <BookHeadphones className="h-4 w-4" /> Manuales
              </NavLink>
          </nav>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
);


export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 items-center gap-2 border-b px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image src="https://hospitaldelmovil.mega-shop-test.shop/shared/logo.png" alt="Logo" width={32} height={32} />
                <span className="text-lg">Hospital del Móvil</span>
            </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                <NavLink href="/dashboard">
                    <LayoutDashboard className="h-5 w-5" /> Dashboard
                </NavLink>
                <NavMenu />
            </nav>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <div className="flex h-16 items-center gap-2 border-b px-4">
                  <Link href="/" className="flex items-center gap-2 font-semibold">
                      <Image src="https://hospitaldelmovil.mega-shop-test.shop/shared/logo.png" alt="Logo" width={24} height={24} />
                      <span className="">Hospital del Móvil</span>
                  </Link>
              </div>
              <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <NavLink href="/dashboard">
                      <LayoutDashboard className="h-5 w-5" /> Dashboard
                  </NavLink>
                  <NavMenu />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            {/* Title can go here if needed */}
          </div>
          <UserAvatar />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
