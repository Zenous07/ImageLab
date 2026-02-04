"use client";

import { useSidebar } from "@/context/SidebarContext";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <main 
      className={`min-h-screen mt-16 transition-all duration-300 overflow-x-hidden ${
        isOpen ? "ml-64" : "ml-0"
      }`}
      style={{
        width: isOpen ? "calc(100% - 16rem)" : "100%",
      }}
    >
      {children}
    </main>
  );
}
