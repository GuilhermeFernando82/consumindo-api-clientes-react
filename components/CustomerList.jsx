import CustomerCard from "./CustomerCard";

export default function CustomerList({
  users,
  reload,
  setMessage,
  setIsError,
  setSearchedUser,
}) {
  return (
    <div>
      {users?.length > 0 ? (
        users.map((u) => (
          <CustomerCard
            key={u.id}
            user={u}
            reload={reload}
            setMessage={setMessage}
            setIsError={setIsError}
          />
        ))
      ) : (
        <p>Nenhum cliente cadastrado.</p>
      )}
    </div>
  );
}
