import { InternalChat } from "@/components/internal-chat";
import { getUsuarios } from "@/lib/data";

export default async function InternalChatPage() {
  const users = await getUsuarios();
  return (
    <InternalChat initialUsers={users} />
  );
}
