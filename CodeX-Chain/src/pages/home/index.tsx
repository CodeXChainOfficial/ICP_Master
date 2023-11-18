import { Navigate } from "react-router-dom";

const Home = () => {
  return (
    <main>
      <section>Home</section>

      <Navigate to="launchpad" replace={true} />
    </main>
  );
};

export default Home;
