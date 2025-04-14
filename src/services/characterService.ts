import { Character } from '../models/character';
import { Op } from 'sequelize';
import { redisClient } from '../config/redis';

interface CharacterFilters {
    status?: string;
    species?: string;
    gender?: string;
    name?: string;
    origin?: string;
}

export const characterService = {
    async searchCharacters(filters: CharacterFilters) {
        const { status, species, gender, name, origin } = filters;
        const cacheKey = `characters:${JSON.stringify(filters)}`;

        const cachedResult = await redisClient.get(cacheKey);
        if (cachedResult) {
            return JSON.parse(cachedResult);
        }
        const query = {
            where: {
                ...(status && { status }),
                ...(species && { species }),
                ...(gender && { gender }),
                ...(name && { name: { [Op.iLike]: `%${name}%` } }),
                ...(origin && { origin }),
            },
        };

        const characters = await Character.findAll(query);

        await redisClient.set(cacheKey, JSON.stringify(characters), 'EX', 3600); // Cache for 1 hour

        return characters;
    },

    async populateInitialData() {
        const initialCharacters = [
            { name: 'Rick Sanchez', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth' },
            { name: 'Morty Smith', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth' },
            { name: 'Summer Smith', status: 'Alive', species: 'Human', gender: 'Female', origin: 'Earth' },
            { name: 'Beth Smith', status: 'Alive', species: 'Human', gender: 'Female', origin: 'Earth' },
            { name: 'Jerry Smith', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth' },
            { name: 'Mr. Meeseeks', status: 'Alive', species: 'Meeseeks', gender: 'Male', origin: 'Unknown' },
            { name: 'Birdperson', status: 'Alive', species: 'Birdperson', gender: 'Male', origin: 'Bird World' },
            { name: 'Evil Morty', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth' },
            { name: 'Squanchy', status: 'Alive', species: 'Cat Person', gender: 'Male', origin: 'Squanch Planet' },
            { name: 'Mr. Poopybutthole', status: 'Alive', species: 'Unknown', gender: 'Male', origin: 'Unknown' },
            { name: 'Tammy Guetermann', status: 'Deceased', species: 'Human', gender: 'Female', origin: 'Earth' },
            { name: 'Noob-Noob', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth' },
            { name: 'Jessica', status: 'Alive', species: 'Human', gender: 'Female', origin: 'Earth' },
            { name: 'Unity', status: 'Alive', species: 'Unknown', gender: 'Female', origin: 'Unknown' },
            { name: 'Gearhead', status: 'Alive', species: 'Human', gender: 'Male', origin: 'Earth' },
        ];

        await Character.bulkCreate(initialCharacters);
    },

    async updateCharacters() {
        const characters = await Character.findAll();
        const updatedCharacters = characters.map((character) => {
            character.status = character.status === 'Alive' ? 'Deceased' : 'Alive';
            return character.save();
        });

        await Promise.all(updatedCharacters);
    }
};