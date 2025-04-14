import cron from 'node-cron';
//import { updateCharacters } from '../services/characterService';

export const startCronJob = () => {
  cron.schedule('* * * * *', async () => { // Ejecuta cada minuto para pruebas
    console.log('Running cron job to update characters...');
    try {
      //await updateCharacters();
      console.log('Characters updated successfully.');
    } catch (error) {
      console.error('Error updating characters:', error);
    }
  });
};

// Función para ejecutar el cron job manualmente
export const runCronJobManually = async () => {
  console.log('Running cron job manually...');
  try {
    //await updateCharacters();
    console.log('Characters updated successfully (manual execution).');
  } catch (error) {
    console.error('Error updating characters (manual execution):', error);
  }
};