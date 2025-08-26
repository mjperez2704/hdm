"use client";

import { useEffect, useState } from "react";
import { DynamicModal } from "./dynamic-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <DynamicModal />;
};