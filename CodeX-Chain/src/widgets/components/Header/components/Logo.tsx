import { Link } from "react-router-dom";
import codeX from "../assets/codeX.svg";

export const Logo = () => {
  return (
    <Link to="/" style={{ marginLeft: "20px",  }}>
      <img src={codeX} alt="" />
    </Link>
  );
};
