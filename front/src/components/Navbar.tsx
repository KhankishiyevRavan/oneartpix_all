import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

type MenuItem = { label: string; href: string };

const MENU: MenuItem[] = [
  { label: "COLLECTIONS & THEMES", href: "/gallery" },
  { label: "NEWS", href: "/news" },
  { label: "CONTACT ME", href: "/contact" },
  { label: "MUST HAVE", href: "/must-have" },
  { label: "DIGITAL & WEB SERVICES", href: "/services" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { totalItems } = useCart(); // hook
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 bg-[#111922] text-[#e9c78a] border-b border-[#d9b8801a] h-[72px] md:h-[89px]">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* SOL: Logo */}
        <a href="/" className="flex items-center h-full">
          <img
            src="/images/logoo.png"
            alt="Logo"
            className="h-10 md:h-[72px] w-auto"
          />
        </a>

        {/* SAĞ QRUP: (Menyu + İkonlar) */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Menyu (yalnız md və yuxarı) */}
          <nav className="hidden md:flex items-center gap-8">
            {MENU.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[#FFD8A2] text-sm xs940:text-[13px] font-inter font-normal uppercase py-2 text-center break-words hover:opacity-90 relative after:absolute after:left-0 md:after:-bottom-1 after:h-[2px] after:w-0 after:bg-[#e9c78a] after:transition-all hover:after:w-full"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* İkonlar */}
          <div className="flex items-center gap-5">
            {/* Axtarış */}
            <button
              aria-label="Search"
              className="p-1 hover:opacity-90"
              title="Search"
            >
              <svg
                width="23"
                height="33"
                viewBox="0 0 23 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5158 18.001H14.6466L14.3155 17.6699C15.4054 16.4697 16.0538 14.8418 16.0538 13.1036C16.0538 9.18559 12.8946 6.02637 8.97661 6.02637C5.05863 6.02637 1.89941 9.18559 1.89941 13.1036C1.89941 17.0215 5.05863 20.1808 8.97661 20.1808C10.7149 20.1808 12.3428 19.5324 13.543 18.4425L13.8741 18.7736V19.6427L19.3096 25.0782L20.9375 23.4503L15.5158 18.001ZM8.9904 18.001C6.27265 18.001 4.09293 15.8213 4.09293 13.1036C4.09293 10.3858 6.27265 8.20609 8.9904 8.20609C11.7082 8.20609 13.8879 10.3858 13.8879 13.1036C13.8741 15.8351 11.7082 18.001 8.9904 18.001Z"
                  fill="#FFD8A2"
                />
              </svg>
            </button>

            {/* Səbət */}
            <button
              aria-label="Cart"
              className="relative p-1 hover:opacity-90"
              title="Cart"
              onClick={() => navigate("/cart")}
            >
              <svg
                width="28"
                height="27"
                viewBox="0 0 28 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.8782 11.0751L17.3294 4.52625M23.8782 11.0751H4.23169M23.8782 11.0751L22.3972 18.4802C21.9891 20.5209 20.1972 21.9898 18.1161 21.9898H9.99383C7.91268 21.9898 6.12085 20.5209 5.7127 18.4802L4.23169 11.0751M4.23169 11.0751L10.7805 4.52625"
                  stroke="#FFD8A2"
                  strokeWidth="1.63721"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* 🔔 Badge */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FFD8A2] text-[#121b25] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburger (yalnız mobil) */}
            <button
              className="md:hidden p-1"
              aria-label="Menu"
              onClick={() => setOpen((s) => !s)}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M6 18L18 6" />
                ) : (
                  <>
                    <path d="M3 6h18" />
                    <path d="M3 12h18" />
                    <path d="M3 18h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menyu */}
      <div
        className={`md:hidden border-t border-[#d9b8801a] bg-[#0e151d] transition-[max-height] duration-300 ${
          open ? "max-h-96" : "max-h-0 overflow-hidden"
        }`}
      >
        <nav className="flex flex-col gap-3 px-4 py-4">
          {MENU.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-2 text-[13px] uppercase text-[#FFD8A2] hover:opacity-90"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
