import React, { useEffect } from "react";
import Header from "../Components/Header";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { id, name } = useContext(UserContext);
  useEffect(() => {
    if (id === undefined || id === null) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <div className="h-screen bg-amber-600">Dashboard</div>
    </div>
  );
};

export default Dashboard;
