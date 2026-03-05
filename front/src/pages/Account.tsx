import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Anchor,
  Paper,
  PasswordInput,
  Group,
  Checkbox,
  Button,
} from "@mantine/core";
import classes from '../styles/account/AuthenticationTitle.module.css';
import FloatingLabelInput from '../components/inputs/FloatingLabelInput';

export default function Account() {

  const [email, setEmail] = useState("");

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Connectez vous !
      </Title>

      <Text className={classes.subtitle}>
       Vous n'avez pas de compte ? <Anchor>Créer un compte</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">

        {/* INPUT EMAIL FLOATING */}
        <FloatingLabelInput
          label="Email"
          placeholder="exemple@exemple.com"
          value={email}
          onChange={setEmail}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          radius="md"
        />

        <Group justify="space-between" mt="lg">
          <Checkbox label="Se souvenir de moi" />
          <Anchor component="button" size="sm">
            Mot de passe oublié ?
          </Anchor>
        </Group>

        <Button fullWidth mt="xl" radius="md">
          Se connecter
        </Button>

      </Paper>
    </Container>
  );
}