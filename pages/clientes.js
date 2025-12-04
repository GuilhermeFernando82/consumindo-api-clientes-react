import { useEffect } from "react";
import { useRouter } from "next/router";
import CustomersPanel from "../components/CustomersPanel";

export default function ClientesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");

    if (!token) router.push("/");
  }, [router]);

  return <CustomersPanel />;
}
