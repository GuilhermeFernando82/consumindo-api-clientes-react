import { useState } from "react";
import { motion } from "framer-motion"; // Removi AnimatePresence se não for disparar saída agora
import {
  Save,
  X,
  User,
  ChartAreaIcon,
  MapPin,
  Home, // Usei Home em vez de Building por ser mais comum
  Globe,
} from "lucide-react";
import axios from "axios";
import api from "./api";
import styles from "../styles/modalCard.module.css";

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

  const handleChange = (e) => {
    const { name, value: rawValue } = e.target;
    let value = rawValue;

    if (name === "cpf") {
      // 1. Remove tudo que não é número
      value = value.replace(/\D/g, "");

      // 2. Impede que digitem mais de 11 números
      if (value.length > 11) value = value.slice(0, 11);

      // 3. Aplica a máscara progressivamente
      value = value
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o primeiro ponto
        .replace(/(\d{3})(\d)/, "$1.$2") // Coloca o segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Coloca o hífen
    }

    // ATENÇÃO: Use 'value' (a variável tratada) e não 'e.target.value'
    setData({ ...data, [name]: value });
  };

  const handleCep = async (e) => {
    const cepValue = e.target.value;
    const cleanCep = cepValue.replace(/\D/g, "");
    setData((p) => ({ ...p, cep: cepValue }));

    if (cleanCep.length === 8) {
      try {
        const res = await axios.get(
          `https://viacep.com.br/ws/${cleanCep}/json/`
        );
        if (!res.data.erro) {
          setData((p) => ({
            ...p,
            publicPlace: res.data.logradouro || "",
            neighborhood: res.data.bairro || "",
            city: res.data.localidade || "",
            state: res.data.uf || "",
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP");
      }
    }
  };

  const saveCustomer = async () => {
    try {
      await api.post(`/Customers/customer`, data);
      setMessage("Cliente cadastrado com sucesso!");
      setIsError(false);
      reload();
      closeModal();
    } catch (err) {
      setMessage("Erro ao cadastrar cliente.");
      setIsError(true);
    }
  };

  // Mapeamento revisado com ícones garantidos
  const fields = [
    { name: "name", label: "Nome Completo", Icon: User },
    { name: "cpf", label: "CPF", Icon: ChartAreaIcon },
    { name: "cep", label: "CEP", Icon: MapPin },
    { name: "publicPlace", label: "Logradouro", Icon: Home },
    { name: "neighborhood", label: "Bairro", Icon: Home },
    { name: "city", label: "Cidade", Icon: Globe },
    { name: "state", label: "Estado (UF)", Icon: Globe },
  ];

  return (
    <div className={styles.modalOverlay}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={styles.modalContent}
      >
        {/* Botão X - Verifique se 'closeBtnAbsolute' existe no seu CSS */}
        <button className={styles.closeBtnAbsolute} onClick={closeModal}>
          <X size={20} />
        </button>

        <div className={styles.authHeader}>
          <h1 className={styles.title}>Novo Cliente</h1>
          <p className={styles.subtitle}>
            Preencha os dados abaixo para o registro.
          </p>
        </div>

        <div className={styles.modalFormGrid}>
          {fields.map(({ name, label, Icon }) => (
            <div key={name} className={styles.inputGroup}>
              <div className={styles.iconWrapper}>
                {Icon && <Icon size={18} />}
              </div>
              <input
                name={name}
                placeholder={label}
                value={data[name] || ""}
                onChange={name === "cep" ? handleCep : handleChange}
                className={styles.input}
              />
            </div>
          ))}
        </div>

        <button className={styles.submitBtn} onClick={saveCustomer}>
          <Save size={18} /> Cadastrar Cliente
        </button>
      </motion.div>
    </div>
  );
}
