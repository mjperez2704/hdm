import { Users } from "@/components/users";
import { getUsuarios, getRoles } from "@/lib/data";

export default async function UsersPage() {
  const users = await getUsuarios();
  const roles = await getRoles();
  
  return (
    <Users initialUsers={users} availableRoles={roles} />
  );
}
