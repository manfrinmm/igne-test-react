import "./App.css";

import { ToastContainer } from "react-toastify";

import Main from "./pages/Main";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Main />
      <ToastContainer />
    </>
  );
}
