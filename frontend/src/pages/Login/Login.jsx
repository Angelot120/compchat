import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email.trim());
    formData.append("password", password.trim());

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/login",
        formData
      );

      if (response.data.success) {
        const token = response.data.data.token;
        toast.success("Connexion réussie !");
        localStorage.setItem("token", token);
        setTimeout(() => {
          setLoading(false);
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response.data.message);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="login-container">
        <div className="login-left">
          <div className="login-content">
            <div className="login-header">
              <h1 className="login-title">Bienvenue sur CompChat</h1>
              <p className="login-subtitle">
                Connectez-vous pour accéder à votre espace de communication interne
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <Input
                type="email"
                label="Email"
                placeholder="votre.email@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />

              <Input
                type="password"
                label="Mot de passe"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />

              <div className="login-options">
                <Link to="/forgot-password" className="forgot-password-link">
                  Mot de passe oublié ?
                </Link>
              </div>

              {loading && (
                <div className="login-loading">
                  <LoadingIndicator />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !email || !password}
                className="login-submit-btn"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>

              <div className="login-footer">
                <p className="login-footer-text">
                  Vous n'avez pas encore de compte ?{" "}
                  <Link to="/registration" className="login-link">
                    Créer un compte
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="login-right">
          <div className="login-illustration">
            <div className="illustration-content">
              <h2>Communication simplifiée</h2>
              <p>
                CompChat vous permet de communiquer efficacement avec vos collègues
                dans un environnement sécurisé et professionnel.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">💬</span>
                  <span>Messages en temps réel</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📁</span>
                  <span>Partage de fichiers</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">👥</span>
                  <span>Gestion de groupes</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Sécurité renforcée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
