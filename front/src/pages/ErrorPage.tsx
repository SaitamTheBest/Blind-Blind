import { Button, Container, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import styles from "../styles/errors/ErrorPage.module.css";

interface ErrorPageProps {
  code: string;
  title: string;
  description: string;
  buttonLabel?: string;
  to?: string;
}

export default function ErrorPage({
  code,
  title,
  description,
  buttonLabel,
  to = "/",
}: ErrorPageProps) {
  return (
    <Container className={styles.container}>
      <div className={styles.code}>{code}</div>

      <Title order={2} className={styles.title}>
        {title}
      </Title>

      <Text className={styles.description}>{description}</Text>

      {buttonLabel && (
        <Button
          component={Link}
          to={to}
          variant="unstyled"
          className={styles.button}
        >
          {buttonLabel}
        </Button>
      )}
    </Container>
  );
}