import React from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import IntroScreen from "./components/client/IntroScreen";
import ToastContainer from "./components/ui/ToastContainer";
import { useUIStore } from "./store/useUIStore";

export default function App() {
  const { introFinished, setIntroFinished } = useUIStore();

  return (
    <>
      {!introFinished && <IntroScreen onFinished={() => setIntroFinished(true)} />}
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}
