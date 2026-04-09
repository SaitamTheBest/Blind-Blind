import ErrorPage from "../../pages/ErrorPage";

export default function Error503() {
  return (
    <ErrorPage
      code="503"
      title="Maintenance en cours"
      description="Le site est temporairement indisponible. Reviens un peu plus tard."
      buttonLabel="Réessayer"
      to="/"
    />
  );
}