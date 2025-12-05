import { useEffect, useState } from "react";
import axios from "axios";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

function EditModal({ open, onClose, user, onSave }: any) {
  if (!open) return null;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 99999,
      }}
    >
      <div
        style={{
          width: "400px",
          background: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "16px" }}>
          Editar Usuário
        </h2>

        <div className="flex flex-col gap-3">
          <Input
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />

          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={onClose}
              style={{
                backgroundColor: "#aaa",
                color: "white",
                borderRadius: "6px",
              }}
            >
              Cancelar
            </Button>

            <Button
              onClick={() =>
                onSave({
                  id: user._id.toString(), // CORRIGIDO!!!
                  name,
                  email,
                })
              }
              style={{
                backgroundColor: "#2ca1ae",
                color: "white",
                borderRadius: "6px",
              }}
            >
              Salvar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<any>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await axios.get("http://localhost:3000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
      });
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Deseja realmente remover este usuário?")) return;

    try {
      await axios.delete(`http://localhost:3000/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(users.filter((u) => u._id !== id));

      toast({
        title: "Usuário removido",
        description: "A remoção foi concluída.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao remover usuário",
      });
    }
  }

  async function saveUser(updated: any) {
    try {
      await axios.patch(
        `http://localhost:3000/users/${updated.id}`,
        {
          name: updated.name,
          email: updated.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((u) => (u._id === updated.id ? { ...u, ...updated } : u)));

      toast({
        title: "Usuário atualizado",
        description: "As alterações foram salvas.",
      });

      setEditingUser(null);
    } catch (err: any) {

      const backendMessage =
        err.response?.data?.message ||
        "Erro inesperado ao salvar alterações.";

      toast({
        variant: "destructive",
        title: "Erro ao salvar alterações",
        description: backendMessage,
      });

    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-4">Usuários</h1>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell className="flex gap-3">
                  <Button
                    onClick={() => setEditingUser(u)}
                    style={{
                      backgroundColor: "#2ca1ae",
                      color: "white",
                      borderRadius: "6px",
                      padding: "4px 12px",
                    }}
                  >
                    Editar
                  </Button>

                  <Button
                    onClick={() => deleteUser(u._id)}
                    style={{
                      backgroundColor: "#c0392b",
                      color: "white",
                      borderRadius: "6px",
                      padding: "4px 12px",
                    }}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <EditModal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSave={saveUser}
      />
    </DashboardLayout>
  );
}
