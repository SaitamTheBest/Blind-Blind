import { useMemo, useState } from 'react';
import { TextInput, type TextInputProps } from '@mantine/core';
import classes from '../../styles/components/inputs/FloatingLabelInput.module.css';

type FloatingLabelInputProps = Omit<TextInputProps, 'classNames' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
};

export default function FloatingLabelInput({
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: FloatingLabelInputProps) {
  const [focused, setFocused] = useState(false);

  const floating = useMemo(() => value.trim().length !== 0 || focused, [value, focused]);

  return (
    <TextInput
      {...props}
      classNames={classes}
      value={value}
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
  );
}