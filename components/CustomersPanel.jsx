import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LogOut, Plus, Users, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/router";
import styles from "../styles/dashboard.module.css";
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
      const res = await api.get("/Customers");
      setUsers(res.data);
      setSearchedUser(null);
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
      const res = await api.get(`/Customers/id?id=${searchId}`);
      setSearchedUser(res.data ? res.data : null);
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
    <div className={styles.dashboardWrapper}>
      {/* Navbar Superior */}
      <nav className={styles.navBar}>
        <div className={styles.navContent}>
          <div className={styles.brand}>
            <LayoutDashboard className={styles.logoIcon} />
            <span>CRM Pro</span>
          </div>

          <div className={styles.searchBar}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="number"
              placeholder="Buscar por ID..."
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyUp={(e) => e.key === "Enter" && handleSearchById()}
            />
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={18} /> <span>Sair</span>
          </button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.headerSection}>
          <div>
            <h1>Painel de Clientes</h1>
            <p>Gerencie sua base de dados de forma centralizada.</p>
          </div>
          <button className={styles.addBtn} onClick={() => setShowModal(true)}>
            <Plus size={20} /> Novo Cliente
          </button>
        </header>

        {/* Notificações */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`${styles.alert} ${
                isError ? styles.alertError : styles.alertSuccess
              }`}
            >
              {message}
              <button onClick={() => setMessage("")}>&times;</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Clientes */}
        <section className={styles.listSection}>
          <CustomerList
            users={searchedUser ? [searchedUser] : users}
            reload={loadUsers}
            setMessage={setMessage}
            setIsError={setIsError}
          />
        </section>
      </main>

      {showModal && (
        <CustomerModal
          closeModal={() => setShowModal(false)}
          reload={loadUsers}
          setMessage={setMessage}
          setIsError={setIsError}
        />
      )}
    </div>
  );
}
