import { Category } from '../enums/category';

export interface Client {
  category: Category;
  types: string[];
}
