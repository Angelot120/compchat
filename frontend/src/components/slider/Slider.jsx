import React, { useEffect } from "react";
import { toast } from "react-toastify";

export default function Slider() {
  useEffect(() => {
    const group = axios
      .get()
      .then((res) => res.data)
      .then((data) => setGroup(data))
      .catch((err) => {
        console.log(err);
        toast.error("Une erreur est survenue lors du chargement des données !");
      });
  }, []);
  return <div></div>;
}
