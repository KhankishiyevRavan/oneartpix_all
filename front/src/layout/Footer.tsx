export default function Footer() {
  return (
    <footer className="bg-[#171717] text-[#a3a3a3] py-[54px] font-inter text-[16px] font-normal leading-[1.7]">
      <div className="max-w-[1268px] mx-auto  flex justify-between items-center flex-wrap gap-[30px] max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-[40px] max-[1100px]:px-[40px] max-[768px]:items-center max-[768px]:text-center">
        {/* Logo & Tagline */}
        <div className="min-w-[200px] max-[768px]:text-center">
          <a href="#" className="inline-block">
            <img
              src="/images/logoo.png"
              alt="Olivia Signature Logo"
              className="block w-[115px] h-auto mb-[17px] mx-auto max-[768px]:mx-auto"
            />
          </a>
          <p className="m-0">
            Capturing moments, emotions, and the subtle <br />
            beauty of our world through the lens.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-[74px] flex-shrink-0 max-[768px]:gap-[40px]">
          <a
            href="https://www.facebook.com"
            aria-label="Visit our Facebook page"
            className="inline-block hover:opacity-70 transition-opacity"
          >
            <svg
              width="30"
              height="29"
              viewBox="0 0 30 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.9883 2.69531H18.4589C16.8988 2.69531 15.4026 3.31506 14.2994 4.41821C13.1963 5.52137 12.5765 7.01757 12.5765 8.57767V12.1071H9.04712V16.813H12.5765V26.2247H17.2824V16.813H20.8118L21.9883 12.1071H17.2824V8.57767C17.2824 8.26565 17.4064 7.96641 17.627 7.74578C17.8476 7.52514 18.1469 7.40119 18.4589 7.40119H21.9883V2.69531Z"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a
            href="https://www.instagram.com"
            aria-label="Visit our Instagram page"
            className="inline-block hover:opacity-70 transition-opacity"
          >
            <svg
              width="30"
              height="29"
              viewBox="0 0 30 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.8116 2.69531H9.0469C5.79817 2.69531 3.16455 5.32893 3.16455 8.57767V20.3424C3.16455 23.5911 5.79817 26.2247 9.0469 26.2247H20.8116C24.0603 26.2247 26.694 23.5911 26.694 20.3424V8.57767C26.694 5.32893 24.0603 2.69531 20.8116 2.69531Z"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.6353 13.7192C19.7805 14.6983 19.6132 15.6983 19.1574 16.5769C18.7015 17.4555 17.9802 18.1679 17.096 18.613C16.2119 19.058 15.2099 19.2129 14.2327 19.0556C13.2554 18.8984 12.3526 18.437 11.6527 17.7371C10.9528 17.0372 10.4914 16.1344 10.3342 15.1571C10.1769 14.1799 10.3318 13.1779 10.7768 12.2938C11.2219 11.4096 11.9343 10.6883 12.8129 10.2325C13.6915 9.77657 14.6915 9.60933 15.6706 9.75452C16.6693 9.90262 17.5939 10.368 18.3079 11.0819C19.0218 11.7959 19.4872 12.7205 19.6353 13.7192Z"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.3999 7.98975H21.4113"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#"
            aria-label="Visit our YouTube channel"
            className="inline-block hover:opacity-70 transition-opacity"
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M31.3497 10.5378C31.1883 9.93794 30.8722 9.39104 30.433 8.95181C29.9938 8.51259 29.4469 8.19646 28.847 8.03508C27.2076 7.40211 11.3281 7.09201 6.72167 8.05321C6.1218 8.21462 5.57485 8.53079 5.1356 8.97006C4.69636 9.40933 4.38022 9.9563 4.21885 10.5562C3.47892 13.8025 3.42275 20.8209 4.23698 24.1397C4.39839 24.7395 4.71455 25.2864 5.15379 25.7257C5.59304 26.1649 6.13996 26.481 6.73981 26.6424C9.98603 27.3896 25.4194 27.4948 28.8652 26.6424C29.465 26.481 30.0119 26.1649 30.4511 25.7257C30.8903 25.2864 31.2065 24.7395 31.3678 24.1397C32.1568 20.603 32.213 14.0199 31.3497 10.5378Z"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22.4633 17.3385L15.064 13.0947V21.5822L22.4633 17.3385Z"
                stroke="#A3A3A3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <p className="m-0 flex-shrink-0 max-[1100px]:text-left max-[768px]:text-center">
          © 2025 Photography. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
