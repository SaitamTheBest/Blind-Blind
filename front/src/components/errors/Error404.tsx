import ErrorPage from "../../pages/ErrorPage";

export default function Error404() {
  return (
    <ErrorPage
      code="404"
      title="Oups... cette page n'existe pas"
      description="Soit l'adresse est incorrecte, soit la page a disparu dans les limbes du site web."
      buttonLabel="Retour à l'accueil"
      to="/"
    />
  );
}