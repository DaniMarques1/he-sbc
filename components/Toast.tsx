"use client";
import { useEffect, useState } from "react";

export function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleShowToast = (e: any) => {
      setMessage(e.detail);
      setVisible(true);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(false), 3500);
    };

    window.addEventListener("show_toast", handleShowToast as any);
    return () => {
      window.removeEventListener("show_toast", handleShowToast as any);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[100] bg-[#1A237E] text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"}`}
    >
      <span className="material-symbols-outlined text-xl" data-icon="task_alt">task_alt</span>
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
