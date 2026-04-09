import ErrorPage from "../../pages/ErrorPage";

export default function Error500() {
  return (
    <ErrorPage
      code="500"
      title="Erreur serveur"
      description="Le serveur a rencontré un problème. On s’en occupe."
      buttonLabel="Retour à l'accueil"
      to="/"
    />
  );
}