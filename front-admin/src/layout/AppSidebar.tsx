import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  ChevronDownIcon,
  PencilIcon,
  PieChartIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  const [localExpandedInitialized, setLocalExpandedInitialized] =
    useState(false);
  useEffect(() => {
    const storedExpanded = localStorage.getItem("sidebarExpanded");
    if (storedExpanded !== null && storedExpanded !== String(isExpanded)) {
      toggleSidebar();
    }
    setLocalExpandedInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // let permissions = [];
  useEffect(() => {
    const storedPermissions = localStorage.getItem("permissions");
    if (storedPermissions) {
      try {
      } catch (err) {
        console.error("Could not parse permissions from localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("role");
      setRole(updatedRole);
    };
    console.log(role);

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const navItems: NavItem[] = [
    {
      icon: <PieChartIcon />,
      name: "Dashboard",
      path: "/dashboard",
    },

    {
      icon: <PencilIcon />,
      name: "Product",
      subItems: [
        { name: "Products", path: "/admin/products", pro: false },
        { name: "Add new product", path: "/admin/addProduct", pro: false },
      ],
    },
    {
      icon: <PencilIcon />,
      name: "Contact",
      subItems: [
        { name: "Contact List", path: "/admin/contacts", pro: false },
      ],
    },
    // {
    //   icon: <PencilIcon />,
    //   name: "Təmir tarixçələri",
    //   subItems: [
    //     { name: "Təmirlər", path: "/repairs", pro: false },
    //     // { name: "Təmir əlavə et", path: "/create-repair", pro: false },
    //   ],
    // },
  ];
  const [hoveredItemIndex, setHoveredItemIndex] = useState<number | null>(null);
  const { isExpanded, isMobileOpen, toggleSidebar } =
    useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => {
      if (!path) return false;

      // Əgər tam bərabərdirsə true
      if (location.pathname === path) return true;

      // PATH dinamikdirsə və sadəcə "/edit-role/..." kimi spesifik bir route-a aiddirsə
      if (path === "/roles" && location.pathname.startsWith("/edit-role")) {
        return true;
      }

      if (
        path === "/create-contract" &&
        location.pathname.startsWith("/edit-contract")
      ) {
        return true;
      }
      if (
        path === "/create-contract" &&
        location.pathname.startsWith("/create-contract")
      ) {
        return true;
      }
      if (path === "/contracts" && location.pathname.startsWith("/contract/")) {
        return true;
      }

      if (
        path === "/add-balance" &&
        location.pathname.startsWith("/add-balance")
      ) {
        return true;
      }
      if (
        path === "/create-sale" &&
        location.pathname.startsWith("/payments/new")
      ) {
        return true;
      }

      if (
        path === "/create-sale" &&
        location.pathname.startsWith("/sale-table")
      ) {
        return true;
      }
      if (path === "/call" && location.pathname.startsWith("/call/")) {
        return true;
      }

      return false;
    },
    [location.pathname]
  );

  useEffect(() => {
    if (!localExpandedInitialized) return;

    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive, localExpandedInitialized]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };
  useEffect(() => {
    const storedExpanded = localStorage.getItem("sidebarExpanded");
    if (storedExpanded !== null && storedExpanded !== String(isExpanded)) {
      // Əgər localStorage-dəki fərqlidirsə toggle et
      toggleSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    localStorage.setItem("sidebarExpanded", String(isExpanded));
  }, [isExpanded]);

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li
          key={nav.name}
          className="relative"
          onMouseEnter={() => setHoveredItemIndex(index)}
          onMouseLeave={() => setHoveredItemIndex(null)}
        >
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded ? "lg:justify-center" : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name} className="">
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            Yeni
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            O
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {nav.subItems &&
            !isExpanded &&
            !isMobileOpen &&
            hoveredItemIndex === index && (
              <div className="absolute top-0 left-full w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
                <ul className="py-2">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name} className="">
                      <Link
                        to={subItem.path}
                        className={`block px-4 py-2 text-sm whitespace-nowrap text-gray-500 dark:text-white ${
                          isActive(subItem.path)
                            ? "bg-gray-100 dark:bg-gray-700 font-medium"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      // onMouseEnter={() => !isExpanded && setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex logo-link-wrapper ${
          !isExpanded ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="logo-link">
          {isExpanded || isMobileOpen ? "Oneartpix.com" : "O"}
        </Link>
      </div>
      <div className="flex flex-col duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>{renderMenuItems(navItems, "main")}</div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
