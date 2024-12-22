import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../utils/UserContext";
import { IconCalendarMonth } from "@tabler/icons-react";
import { greeting } from "../utils/greeting";
import moment from "moment"; // Time extension

export const Welcome = () => {
  const navigate = useNavigate();
  const welcomeMessage = greeting();
  const defaultImage = "/images/users/default.webp";

  const { user } = useContext(UserContext);

  const currentDate = moment().format("DD-MM-YYYY");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirige a SignIn si no hay token
      return;
    }
  }, [navigate, user]);
  return (
    <div className="m-4 mt-2 ">
      <div className="flex justify-between ">
        <div className="bg-sky-200 rounded-full w-fit px-2 text-xs flex items-center sm:hidden">
          <IconCalendarMonth stroke={1} />
          {currentDate}
        </div>
        <img
          src="../images/RTW.png"
          alt="Workron"
          className="w-28 h-full sm:hidden"
        />
      </div>
      <div className="sm:hidden rounded-t-lg">
        {user ? (
          <div className="flex justify-between items-center">
            <div className="mr-4">
              <p className="mt-4 px-2 text-sm font-medium text-neutral-400">
                {welcomeMessage},
              </p>
              <h2 className="mb-4 px-2 text-lg font-semibold">{user.name}</h2>
            </div>
            <div>
              <Link to="/account" className="sm:flex sm:justify-center">
                <img
                  src={user.photo ? user.photo : defaultImage}
                  alt="Profile Picture"
                  className="w-12 rounded-full"
                />
              </Link>
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      {(user?.role === "worker") && (
        <Link to="/time" className="sm:flex sm:justify-center">
          <p className="bg-indigo-600 text-white text-center mb-4 px-4 py-2 font-semibold sm:w-48 rounded-xl">
            Start Shift
          </p>
        </Link>
      )}
    </div>
  );
};
