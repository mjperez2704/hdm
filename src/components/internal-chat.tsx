
"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Send } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { Usuario } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Message {
  id: string;
  text: string;
  createdAt: Timestamp;
  userId: string;
  userEmail: string;
  userAvatar?: string;
}

export function InternalChat({ initialUsers }: { initialUsers: Usuario[] }) {
  const { user } = useSession();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState("");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const q = query(collection(db, "chat"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  React.useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !user) return;

    await addDoc(collection(db, "chat"), {
      text: newMessage,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userEmail: user.email,
      userAvatar: user.photoURL,
    });

    setNewMessage("");
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return "?";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="h-[calc(100vh-100px)] flex flex-col">
      <CardHeader>
        <CardTitle>Chat Interno</CardTitle>
        <CardDescription>
          Comunícate con otros miembros del equipo en tiempo real.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.userId === user?.uid ? "justify-end" : ""
                }`}
              >
                {msg.userId !== user?.uid && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.userAvatar} />
                    <AvatarFallback>
                      {getInitials(msg.userEmail)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-sm ${
                    msg.userId === user?.uid
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.userEmail}</p>
                  <p className="text-base">{msg.text}</p>
                  <p className="text-xs opacity-75 mt-1 text-right">
                    {msg.createdAt &&
                      formatDistanceToNow(msg.createdAt.toDate(), {
                        addSuffix: true,
                        locale: es,
                      })}
                  </p>
                </div>
                 {msg.userId === user?.uid && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={msg.userAvatar} />
                    <AvatarFallback>
                      {getInitials(msg.userEmail)}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No hay mensajes todavía. ¡Sé el primero en saludar!</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            autoComplete="off"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
