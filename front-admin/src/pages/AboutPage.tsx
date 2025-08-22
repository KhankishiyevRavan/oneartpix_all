import React from "react";
import { useNavigate } from "react-router";
import Button from "../components/ui/button/Button";
import ThemeTogglerTwo from "../components/common/ThemeTogglerTwo";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className=" flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
          <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </div> */}
      <div className="relative max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow p-6 mt-10 text-gray-800 dark:text-gray-100 leading-relaxed border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Haqqımızda
        </h1>
        <div className="space-y-3 mb-6 text-gray-800 dark:text-gray-200">
          <p>
            <strong>Şirkət adı:</strong> MEDI GROUP MMC
          </p>
          <p>
            <strong>VÖEN:</strong> 1202027011
          </p>
          <p>
            <strong>Ünvan:</strong> Xəzər rayonu, 86-G saylı bağ evi
          </p>
        </div>
        <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
          <p>
            <strong>Oneartpix.com</strong> — MEDI GROUP MMC tərəfindən yaradılmış və
            idarə olunan, Azərbaycanda kombi və isitmə sistemlərinə texniki
            xidmət və dəstək sahəsində yeni nəsil rəqəmsal platformadır.
            Layihənin məqsədi müasir texnologiyalar vasitəsilə müştəri
            məmnuniyyətini yüksəltmək, xidmət prosesini şəffaflaşdırmaq və
            sadələşdirməkdir.
          </p>
          <p>
            Platformamız vasitəsilə müştərilər onlayn qaydada servis çağırışı
            edə, xidmət tarixçələrini izləyə və ödəniş balanslarını idarə edə
            bilərlər. Eyni zamanda, istifadəçi dostu interfeysimiz hər kəsin
            rahat istifadəsi üçün xüsusi olaraq optimallaşdırılmışdır.
          </p>
          <p>
            MEDI GROUP MMC — xidmət keyfiyyətinə və peşəkar kadrlara xüsusi önəm
            verərək, innovativ həllərlə bazarda fərqlənir. Xidmət
            standartlarımız daim təkmilləşdirilir və məqsədimiz müştərilərimizin
            ehtiyaclarını vaxtında və effektiv şəkildə qarşılamaqdır.
          </p>
          <p>
            Bizim üçün müştəri etimadı əsas prioritetdir. Buna görə də hər bir
            servis əməliyyatı qeyd olunur və istifadəçilərin platforma üzərindən
            bu məlumatlara asanlıqla çıxış imkanı yaradılır. Gələcəkdə daha
            geniş xidmət spektri və əlavə funksionallıqların tətbiqi
            planlaşdırılır.
          </p>
          <Button
            className="w-full"
            size="sm"
            type="submit"
            onClick={() => navigate("/signin")}
          >
            Ana səhifəyə qayıt
          </Button>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </>
  );
};

export default AboutPage;
