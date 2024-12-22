import Navbar from "../partials/Navbar";
import { useContext } from "react";
import { UserContext } from "../utils/UserContext";
import { Welcome } from "../partials/Welcome";
import { MapsAdm } from "../partials/MapsAdm";
import { Maps } from "../partials/Maps";
import { Records } from "../partials/Records";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        <Navbar />
        <Welcome />

        {(user?.role === "admin" || user?.role === "editor") && (
          <div className="z-0 mx-4 rounded-lg overflow-hidden">
            <MapsAdm />
          </div>
        )}

        {user?.role === "worker" && (
          <div className="z-0 mx-4 rounded-lg overflow-hidden">
            <Maps />
          </div>
        )}
        <Records />
      </div>
    </>
  );
};

export default Dashboard;
