import { Category } from '../../core/enums/category';
import { Client } from '../../core/interfaces/client';

export const clients: Client[] = [
  {
    category: Category.PARTICULIER,
    types: ['Locataire', 'Acheteur', 'Vendeur', 'Autre'],
  },
  {
    category: Category.PROFESSIONNEL,
    types: ['Agent immobilier', 'Banquier', 'Notaire', 'Autre'],
  },
];
