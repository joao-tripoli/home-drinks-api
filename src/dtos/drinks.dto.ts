export interface DrinkDTO {
  id: string;
  name: string;
  description?: string;
  category: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDrinkDTO {
  name: string;
  description?: string;
  category: string;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
}

export interface UpdateDrinkDTO {
  name?: string;
  description?: string;
  category?: string;
  ingredients?: string[];
  instructions?: string;
  imageUrl?: string;
}

export interface DrinksListResponseDTO {
  drinks: DrinkDTO[];
  total: number;
  page: number;
  limit: number;
}
