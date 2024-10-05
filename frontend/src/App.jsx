import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Input from "./components/input/Input";
import Button from "./components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import LoadingIndicator from "./components/loading/LoadingIndicator";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const fromData = new FormData();
    fromData.append("email", email);
    fromData.append("password", password);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/login",
        fromData
      );

      if (response.data.success) {
        const token = response.data.data.token;

        toast.success("Bienvenue parmis nous " + email);
        localStorage.setItem("token", token);
        setTimeout(function () {
          setLoading(false);
          navigate("/dashboard");
        }, 3500);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
      console.log("Error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer stacked position="bottom-left" />
      <div className="login ">
        <div className="login-card">
          <div className="login-left-items">
            <h1 className="login-title">Connexion</h1>

            <form onSubmit={handleSubmit}>
              <p className="login-sub-title">
                Connectez-vous et rejoignez la communautée.{" "}
              </p>
              <Input
                label={""}
                reference={"email"}
                type={"email"}
                placeholder={" Email"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                inputClassName={"login-input"}
              />

              <br />

              <Input
                label={""}
                reference={"password"}
                type={"password"}
                placeholder={" Mot de passe"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                inputClassName={"login-input"}
              />

              <p>Mot de passe oublié ?</p>
              {loading && <LoadingIndicator />}
              <div>
                <Button
                  disabled={loading}
                  type={"submit"}
                  text={loading ? "Traitement..." : "Se connecter"}
                  className={"login-btn"}
                />
              </div>
              <br />
              <div className="registration-link">
                Vous n’avez pas encore de compte ?{" "}
                <Link to={"/registration"}>Créer</Link>
              </div>
              <br />
            </form>
          </div>

          <div className="login-right-items">
            <h2>Welcome back!</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eaque
              facilis rem nulla modi totam, ex nemo eius praesentium saepe,
              voluptatem consequuntur sunt dolores, reprehenderit nihil non
              asperiores accusamus vel similique?
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
