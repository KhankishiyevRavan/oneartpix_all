export default function GallerySection() {
  return (
    <section id="gallery" className="px-5 md:px-8 py-8 ">
      <div
        className="
          mx-auto w-full max-w-[1268px]
          grid gap-[41px]
          grid-cols-3       /* default → 3 sütun */
          max-[768px]:grid-cols-2  /* 768px və aşağı → 2 sütun */
        "
      >
        {/* Column 1 */}
        <div className="flex flex-col gap-[41px] min-w-0">
          <img
            src="/images/rec1.png"
            alt="rec1"
            className="w-full object-cover"
          />
          <img
            src="/images/rec2.png"
            alt="rec2"
            className="w-full object-cover"
          />
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-[41px] min-w-0">
          <img
            src="/images/rec3.png"
            alt="rec3"
            className="w-full object-cover"
          />
          <img
            src="/images/rec4.png"
            alt="rec4"
            className="w-full object-cover"
          />
        </div>

        {/* Column 3 → yalnız 768px-dən yuxarı görünür */}
        <div className="flex flex-col gap-[41px] min-w-0 max-[768px]:hidden">
          <img
            src="/images/rec5.png"
            alt="rec5"
            className="w-full object-cover"
          />
          <img
            src="/images/rec6.png"
            alt="rec6"
            className="w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
