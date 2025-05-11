import { Outlet, Link, useLocation } from "react-router-dom";
import { FaUserPlus, FaUserDoctor, FaHospitalUser } from "react-icons/fa6";
import { FaUserFriends, FaClinicMedical } from "react-icons/fa";
import { RiPrinterFill } from "react-icons/ri";

const Main = () => {
  const location = useLocation();

  const webPaths = [
    {
      title: "Layanan",
      items: [
        {
          to: "/registration",
          icon: <FaUserPlus size={24} />,
          label: "Registrasi Online",
        },
        { to: "/print", icon: <RiPrinterFill size={24} />, label: "Cetak" },
        {
          to: "/reservations",
          icon: <FaUserFriends size={24} />,
          label: "List Reservasi",
        },
      ],
    },
    {
      title: "Master Data",
      items: [
        {
          to: "/doctors",
          icon: <FaUserDoctor size={24} />,
          label: "List Dokter",
        },
        {
          to: "/poli",
          icon: <FaClinicMedical size={24} />,
          label: "List Poli",
        },
        {
          to: "/patients",
          icon: <FaHospitalUser size={24} />,
          label: "List Pasien",
        },
      ],
    },
  ];

  return (
    <div className="flex">
      <nav id="navigation" className="p-8 min-h-svh">
        <img className="w-full" src="https://placehold.co/200x100" alt="" />
        {webPaths.map((section) => (
          <div className="flex flex-col gap-2.5" key={section.title}>
            <h3 className="mb-1 mt-4 ml-4 text-sm text-zinc-400">
              {section.title}
            </h3>
            {section.items.map(({ to, icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-5 py-4 text-nowrap font-semibold inline-flex items-center gap-5 rounded-lg ${
                    isActive
                      ? "shadow shadow-blue-200 bg-blue-500 text-blue-100"
                      : "hover:bg-zinc-200 hover:text-blue-500"
                  }`}
                >
                  {icon}
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <main className="p-8 shadow w-full bg-zinc-50">
        <h2 className="text-2xl font-bold mb-4">
          {webPaths
            .flatMap((section) => section.items)
            .find((item) => item.to === location.pathname)?.label || null}
        </h2>
        <Outlet />
      </main>
    </div>
  );
};

export default Main;
