import { useState, type FormEvent } from "react";

type FormState = { name: string; email: string; message: string };
type SendState = "idle" | "loading" | "success" | "error";

export default function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    message: "",
  });
  const [state, setState] = useState<SendState>("idle");
  const [error, setError] = useState<string | null>(null);

  const validate = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Email is invalid.";
    if (form.message.trim().length < 5)
      return "Message must be at least 5 characters.";
    return null;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      setState("error");
      return;
    }

    try {
      setState("loading");
      const res = await fetch("http://localhost:5002/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || `Server error (${res.status})`);
      }

      setState("success");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
      setState("error");
    }
  };

  return (
    <section id="contact" className="px-5 py-20 text-white">
      <div className="mx-auto w-full max-w-[1224px]">
        <div className="flex items-start justify-between gap-[58px] max-lg:flex-col max-lg:gap-15 max-lg:items-center">
          {/* Left — Info (kept intact) */}
          <div className="flex-1 max-w-[509px] w-full max-lg:max-w-[600px]">
            <h2 className="font-['Bebas Neue',_sans-serif] text-[50px] leading-[1] font-normal text-[rgba(255,216,162,0.83)] mb-[38px]">
              Let&apos;s Connect
            </h2>

            <p className="text-[16.32px] leading-[1.76] mb-[38px]">
              I&apos;m always interested in new projects, collaborations, or
              just a friendly chat about photography and art.
            </p>

            <div className="flex flex-col gap-[42px]">
              {/* Phone */}
              <div className="flex items-center gap-[17px]">
                <div className="w-[52.8px] h-[52.8px] min-w-[52.8px] rounded-full bg-[rgba(9,13,18,0.39)] flex items-center justify-center">
                  <svg
                    width="30"
                    height="29"
                    viewBox="0 0 30 29"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M26.9789 20.4939V24.0876C26.9803 24.4212 26.912 24.7514 26.7783 25.0571C26.6447 25.3628 26.4486 25.6372 26.2028 25.8627C25.957 26.0882 25.6667 26.26 25.3507 26.3668C25.0347 26.4737 24.6998 26.5134 24.3675 26.4834C20.6814 26.0829 17.1406 24.8233 14.0296 22.8058C11.1353 20.9666 8.68142 18.5128 6.84224 15.6184C4.81777 12.4933 3.55789 8.93533 3.16469 5.23263C3.13476 4.90137 3.17412 4.56751 3.28029 4.2523C3.38645 3.93709 3.55709 3.64744 3.78133 3.40179C4.00557 3.15614 4.2785 2.95987 4.58275 2.82548C4.887 2.69109 5.2159 2.62152 5.54851 2.62121H9.14221C9.72356 2.61549 10.2872 2.82135 10.7279 3.20043C11.1687 3.57951 11.4566 4.10594 11.538 4.6816C11.6897 5.83166 11.971 6.96087 12.3765 8.0477C12.5377 8.47645 12.5726 8.94243 12.4771 9.3904C12.3815 9.83837 12.1596 10.2496 11.8375 10.5753L10.3162 12.0966C12.0214 15.0956 14.5046 17.5787 17.5036 19.284L19.0249 17.7627C19.3506 17.4406 19.7618 17.2186 20.2098 17.1231C20.6577 17.0276 21.1237 17.0624 21.5525 17.2236C22.6393 17.6292 23.7685 17.9105 24.9186 18.0621C25.5005 18.1442 26.0319 18.4373 26.4118 18.8857C26.7917 19.3341 26.9935 19.9064 26.9789 20.4939Z"
                      stroke="#FFD8A2"
                      strokeOpacity="0.83"
                      strokeWidth="1.9965"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <address className="not-italic">
                  <span className="block text-[14.28px] font-medium leading-[1.68] mb-[5px]">
                    Phone
                  </span>
                  <a
                    href="tel:+15551234567"
                    className="text-[16.32px] leading-[1.76] hover:underline"
                  >
                    +1 (555) 123-4567
                  </a>
                </address>
              </div>

              {/* Email */}
              <div className="flex items-center gap-[17px]">
                <div className="w-[52.8px] h-[52.8px] min-w-[52.8px] rounded-full bg-[rgba(9,13,18,0.39)] flex items-center justify-center">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.41677 5.61768H24.5832C25.9009 5.61768 26.979 6.69579 26.979 8.01348V22.3883C26.979 23.706 25.9009 24.7841 24.5832 24.7841H5.41677C4.09908 24.7841 3.02097 23.706 3.02097 22.3883V8.01348C3.02097 6.69579 4.09908 5.61768 5.41677 5.61768Z"
                      stroke="#FFD8A2"
                      strokeOpacity="0.83"
                      strokeWidth="1.9965"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M26.979 8.0127L15 16.398L3.02097 8.0127"
                      stroke="#FFD8A2"
                      strokeOpacity="0.83"
                      strokeWidth="1.9965"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <address className="not-italic">
                  <span className="block text-[14.28px] font-medium leading-[1.68] mb-[5px]">
                    Email
                  </span>
                  <a
                    href="mailto:contact@photographer.com"
                    className="text-[16.32px] leading-[1.76] hover:underline"
                  >
                    contact@photographer.com
                  </a>
                </address>
              </div>

              {/* Location */}
              <div className="flex items-center gap-[17px]">
                <div className="w-[52.8px] h-[52.8px] min-w-[52.8px] rounded-full bg-[rgba(9,13,18,0.39)] flex items-center justify-center">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_227_1587)">
                      <path
                        d="M25.7812 12.4051C25.7812 20.7904 15.0001 27.9778 15.0001 27.9778C15.0001 27.9778 4.21896 20.7904 4.21896 12.4051C4.21896 9.5458 5.35483 6.80358 7.37667 4.78173C9.39852 2.75989 12.1407 1.62402 15.0001 1.62402C17.8594 1.62402 20.6016 2.75989 22.6235 4.78173C24.6453 6.80358 25.7812 9.5458 25.7812 12.4051Z"
                        stroke="#FFD8A2"
                        strokeOpacity="0.83"
                        strokeWidth="1.9965"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.9999 15.9979C16.9846 15.9979 18.5936 14.389 18.5936 12.4042C18.5936 10.4195 16.9846 8.81055 14.9999 8.81055C13.0151 8.81055 11.4062 10.4195 11.4062 12.4042C11.4062 14.389 13.0151 15.9979 14.9999 15.9979Z"
                        stroke="#FFD8A2"
                        strokeOpacity="0.83"
                        strokeWidth="1.9965"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_227_1587">
                        <rect
                          width="28.7496"
                          height="28.7496"
                          fill="white"
                          transform="translate(0.625214 0.425781)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <address className="not-italic">
                  <span className="block text-[14.28px] font-medium leading-[1.68] mb-[5px]">
                    Location
                  </span>
                  <p className="text-[16.32px] leading-[1.76] m-0">
                    San Francisco, California
                  </p>
                </address>
              </div>
            </div>
          </div>

          {/* Right — Form (posts to xengeland.az) */}
          <form
            className="flex-1 max-w-[509px] w-full max-lg:max-w-[600px] flex flex-col"
            onSubmit={onSubmit}
          >
            {/* Name */}
            <div className="mb-[29px]">
              <label
                htmlFor="name"
                className="block text-[14.28px] font-medium mb-2"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="John Doe"
                className="h-[59.52px] w-full rounded-[10px] bg-[rgba(139,139,139,0.11)] border border-[#d4d4d4] px-[19.2px] py-[14.4px] text-[16px] placeholder:text-[#a0a0a0] outline-none focus:ring-2 focus:ring-[rgba(255,216,162,0.83)]"
              />
            </div>

            {/* Email */}
            <div className="mb-[29px]">
              <label
                htmlFor="email"
                className="block text-[14.28px] font-medium mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm((s) => ({ ...s, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="h-[59.52px] w-full rounded-[10px] bg-[rgba(139,139,139,0.11)] border border-[#d4d4d4] px-[19.2px] py-[14.4px] text-[16px] placeholder:text-[#a0a0a0] outline-none focus:ring-2 focus:ring-[rgba(255,216,162,0.83)]"
              />
            </div>

            {/* Message */}
            <div className="mb-[29px]">
              <label
                htmlFor="message"
                className="block text-[14.28px] font-medium mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                placeholder="Write your message…"
                className="min-h-[175px] w-full rounded-[10px] bg-[rgba(139,139,139,0.11)] border border-[#d4d4d4] px-[19.2px] py-[14.4px] text-[16px] placeholder:text-[#a0a0a0] resize-y outline-none focus:ring-2 focus:ring-[rgba(255,216,162,0.83)]"
              />
            </div>

            {/* Feedback messages */}
            {state === "success" && (
              <p className="text-green-400">Your message has been sent!</p>
            )}
            {state === "error" && error && (
              <p className="text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full h-[60px] rounded-[10px] bg-[#171717] text-[#ffe30d] text-[16px] font-normal mt-[15px] transition-colors hover:bg-[#333] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {state === "loading" ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
