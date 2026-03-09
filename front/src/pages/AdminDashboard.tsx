import { useState } from 'react';
import { Container, Paper, Text, Title } from '@mantine/core';
import { NavbarMinimal, type AdminTab } from '../components/adminDashboard/NavbarMinimal';
import AccountsTab from '../components/adminDashboard/Accounts/AccountsTab';

function DashboardTab() {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={2}>Dashboard</Title>
      <Text c="dimmed" mt="xs">
        Onglet par défaut du dashboard admin.
      </Text>
    </Paper>
  );
}

function PlaceholderTab({ title }: { title: string }) {
  return (
    <Paper withBorder radius="md" p="lg">
      <Title order={2}>{title}</Title>
      <Text c="dimmed" mt="xs">
        Onglet en attente de construction.
      </Text>
    </Paper>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <NavbarMinimal activeTab={activeTab} onTabChange={setActiveTab} />

      <Container fluid style={{ flex: 1, padding: '24px' }}>
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'accounts' && <AccountsTab />}
        {activeTab === 'analytics' && <PlaceholderTab title="Analytics" />}
        {activeTab === 'releases' && <PlaceholderTab title="Releases" />}
        {activeTab === 'security' && <PlaceholderTab title="Security" />}
      </Container>
    </div>
  );
}