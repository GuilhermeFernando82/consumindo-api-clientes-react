import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { User, Lock, Mail, CheckCircle, XCircle } from "lucide-react";

import styles from "../styles/customerForm.module.css";
export default function App() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  const api = "https://localhost:7181/Users";

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setToken(null);
    setMessage("");
    setIsError(false);

    try {
      const response = await axios.post(`${api}/login`, loginData);

      if (response.data.token) {
        setToken(response.data.token);
        console.log("tr", response.data.token);
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        setMessage("Login realizado com sucesso!");
        setIsError(false);
        router.push("/clientes");
        return;
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Erro ao conectar com o servidor.";
      setMessage(`Falha no Login: ${errorMsg}`);
      setIsError(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    try {
      const response = await axios.post(`${api}/user`, registerData);
      setMessage(
        `Cadastro de ${
          response.data.name || "usuário"
        } realizado com sucesso! Agora você pode fazer login.`
      );
      setIsError(false);
      setRegisterData({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data ||
        "Erro ao tentar cadastrar. Tente novamente.";
      setMessage(`Falha no Cadastro: ${errorMsg}`);
      setIsError(true);
    }
  };
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderInputWithIcon = (
    type,
    placeholder,
    name,
    value,
    onChange,
    Icon
  ) => (
    <motion.div variants={itemVariants} className={styles.inputWrapper}>
      <Icon className={styles.inputIcon} />{" "}
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        className={styles.inputFieldWithIcon}
        value={value}
        onChange={onChange}
        required
      />{" "}
    </motion.div>
  );

  return (
    <div className={styles.pageContainer}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={styles.mainContent}
      >
        <motion.div variants={containerVariants} className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Acesso de Usuário</h2>
            <p className={styles.subtitle}>Faça login para continuar.</p>
          </div>

          <form onSubmit={handleLogin} className={styles.formGrid}>
            {renderInputWithIcon(
              "email",
              "Email",
              "email",
              loginData.email,
              handleLoginChange,
              Mail
            )}
            {renderInputWithIcon(
              "password",
              "Senha",
              "password",
              loginData.password,
              handleLoginChange,
              Lock
            )}

            <motion.button
              variants={itemVariants}
              className={`${styles.button} ${styles.loginButton}`}
              type="submit"
            >
              Entrar
            </motion.button>

            <motion.p variants={itemVariants} className={styles.forgotPassword}>
              Esqueceu sua senha?{" "}
              <a href="#" className={styles.link}>
                Clique aqui
              </a>
            </motion.p>
          </form>
        </motion.div>

        <motion.div variants={containerVariants} className={styles.card}>
          <div className={styles.header}>
            <h2 className={styles.title}>Crie sua conta</h2>
            <p className={styles.subtitle}>
              Preencha o formulário abaixo para se registrar.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className={`${styles.formGrid} ${styles.registerFormGrid}`}
          >
            {renderInputWithIcon(
              "text",
              "Nome Completo",
              "name",
              registerData.name,
              handleRegisterChange,
              User
            )}
            {renderInputWithIcon(
              "email",
              "Email",
              "email",
              registerData.email,
              handleRegisterChange,
              Mail
            )}
            {renderInputWithIcon(
              "password",
              "Senha",
              "password",
              registerData.password,
              handleRegisterChange,
              Lock
            )}
            <motion.div
              variants={itemVariants}
              className={styles.registerButtonContainer}
            >
              <button
                className={`${styles.button} ${styles.registerButton}`}
                type="submit"
              >
                Cadastrar
              </button>
            </motion.div>
          </form>
        </motion.div>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${styles.messageBox} ${
              isError ? styles.errorBox : styles.successBox
            }`}
          >
            {isError ? (
              <XCircle className={styles.messageIcon} />
            ) : (
              <CheckCircle className={styles.messageIcon} />
            )}
            <span className={styles.messageText}>{message}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
