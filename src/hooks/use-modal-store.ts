import { create } from 'zustand';
import type { Rol } from '@/lib/types';

export type ModalType = "addUser" | "editUser" | "assignTool";

interface ModalData {
  roles?: Rol[];
  // Puedes añadir más datos que necesiten otros modales
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));