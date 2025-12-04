import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, LogOut } from "lucide-react";
import { useRouter } from "next/router";
import styles from "../styles/customerForm.module.css";
import api, { configureInterceptors } from "./api";
import CustomerList from "./CustomerList";
import CustomerModal from "./CustomerModal";

export default function CustomersPanel() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await api.get();
      setUsers(res.data);
    } catch {
      setMessage("Erro ao carregar clientes.");
      setIsError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    router.push("/");
  };

  const handleSearchById = async () => {
    if (!searchId) return loadUsers();
    try {
      const res = await api.get(`/id?id=${searchId}`);
      if (res.data) {
        setSearchedUser(res.data);
      }
    } catch {
      setSearchedUser(null);
      setMessage("Cliente não encontrado.");
      setIsError(true);
    }
  };

  useEffect(() => {
    const { reqInterceptor, resInterceptor } = configureInterceptors(router);
    loadUsers();
    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.searchGroup}>
          <input
            type="number"
            placeholder="Buscar cliente pelo ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton} onClick={handleSearchById}>
            <Search size={18} />
          </button>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <motion.div className={styles.pageContainer}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={styles.mainContent}
        >
          <h1 className={styles.title}>Painel de Clientes</h1>

          {message && (
            <div
              className={`${styles.messageBox} ${
                isError ? styles.errorBox : styles.successBox
              }`}
            >
              <span className={styles.messageText}>{message}</span>
            </div>
          )}

          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={() => setShowModal(true)}
          >
            + Novo Cliente
          </button>

          <CustomerList
            users={searchedUser ? [searchedUser] : users}
            reload={loadUsers}
            setMessage={setMessage}
            setIsError={setIsError}
          />

          {showModal && (
            <CustomerModal
              closeModal={() => setShowModal(false)}
              reload={loadUsers}
              setMessage={setMessage}
              setIsError={setIsError}
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
