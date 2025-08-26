
"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useSession } from "@/components/session-provider";
import { SplashScreen } from "@/components/splash-screen";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signIn, user } = useSession();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSplash, setShowSplash] = React.useState(true);
  
  React.useEffect(() => {
    if (user) {
        // Usar replace para no añadir la página de login al historial
        router.replace("/dashboard");
    }
  }, [user, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await signIn(email, password);

    if (success) {
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "Accediendo al dashboard.",
      });
      // La redirección se manejará automáticamente por el useEffect cuando `user` se actualice.
    } else {
      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: "Las credenciales son incorrectas. Por favor, inténtalo de nuevo.",
      });
      setIsSubmitting(false);
    }
  };

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <Image src="https://hospitaldelmovil.mega-shop-test.shop/shared/logo.png" alt="Logo" width={64} height={64} />
            </div>
            <CardTitle className="text-2xl">Hospital del Móvil</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Iniciar Sesión
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
