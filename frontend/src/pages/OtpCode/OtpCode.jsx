import { React, useState } from "react";
import { useLocation } from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import LoadingIndicator from "../../components/loading/LoadingIndicator";

export default function OtpCode() {
  const location = useLocation();
  const email = location.state ? location.state.email : null;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fromData = new FormData();

    if (isNaN(otp)) {
      setLoading(false);
      toast.error("Veuillez saisir des chiffres !");
      return;
    }

    fromData.append("email", email);
    fromData.append("otpCode", otp);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1.0.0/check/otp-code",
        fromData
      );

      if (response.data.success) {
        toast.success("Bienvenue parmis nous " + email);
        setTimeout(function () {
          setLoading(false);
          navigate("/");
        }, 3500);
      } else {
        if (response.data.status) {
          setLoading(false);
          toast.error("Code de vérification invalide !");
          return;
        }
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
    <div>
      <ToastContainer stacked position="bottom-left" />

      <h3>Confirmation l'email</h3>
      <p>
        Un code OTP de 6 chiffres vous a été envoyé sur {email} vérifiez votre
        boîte mail.
      </p>
      <form action="" onSubmit={handleSubmit}>
        <Input
          label={"Code Otp"}
          reference={"otpCode"}
          type={"number"}
          value={otp}
          placeholder={"Saisir le code otp ici..."}
          onChange={(e) => {
            setOtp(e.target.value);
          }}
        />
        {loading && <LoadingIndicator />}
        <br />
        <Button
          disabled={loading}
          type={"submit"}
          text={loading ? "Chargement ..." : "Vérifier"}
        />
      </form>
    </div>
  );
}
