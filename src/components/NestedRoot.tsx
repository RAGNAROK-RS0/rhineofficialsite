import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function NestedRoot(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white/20">
      <Header />

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
