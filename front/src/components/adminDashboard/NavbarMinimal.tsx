import {
  IconCalendarStats,
  IconDeviceDesktopAnalytics,
  IconFingerprint,
  IconGauge,
  IconUser,
  IconMusic,
  IconVinyl,
} from '@tabler/icons-react';
import { Avatar, Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import LogoBlindBlind from '../../res/Blind-Blind-logo-noir.png';
import classes from '../../styles/adminDashboard/NavbarMinimal.module.css';

export type AdminTab =
  | 'dashboard'
  | 'analytics'
  | 'songs'
  | 'library'
  | 'releases'
  | 'accounts'
  | 'security';

interface NavbarLinkProps {
  icon: React.ComponentType<{ size?: number; stroke?: number }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

interface NavbarMinimalProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        aria-label={label}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const navItems: { icon: NavbarLinkProps['icon']; label: string; value: AdminTab }[] = [
  { icon: IconGauge, label: 'Dashboard', value: 'dashboard' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics', value: 'analytics' },
  { icon: IconUser, label: 'Accounts', value: 'accounts' },
  { icon: IconMusic, label: 'Submissions', value: 'songs' },
  { icon: IconVinyl, label: 'Library', value: 'library' },
  { icon: IconFingerprint, label: 'Security', value: 'security' },
  { icon: IconCalendarStats, label: 'Releases', value: 'releases' },
];

export function NavbarMinimal({ activeTab, onTabChange }: NavbarMinimalProps) {
  const links = navItems.map((item) => (
    <NavbarLink
      key={item.value}
      icon={item.icon}
      label={item.label}
      active={item.value === activeTab}
      onClick={() => onTabChange(item.value)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
        <Avatar src={LogoBlindBlind} size={28} radius="xl" />
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>
    </nav>
  );
}