import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import {
  User,
  Lock,
  Mail,
  CheckCircle,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import styles from "../styles/auth.module.css"; // Sugiro mudar o nome do arquivo CSS

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const router = useRouter();
  const api = "https://api-clientes-82603d31c6f9.herokuapp.com/Users";

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post(`${api}/login`, loginData);
      if (response.data.token) {
        sessionStorage.setItem("authToken", response.data.token);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        setMessage("Bem-vindo de volta! Redirecionando...");
        setIsError(false);
        setTimeout(() => router.push("/clientes"), 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Credenciais inválidas.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (type, placeholder, name, value, onChange, Icon) => (
    <div className={styles.inputGroup}>
      <div className={styles.iconWrapper}>
        <Icon size={18} />
      </div>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={styles.input}
        required
      />
    </div>
  );

  return (
    <div className={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.authCard}
      >
        <div className={styles.authHeader}>
          <h1>
            {activeTab === "login"
              ? "Entrar na plataforma"
              : "Criar nova conta"}
          </h1>
          <p>Gerencie seus clientes com eficiência e rapidez.</p>
        </div>

        <div className={styles.tabSystem}>
          <button
            className={activeTab === "login" ? styles.activeTab : ""}
            onClick={() => {
              setActiveTab("login");
              setMessage("");
            }}
          >
            Login
          </button>
          <button
            className={activeTab === "register" ? styles.activeTab : ""}
            onClick={() => {
              setActiveTab("register");
              setMessage("");
            }}
          >
            Cadastro
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={
              activeTab === "login"
                ? handleLogin
                : (e) => {
                    e.preventDefault(); /* sua logica de register */
                  }
            }
            className={styles.form}
          >
            {activeTab === "register" &&
              renderInput(
                "text",
                "Nome Completo",
                "name",
                registerData.name,
                (e) =>
                  setRegisterData({ ...registerData, name: e.target.value }),
                User
              )}

            {renderInput(
              "email",
              "E-mail institucional",
              "email",
              activeTab === "login" ? loginData.email : registerData.email,
              activeTab === "login"
                ? (e) => setLoginData({ ...loginData, email: e.target.value })
                : (e) =>
                    setRegisterData({ ...registerData, email: e.target.value }),
              Mail
            )}

            {renderInput(
              "password",
              "Senha",
              "password",
              activeTab === "login"
                ? loginData.password
                : registerData.password,
              activeTab === "login"
                ? (e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                : (e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    }),
              Lock
            )}

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                <Loader2 className={styles.spinner} />
              ) : (
                <>
                  {" "}
                  {activeTab === "login"
                    ? "Acessar Sistema"
                    : "Finalizar Cadastro"}{" "}
                  <ArrowRight size={18} />{" "}
                </>
              )}
            </button>
          </motion.form>
        </AnimatePresence>

        {message && (
          <div
            className={`${styles.toast} ${
              isError ? styles.toastError : styles.toastSuccess
            }`}
          >
            {isError ? <XCircle size={18} /> : <CheckCircle size={18} />}
            {message}
          </div>
        )}
      </motion.div>
    </div>
  );
}
