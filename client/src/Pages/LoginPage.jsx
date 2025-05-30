import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../Components/Header";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const {
    id,
    setId,
    setUsername: setUserNameContext,
    setName: setNameContext,
  } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister ? "/register" : "/login";
    try {
      const { data } = await axios.post(
        "http://localhost:4000" + url,
        {
          name,
          username,
          password,
        },
        { withCredentials: true }
      );

      setId(data.id);
      setUserNameContext(data.username);
      setNameContext(name);
      setUsername("");
      setPassword("");
      setName("");
      setIsRegister(false);
      navigate("/dashboard");
    } catch (error) {
      alert("An error occurred. Please try again.", error);
      console.error("Error during authentication:", error);
    }
  };
  useEffect(() => {
    axios
      .get("http://localhost:4000/profile", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.username) {
          navigate("/dashboard");
        }
      })
      .catch(() => {
        // Not logged in or token invalid — do nothing
      });
  }, [navigate]); //navigate is a dependency to avoid multiple renders and checks during initial render

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center h-screen bg-green-200">
        <form
          className="flex-col flex w-60 mx-auto items-center"
          id="loginForm"
        >
          <h2 className="mb-4 text-2xl font-bold">
            {isRegister ? "Register Form" : "Login Form"}
          </h2>
          {isRegister && (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="block w-full rounded-sm p-2 mb-2 bg-white border"
              required
            />
          )}

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            className="block w-full rounded-sm p-2 mb-2 bg-white border"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="block w-full rounded-sm p-2 mb-2 bg-white border"
            required
          />
          <button
            className="my-2 bg-amber-500 rounded-lg p-2"
            onClick={handleSubmit}
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>
        <p>
          {isRegister ? "Already a member ? " : "New User ? "}
          <span
            className="hover:underline shadow text-gray-600"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Login Here" : "Register Here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
