import ErrorPage from "../../pages/ErrorPage";

export default function Error401() {
  return (
    <ErrorPage
      code="401"
      title="Connexion requise"
      description="Tu dois être connecté pour accéder à cette page."
      buttonLabel="Se connecter"
      to="/account"
    />
  );
}