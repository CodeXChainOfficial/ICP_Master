// App.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./widgets/components/Header";

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
