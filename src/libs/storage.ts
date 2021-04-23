import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import * as Notifications from 'expo-notifications';

export interface EnvironmentProps{
    key: string;
    title: string;
}

export interface PlantProps{
    id: number;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
      times: number;
      repeat_every: string;
    },
    hour: string;
    dateTimeNotification: Date;  
}

export interface StoragePlantProps{
    [id: string]:{
        data: PlantProps;
        notificationId: string;
    }
}

const fields = {
    user:'@plantmanager:user',
    plants:'@plantmanager:plants'
}

export async function plantSave(plant: PlantProps) : Promise<void>{
    try {          
        const nextTime = new Date(plant.dateTimeNotification);
        const now = new Date();
        const {times, repeat_every} = plant.frequency;

        if (repeat_every === 'week')        {
            const interval = Math.trunc(7 / times);
            nextTime.setDate(now.getDate() + interval);
        } else 
            nextTime.setDate(nextTime.getDate() + 1);      

        const seconds = Math.abs(
            Math.ceil(((now.getTime() - nextTime.getTime()) / 1000))
        );

        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heeyy, 🌱',
                body: `Está na hora de cuidar da sua ${plant.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data: {plant},
            },
            trigger:{
                seconds: seconds < 60 ? 60 : seconds,
                repeats: true    
            }
        });


        const oldPlants = await loadStoragePlants();

        const newPlant = {
            [plant.id]:{
                data: plant,
                notificationId
            }
        }

        await AsyncStorage.setItem(fields.plants,
            JSON.stringify({
                ...newPlant,
                ...oldPlants
            })
        )

    } catch (error) {
        throw new Error('Não foi possível salvar a planta!');
    }
}

export async function plantUpdate(plants: StoragePlantProps) : Promise<void>{
    try {
        AsyncStorage.setItem(fields.plants,JSON.stringify(plants));
    } catch (error) {
        throw new Error('Ocorreu um erro ao Atualizar a planta.')
    }
}

export async function plantRemove(plant: PlantProps) : Promise<void>{
    try {        
        const plants = await loadStoragePlants(); 
        await Notifications.cancelScheduledNotificationAsync(plants[plant.id].notificationId);
        
        delete plants[plant.id];
        plantUpdate(plants);
    } catch (error) {
        throw new Error(error);
    }
}

async function loadStoragePlants() : Promise<StoragePlantProps>{
    try {
        var data = await AsyncStorage.getItem(fields.plants);
        return data ? (JSON.parse(data) as StoragePlantProps): {};            
    } catch (error) {
        throw new Error('Não foi possível carregar as plantas!')
    }
}

export async function loadPlants() : Promise<PlantProps[]>{
    try {
         const plants = await loadStoragePlants();

         const plantsSorted = Object
            .keys(plants)   
            .map((plant) =>{
                return {
                    ...plants[plant].data,
                    hour: format(new Date(plants[plant].data.dateTimeNotification),'HH:mm')
                }  
            })
            .sort((a,b) => 
                Math.floor(
                    new Date(a.dateTimeNotification).getTime() / 1000 - 
                    Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
                )
            );

         return plantsSorted;
    } catch (error) {
        throw new Error('Não foi possível carregar as plantas!');
    }
}

export async function loadStorageUserName() : Promise<string>{    
    try {
        const user = await AsyncStorage.getItem(fields.user);
        return user || '';            
    } catch (error) {
        throw new Error('Não foi possível salvar o seu nome!');                
    }
}
    
export async function setUserOnStorage(user: string) : Promise<void>{
    try {
        await AsyncStorage.setItem(fields.user,user);        
    } catch (error) {
        throw new Error('Não foi possível recuperar o seu nome!');        
    }    
}    
