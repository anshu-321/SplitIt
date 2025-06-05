import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);
  const url = "https://splitit-server-zx1r.onrender.com";

  useEffect(() => {
    axios
      .get(url + "/profile", { withCredentials: true })
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
      value={{ username, setUsername, id, setId, name, setName, url }}
    >
      {children}
    </UserContext.Provider>
  );
}
