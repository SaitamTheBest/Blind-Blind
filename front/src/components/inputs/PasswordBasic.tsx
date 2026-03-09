import { useMemo, useState } from 'react';
import { PasswordInput, type PasswordInputProps } from '@mantine/core';
import classes from '../../styles/components/inputs/FloatingLabelInput.module.css';

type PasswordBasicProps = Omit<
  PasswordInputProps,
  'classNames' | 'value' | 'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
};

export default function PasswordBasic({
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: PasswordBasicProps) {
  const [focused, setFocused] = useState(false);

  const floating = useMemo(
    () => value.trim().length !== 0 || focused,
    [value, focused]
  );

  return (
    <PasswordInput
  {...props}
  classNames={classes}
  value={value}
  placeholder={floating ? props.placeholder : ''}
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