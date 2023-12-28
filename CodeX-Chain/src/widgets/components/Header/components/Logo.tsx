import { Link } from "react-router-dom";
import codeX from "../assets/codeX.svg";

export const Logo = () => {
  return (
      <a href="https://codexchain.xyz">
      <img src={codeX} alt="" />
    </a>
  );
};
