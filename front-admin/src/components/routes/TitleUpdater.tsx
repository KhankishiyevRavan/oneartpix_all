import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titleMap: { [key: string]: string } = {
      "/dashboard": "Idarə paneli",
      "/signin": "Daxil olmaq",
      "/signup": "Qeydiyyat",
      "/reset-password": "Şifrə bərpası",
      "/about": "Haqqımızda",
      "/list": "İstifadəçilər",
      "/list/create": "İstifadəçi əlavə et",
      "/create-package": "Xidmət paketi əlavə et",
      "/packages": "Paketlər siyahısı",
      "/calls": "Çağırışlar",
      "/roles": "Rol siyahısı",
      "/create-role": "Rol əlavə et",
      "/call": "Çağırış növü seçin",
      "/call/non-subscriber": "Qeyri-abunəçi çağırışı",
      "/call/subscriber": "Abunəçi çağırışı",
      "/PayServiceForm": "Xidmət satışı",
      "/calendar": "Təqvim",
      "/create-contract": "Müqavilə əlavə et",
      "/create-sale": "Ödəniş əlavə et",
      "/sales": "Ödənişlər",
      "/payments/new": "Yeni ödəniş",
      "/add-balance": "Balans əlavə et",
      "/balance": "Balans paneli",
      "/contracts": "Müqavilə siyahısı",
      "/notifications": "Bildirişlər",
      "/form-elements": "Form komponentləri",
      "/basic-tables": "Cədvəllər",
      "/alerts": "Bildirişlər",
      "/avatars": "Avatarlar",
      "/badge": "Badge-lər",
      "/buttons": "Button-lar",
      "/images": "Şəkillər",
      "/videos": "Videolar",
      "/line-chart": "Line chart",
      "/bar-chart": "Bar chart",
      "/coming-soon": "Tezliklə",
      "/blank": "Boş səhifə",
      "/repairs": "Təmirlər",
      
    };

    const dynamicPaths = [
      { key: "/profile/", title: "İstifadəçi profili" },
      { key: "/edit-profile/", title: "Profil redaktə etmə" },
      { key: "/contract/", title: "Müqavilə" },
      { key: "/sale-table/", title: "Müqavilə üzrə ödəniş cədvəli" },
      { key: "/invoice/", title: "Qaimə" },
      { key: "/repair/", title: "Təmir" },
      { key: "/edit-contract/", title: "Müqavilə redaktə etmə" },
      { key: "/edit-role/", title: "Rol redaktə etmə" },
      { key: "/list/edit/", title: "İstifadəçi redaktə etmə" },
      { key: "/add-balance/", title: "Balans artır (seçilmiş)" },
      { key: "/call/accept/", title: "Çağırışı qəbul et" },
      { key: "/reset-password/", title: "Yeni şifrə" },
      { key: "/create-contract/", title: "Müqavilə əlavə etmə formu" },
    ];

    let pageTitle = titleMap[location.pathname];

    if (!pageTitle) {
      for (const dynamic of dynamicPaths) {
        if (location.pathname.startsWith(dynamic.key)) {
          pageTitle = dynamic.title;
          break;
        }
      }
    }

    document.title = pageTitle ? `${pageTitle} | Oneartpix.com` : "Oneartpix.com";
  }, [location.pathname]);

  return null;
};

export default TitleUpdater;
