import { useState } from "react";
import styles from "../styles/customerForm.module.css";
import { Save, X } from "lucide-react";
import axios from "axios";
import api from "./api";

export default function CustomerModal({
  closeModal,
  reload,
  setMessage,
  setIsError,
}) {
  const [data, setData] = useState({
    name: "",
    cpf: "",
    publicPlace: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleCep = async (e) => {
    const cep = e.target.value;
    setData((p) => ({ ...p, cep }));

    if (cep.replace(/\D/g, "").length === 8) {
      try {
        const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!res.data.erro) {
          setData((p) => ({
            ...p,
            publicPlace: res.data.logradouro,
            neighborhood: res.data.bairro,
            city: res.data.localidade,
            state: res.data.uf,
          }));
        }
      } catch {}
    }
  };

  const saveCustomer = async () => {
    try {
      await api.post(`/customer`, data);
      setMessage("Cliente cadastrado com sucesso!");
      setIsError(false);
      reload();
      closeModal();
    } catch (err) {
      setMessage("Erro ao cadastrar cliente.");
      setIsError(true);
    }
  };

  const fields = [
    { name: "name", label: "Nome" },
    { name: "cpf", label: "CPF" },
    { name: "cep", label: "CEP" },
    { name: "publicPlace", label: "Logradouro" },
    { name: "neighborhood", label: "Bairro" },
    { name: "city", label: "Cidade" },
    { name: "state", label: "Estado" },
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeModal} onClick={closeModal}>
          <X size={18} />
        </button>

        <h2>Novo Cliente</h2>

        {fields.map(({ name, label }) => (
          <input
            key={name}
            name={name}
            placeholder={label}
            value={data[name]}
            onChange={name === "cep" ? handleCep : handleChange}
            className={styles.inputField}
          />
        ))}

        <button
          className={`${styles.button} ${styles.saveButton}`}
          onClick={saveCustomer}
        >
          <Save size={16} /> Salvar
        </button>
      </div>
    </div>
  );
}
