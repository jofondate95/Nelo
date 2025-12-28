
export const FINANCIAL_JARGON = [
  { term: "Arbitrage", def: "Opération consistant à acheter un actif sur un marché pour le revendre immédiatement sur un autre afin de profiter d'un écart de prix." },
  { term: "Bear Market", def: "Un marché baissier, symbolisé par l'ours qui attaque avec ses pattes vers le bas." },
  { term: "Bull Market", def: "Un marché haussier, symbolisé par le taureau qui attaque avec ses cornes vers le haut." },
  { term: "Blockchain", def: "Technologie de stockage et de transmission d'informations, transparente, sécurisée, et fonctionnant sans organe central de contrôle." },
  { term: "Cash-Flow", def: "Flux de trésorerie net d'une entreprise, représentant la différence entre les encaissements et les décaissements." },
  { term: "Dividende", def: "Partie du bénéfice net d'une société distribuée aux actionnaires." },
  { term: "Equity", def: "Fonds propres d'une entreprise, représentant la valeur des actifs possédés par les actionnaires." },
  { term: "Fonds de roulement", def: "Ressources dont dispose l'entreprise pour couvrir ses dépenses courantes avant d'encaisser les paiements de ses clients." },
  { term: "Gearing", def: "Ratio mesurant l'endettement net d'une entreprise par rapport à ses fonds propres." },
  { term: "Hedge Fund", def: "Fonds d'investissement à gestion alternative qui utilise des techniques de gestion non conventionnelles." },
  { term: "IPO", def: "Initial Public Offering (Introduction en Bourse) : première mise en vente d'actions d'une société au public." },
  { term: "Junk Bond", def: "Obligation à haut risque offrant un rendement élevé en raison du risque de défaut important de l'émetteur." },
  { term: "Kachina", def: "En finance, parfois utilisé pour désigner des modèles de prédiction complexes basés sur des cycles." },
  { term: "Levier financier", def: "Utilisation de l'endettement pour augmenter la capacité d'investissement et le rendement potentiel des capitaux propres." },
  { term: "Marché Primaire", def: "Le marché sur lequel les nouveaux titres financiers sont émis pour la première fois." },
  { term: "Marché Secondaire", def: "Le marché sur lequel s'échangent les titres financiers déjà émis (la Bourse)." },
  { term: "Nantissement", def: "Contrat par lequel un débiteur remet un bien (souvent financier) en garantie à son créancier." },
  { term: "Option", def: "Produit dérivé qui donne le droit (mais pas l'obligation) d'acheter ou de vendre un actif à un prix fixé." },
  { term: "Passif", def: "Ensemble des dettes et des capitaux propres qui financent l'actif d'une entreprise." },
  { term: "Quorum", def: "Nombre minimum de membres présents ou représentés requis pour qu'une assemblée puisse délibérer valablement." },
  { term: "Rating", def: "Note attribuée par une agence de notation à un émetteur de dette pour évaluer sa solvabilité." },
  { term: "Swap", def: "Contrat d'échange de flux financiers entre deux parties (ex: taux fixe contre taux variable)." },
  { term: "Trésorerie", def: "Ensemble des disponibilités monétaires d'une entreprise à un moment donné." },
  { term: "Usufruit", def: "Droit d'utiliser un bien et d'en percevoir les revenus sans en être le propriétaire." },
  { term: "Volatilité", def: "Mesure de l'ampleur des variations du cours d'un actif financier sur une période donnée." },
  { term: "Warrant", def: "Produit dérivé émis par une banque permettant d'acheter ou vendre un actif à un prix donné jusqu'à une certaine date." },
  { term: "Yield", def: "Le rendement d'un investissement, exprimé en pourcentage de son coût ou de sa valeur actuelle." },
  { term: "Zero-coupon bond", def: "Obligation qui ne paie pas d'intérêts périodiques mais qui est émise avec une forte décote." }
];

export const OFFLINE_PROTOCOL_DOC = `
# Protocole Nelo Offline
L'architecture utilise un Monotonic Counter pour prévenir la double dépense. 
Les signatures ECDSA assurent l'intégrité des transactions hors-ligne.
`;

export const APP_THEME = { 
  colors: { 
    primary: '#10b981',
    dark: '#0a0a0a',
    light: '#fcfcfc'
  } 
};
