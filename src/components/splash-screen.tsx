
"use client";

import * as React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useSession } from "@/hooks/use-session";

type SplashScreenProps = {
  onFinished: () => void;
  durationInSeconds?: number;
  mediaUrl?: string;
  mediaType?: "image" | "video";
};

export function SplashScreen({
  onFinished,
  durationInSeconds = 3, // Reduced duration for better UX
  mediaUrl = "https://hospitaldelmovil.mega-shop-test.shop/shared/logo.png",
  mediaType = "image",
}: SplashScreenProps) {
  const { user, loading } = useSession();
  
  React.useEffect(() => {
    // Wait until the session is loaded before starting the splash timer
    if (!loading) {
      const timer = setTimeout(() => {
        onFinished();
      }, durationInSeconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [durationInSeconds, onFinished, loading]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out`}
    >
      <div className="text-center animate-pulse">
        {mediaType === "video" ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            className="max-w-md max-h-md"
          >
            Tu navegador no soporta el tag de video.
          </video>
        ) : (
          <Image
            src={mediaUrl}
            alt="Splash Screen"
            width={300}
            height={300}
            priority
            className="object-contain"
          />
        )}
      </div>
       <div className="absolute bottom-10 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin"/>
        <span>Cargando sistema...</span>
      </div>
    </div>
  );
}
