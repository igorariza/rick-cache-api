import { IResolvers } from '@graphql-tools/utils';
import { Character } from '../models/character';
import { getCachedCharacters, setCachedCharacters } from '../services/cacheService';


export const resolvers: IResolvers = {
  Query: {
    characters: async (_, { status, species, gender, name, origin }) => {
      const cacheKey = `characters:${JSON.stringify({ status, species, gender, name, origin })}`;
      const cachedData = await getCachedCharacters(cacheKey);

      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const filters: any = {};
      if (status) filters.status = status;
      if (species) filters.species = species;
      if (gender) filters.gender = gender;
      if (name) filters.name = { $like: `%${name}%` };
      if (origin) filters.origin = origin;

      const characters = await Character.findAll({ where: filters });
      if (!characters || characters.length === 0) {
        return [];
      }
      const characterData = characters.map((character) => ({
        id: character.id,
        name: character.name,
        status: character.status,
        species: character.species,
      }));

      await setCachedCharacters(cacheKey, JSON.stringify(characterData), 3600);
      return characterData;
    },
  },
};