import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.username) {
          setId(res.data.userId);
          setUsername(res.data.username);
          setName(res.data.name);
        }
      })
      .catch(() => {
        // Not logged in or token invalid — do nothing
      });
  }, []);

  return (
    <UserContext.Provider
      value={{ username, setUsername, id, setId, name, setName }}
    >
      {children}
    </UserContext.Provider>
  );
}
