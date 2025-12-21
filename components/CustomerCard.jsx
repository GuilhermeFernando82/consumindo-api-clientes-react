import { Pencil, Trash2, Save } from "lucide-react";
import api from "./api";
import axios from "axios";
import styles from "../styles/customerForm.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export default function CustomerCard({ user, reload, setMessage, setIsError }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ ...user });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      const response = await api.put(`/id?id=${user.id}`, data);
      console.log(user);

      setEditing(false);
      reload();

      setMessage("Cliente atualizado com sucesso!");
      setIsError(false);
    } catch {
      setMessage("Erro ao atualizar cliente.");
      setIsError(true);
    }
  };

  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    setData((prev) => ({ ...prev, cep: e.target.value }));

    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (response.data.erro) {
          setMessage("CEP não encontrado.");
          setIsError(true);
          return;
        }

        setData((prev) => ({
          ...prev,
          publicPlace: response.data.logradouro || "",
          neighborhood: response.data.bairro || "",
          city: response.data.localidade || "",
          state: response.data.uf || "",
        }));

        setMessage("Endereço preenchido automaticamente!");
        setIsError(false);
      } catch {
        setMessage("Erro ao consultar o CEP.");
        setIsError(true);
      }
    }
  };
  const del = async () => {
    if (!confirm("Deseja realmente deletar este usuário?")) return;
    try {
      const response = await api.delete(`/id?id=${user.id}`);
      setMessage(response.data);
      reload();
    } catch {
      setMessage("Erro ao deletar cliente.");
      setIsError(true);
    }
  };

  return (
    <div className={styles.userCard}>
      {editing ? (
        <>
          {Object.keys(data)
            .filter((field) => field !== "id") // 👈 remove o id
            .map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.toUpperCase()}
                value={data[field]}
                onChange={field === "cep" ? handleCepChange : handleChange}
                className={styles.inputField}
              />
            ))}

          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={save}
          >
            <Save size={16} /> Salvar
          </button>
        </>
      ) : (
        <>
          <p>
            <strong>ID:</strong> {data.id}
          </p>
          <p>
            <strong>Nome:</strong> {data.name}
          </p>
          <p>
            <strong>CPF:</strong> {data.cpf}
          </p>
          <p>
            <strong>CEP:</strong> {data.cep}
          </p>
          <p>
            <strong>Endereço:</strong> {data.publicPlace} - {data.neighborhood}
          </p>
          <p>
            <strong>Cidade:</strong> {data.city}/{data.state}
          </p>

          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => setEditing(true)}
          >
            <Pencil size={16} /> Editar
          </button>
          <button
            className={`${styles.button} ${styles.deleteButton}`}
            onClick={del}
          >
            <Trash2 size={16} /> Deletar
          </button>
        </>
      )}
    </div>
  );
}
