import {
  Pencil,
  Trash2,
  Save,
  X,
  MapPin,
  User,
  IdentificationCard,
} from "lucide-react";
import api from "./api";
import axios from "axios";
import styles from "../styles/card.module.css"; // Usando o novo CSS global do dashboard
import { useState } from "react";

export default function CustomerCard({ user, reload, setMessage, setIsError }) {
  const [editing, setEditing] = useState(false);
  const [data, setData] = useState({ ...user });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const save = async () => {
    try {
      await api.put(`/Customers/id?id=${user.id}`, data);
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
    const cepValue = e.target.value;
    const cleanCep = cepValue.replace(/\D/g, "");
    setData((prev) => ({ ...prev, cep: cepValue }));

    if (cleanCep.length === 8) {
      try {
        const response = await axios.get(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        if (!response.data.erro) {
          setData((prev) => ({
            ...prev,
            publicPlace: response.data.logradouro || "",
            neighborhood: response.data.bairro || "",
            city: response.data.localidade || "",
            state: response.data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const del = async () => {
    if (!confirm("Deseja realmente deletar este usuário?")) return;
    try {
      await api.delete(`/Customers/id?id=${user.id}`);
      setMessage("Cliente removido.");
      setIsError(false);
      reload();
    } catch {
      setMessage("Erro ao deletar cliente.");
      setIsError(true);
    }
  };

  return (
    <div className={styles.customerCard}>
      {editing ? (
        <div className={styles.editGrid}>
          <div className={styles.editHeader}>
            <span>Editando ID: {user.id}</span>
            <button
              onClick={() => setEditing(false)}
              className={styles.closeBtnAbsolute}
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.inputList}>
            <input
              name="name"
              placeholder="Nome"
              value={data.name}
              onChange={handleChange}
            />
            <input
              name="cpf"
              placeholder="CPF"
              value={data.cpf}
              onChange={handleChange}
            />
            <input
              name="cep"
              placeholder="CEP"
              value={data.cep}
              onChange={handleCepChange}
            />
            <input
              name="publicPlace"
              placeholder="Logradouro"
              value={data.publicPlace}
              onChange={handleChange}
            />
            <input
              name="city"
              placeholder="Cidade"
              value={data.city}
              onChange={handleChange}
            />
          </div>

          <button className={styles.saveActionBtn} onClick={save}>
            <Save size={16} /> Salvar Alterações
          </button>
        </div>
      ) : (
        <div className={styles.viewGrid}>
          <div className={styles.infoPrimary}>
            <div className={styles.avatarPlaceholder}>
              {data.name.charAt(0)}
            </div>
            <div>
              <h3>{data.name}</h3>
              <span>
                ID: {data.id} • CPF: {data.cpf}
              </span>
            </div>
          </div>

          <div className={styles.infoSecondary}>
            <div className={styles.locationInfo}>
              <MapPin size={14} />
              <span>
                {data.publicPlace}, {data.neighborhood} — {data.city}/
                {data.state}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={() => setEditing(true)}
              className={styles.btnIconEdit}
            >
              <Pencil size={18} />
            </button>
            <button onClick={del} className={styles.btnIconDelete}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
