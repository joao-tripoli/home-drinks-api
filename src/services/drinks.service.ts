import {
  CreateDrinkDTO,
  DrinkDTO,
  PaginatedResponseDTO,
  UpdateDrinkDTO,
} from '@/dtos/drinks.dto';
import { prisma } from '@/lib/prisma';
import { logger } from '@/utils/logger';
import { Drink } from '@prisma/client';

export class DrinksService {
  public async getAllDrinks(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponseDTO<DrinkDTO>> {
    try {
      const skip = (page - 1) * limit;

      const [drinks, total] = await Promise.all([
        prisma.drink.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.drink.count(),
      ]);

      return {
        data: drinks.map(this.mapDrinkToDTO),
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error fetching drinks', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to fetch drinks');
    }
  }

  public async getDrinkById(id: string): Promise<DrinkDTO | null> {
    try {
      const drink = await prisma.drink.findUnique({
        where: { id },
      });

      return drink ? this.mapDrinkToDTO(drink) : null;
    } catch (error) {
      logger.error('Error fetching drink by ID', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: id,
      });
      throw new Error('Failed to fetch drink');
    }
  }

  public async getDrinksByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponseDTO<DrinkDTO>> {
    try {
      const skip = (page - 1) * limit;

      const [drinks, total] = await Promise.all([
        prisma.drink.findMany({
          where: { category },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.drink.count({
          where: { category },
        }),
      ]);

      return {
        data: drinks.map(this.mapDrinkToDTO),
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error fetching drinks by category', {
        error: error instanceof Error ? error.message : 'Unknown error',
        category,
      });
      throw new Error('Failed to fetch drinks by category');
    }
  }

  public async searchDrinks(
    query: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponseDTO<DrinkDTO>> {
    try {
      const skip = (page - 1) * limit;

      const [drinks, total] = await Promise.all([
        prisma.drink.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } },
              { ingredients: { has: query } },
            ],
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.drink.count({
          where: {
            OR: [
              { name: { contains: query } },
              { description: { contains: query } },
              { ingredients: { has: query } },
            ],
          },
        }),
      ]);

      return {
        data: drinks.map(this.mapDrinkToDTO),
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Error searching drinks', {
        error: error instanceof Error ? error.message : 'Unknown error',
        query,
      });
      throw new Error('Failed to search drinks');
    }
  }

  public async createDrink(drinkData: CreateDrinkDTO): Promise<DrinkDTO> {
    try {
      const drink = await prisma.drink.create({
        data: drinkData,
      });

      logger.info('Drink created successfully', { drinkId: drink.id });
      return this.mapDrinkToDTO(drink);
    } catch (error) {
      logger.error('Error creating drink', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to create drink');
    }
  }

  public async uploadDrinkImage(
    drinkId: string,
    imageUrl: string
  ): Promise<DrinkDTO | null> {
    try {
      const drink = await prisma.drink.update({
        where: { id: drinkId },
        data: { imageUrl },
      });

      logger.info('Drink image uploaded successfully', {
        drinkId,
        imageUrl,
      });
      return this.mapDrinkToDTO(drink);
    } catch (error) {
      logger.error('Error uploading drink image', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId,
      });
      throw new Error('Failed to upload drink image');
    }
  }

  public async updateDrink(
    id: string,
    drinkData: UpdateDrinkDTO
  ): Promise<DrinkDTO | null> {
    try {
      const drink = await prisma.drink.update({
        where: { id },
        data: drinkData,
      });

      logger.info('Drink updated successfully', { drinkId: id });
      return this.mapDrinkToDTO(drink);
    } catch (error) {
      logger.error('Error updating drink', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: id,
      });
      throw new Error('Failed to update drink');
    }
  }

  public async deleteDrink(id: string): Promise<boolean> {
    try {
      await prisma.drink.delete({
        where: { id },
      });

      logger.info('Drink deleted successfully', { drinkId: id });
      return true;
    } catch (error) {
      logger.error('Error deleting drink', {
        error: error instanceof Error ? error.message : 'Unknown error',
        drinkId: id,
      });
      throw new Error('Failed to delete drink');
    }
  }

  private mapDrinkToDTO(drink: Drink): DrinkDTO {
    return {
      id: drink.id,
      name: drink.name,
      description: drink.description || undefined,
      category: drink.category,
      ingredients: drink.ingredients,
      instructions: drink.instructions,
      imageUrl: drink.imageUrl || undefined,
      createdAt: drink.createdAt.toISOString(),
      updatedAt: drink.updatedAt.toISOString(),
    };
  }
}
