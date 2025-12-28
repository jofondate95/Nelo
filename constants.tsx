
export const OFFLINE_PROTOCOL_DOC = `
# Protocole Nelo Offline

## 1. Structure de l'Architecture (Atomic Design)
- atoms/: Boutons, Icons, Badges
- molecules/: ModeSelector, LogItem, BalanceCard
- organisms/: NfcActionCenter, TransactionList
- templates/: MainLayout
- pages/: HomeScreen, SettingsScreen

## 2. Gestion de la Double Dépense
Le "Monotonic Counter" (Compteur Monotone) est la clé de la sécurité hors-ligne :
1. Chaque transaction générée localement inclut C = C + 1.
2. La signature cryptographique (ECDSA) couvre l'ID_Tx, le Montant et ce Compteur.
3. Lors de la synchronisation (ou vérification par le terminal marchand) :
   - Si C_reçu <= C_dernier_validé : REJET (Tentative de Replay / Double Dépense).
   - Si C_reçu > C_dernier_validé : VALIDATION.

## 3. Schéma de Données (MMKV/WatermelonDB)
{
  id: string (PK),
  payload_json: string (Signed Blob),
  status: 'PENDING' | 'SYNCED',
  created_at: timestamp
}
`;

export const APP_THEME = {
  colors: {
    background: '#050505',
    surface: '#111111',
    primary: '#10b981', // Emerald 500
    accent: '#0ea5e9', // Sky 500
  }
};
