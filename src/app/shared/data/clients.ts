import { Client } from '../../core/interfaces/client';

export const clients: Client[] = [
  {
    category: 'particulier',
    types: ['Locataire', 'Acheteur', 'Vendeur', 'Autre'],
  },
  {
    category: 'professionnel',
    types: ['Agent immobilier', 'Banquier', 'Notaire', 'Autre'],
  },
];
