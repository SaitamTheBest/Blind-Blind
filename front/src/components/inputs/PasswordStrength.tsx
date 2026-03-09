import { useMemo, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import {
  Box,
  Center,
  Group,
  PasswordInput,
  Progress,
  Text,
  type PasswordInputProps,
} from '@mantine/core';
import classes from '../../styles/components/inputs/FloatingLabelInput.module.css';

function PasswordRequirement({ meets, label }: { meets: boolean; label: string }) {
  return (
    <Text component="div" c={meets ? 'teal' : 'red'} mt={5} size="sm">
      <Center inline>
        {meets ? <IconCheck size={14} stroke={1.5} /> : <IconX size={14} stroke={1.5} />}
        <Box ml={7}>{label}</Box>
      </Center>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Inclut un chiffre' },
  { re: /[a-z]/, label: 'Inclut une minuscule' },
  { re: /[A-Z]/, label: 'Inclut une majuscule' },
  { re: /[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?`~]/, label: 'Inclut un caractère spécial' },
];

function getLengthBars(password: string) {
  const length = password.length;

  if (length >= 12) return 4;
  if (length >= 8) return 3;
  if (length >= 4) return 2;
  return 1;
}

function getBarColor(activeBars: number) {
  if (activeBars >= 4) return 'teal';
  if (activeBars >= 3) return 'lime';
  if (activeBars >= 2) return 'yellow';
  return 'red';
}

type PasswordStrengthProps = Omit<
  PasswordInputProps,
  'classNames' | 'value' | 'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
};

export default function PasswordStrength({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  ...props
}: PasswordStrengthProps) {
  const [focused, setFocused] = useState(false);

  const floating = useMemo(
    () => value.trim().length !== 0 || focused,
    [value, focused]
  );

  const hasStartedTyping = value.trim().length > 0;
  const activeBars = getLengthBars(value);
  const barColor = getBarColor(activeBars);

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(value)}
    />
  ));

  const bars = Array(4)
    .fill(0)
    .map((_, index) => (
      <Progress
        key={index}
        styles={{ section: { transitionDuration: '150ms' } }}
        value={index < activeBars ? 100 : 0}
        color={barColor}
        size={4}
        aria-label={`Password strength segment ${index + 1}`}
      />
    ));

  return (
    <div>
      <PasswordInput
        {...props}
        classNames={classes}
        value={value}
        placeholder={floating ? placeholder : ''}
        onChange={(event) => onChange(event.currentTarget.value)}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        data-floating={floating || undefined}
        labelProps={{ 'data-floating': floating || undefined }}
      />

      {hasStartedTyping && (
        <>
          <Group gap={5} grow mt="xs" mb="md">
            {bars}
          </Group>

          <PasswordRequirement label="Au moins 8 caractères" meets={value.length >= 8} />
          {checks}
        </>
      )}
    </div>
  );
}