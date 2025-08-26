
"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { saveDatabaseSettings, testNewDatabaseConnection } from "@/app/actions";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Loader2, Server, Save, PlugZap } from "lucide-react";
import { Label } from "./ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <Loader2 className="animate-spin mr-2" />
      ) : (
        <Save className="mr-2 h-4 w-4" />
      )}
      Guardar Cambios
    </Button>
  );
}

export function DatabaseSettingsForm() {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isTesting, setIsTesting] = React.useState(false);

  // Estados para mantener los valores actuales del formulario
  const [dbHost, setDbHost] = React.useState(process.env.NEXT_PUBLIC_DB_HOST || '');
  const [dbUser, setDbUser] = React.useState(process.env.NEXT_PUBLIC_DB_USER || '');
  const [dbName, setDbName] = React.useState(process.env.NEXT_PUBLIC_DB_NAME || '');
  const [dbPort, setDbPort] = React.useState(process.env.NEXT_PUBLIC_DB_PORT || '3306');
  const [dbPassword, setDbPassword] = React.useState('');

  const handleTestConnection = async () => {
    if (!formRef.current) return;
    setIsTesting(true);
    const formData = new FormData(formRef.current);
    const result = await testNewDatabaseConnection(formData);
    setIsTesting(false);

    toast({
      title: result.success ? "Conexión Exitosa" : "Fallo en la Conexión",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
  };
  
  const handleSave = async (formData: FormData) => {
    const result = await saveDatabaseSettings(formData);
     if (result.success) {
        toast({
          title: "Configuración Guardada",
          description: result.message,
        });
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error al Guardar",
          description: result.message,
        });
      }
  };


  return (
    <form ref={formRef} action={handleSave}>
      <Card>
        <CardHeader>
          <CardTitle>Credenciales de Conexión</CardTitle>
          <Alert variant="destructive">
            <Server className="h-4 w-4" />
            <AlertTitle>Advertencia de Seguridad</AlertTitle>
            <AlertDescription>
              Guardar estos cambios reescribirá el archivo `.env` del servidor. La aplicación podría requerir un reinicio para aplicar los nuevos ajustes.
            </AlertDescription>
          </Alert>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="DB_HOST">Host</Label>
            <Input id="DB_HOST" name="DB_HOST" placeholder="ej. 127.0.0.1 o la IP de su servidor" value={dbHost} onChange={(e) => setDbHost(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="DB_USER">Usuario</Label>
              <Input id="DB_USER" name="DB_USER" placeholder="ej. admin" value={dbUser} onChange={(e) => setDbUser(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="DB_DATABASE">Nombre de la Base de Datos</Label>
              <Input id="DB_DATABASE" name="DB_DATABASE" placeholder="ej. mi_tienda_db" value={dbName} onChange={(e) => setDbName(e.target.value)} required/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="DB_PASSWORD">Contraseña</Label>
              <Input id="DB_PASSWORD" name="DB_PASSWORD" type="password" placeholder="Dejar en blanco para no cambiar" value={dbPassword} onChange={(e) => setDbPassword(e.target.value)}/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="DB_PORT">Puerto</Label>
              <Input id="DB_PORT" name="DB_PORT" type="number" placeholder="3306" value={dbPort} onChange={(e) => setDbPort(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                 {isTesting ? <Loader2 className="animate-spin mr-2" /> : <PlugZap className="mr-2 h-4 w-4" />}
                Probar Conexión
            </Button>
            <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
