import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Alert} from 'react-native';
import { Header } from '../components/Header';
import { PlantProps, loadPlants } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { ptBR } from 'date-fns/locale';
import { Load } from '../components/Load';
import { plantRemove } from '../libs/storage';

import waterDrop from '../assets/waterdrop.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';


export function MyPlants(){
    const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextWaterd, setNextWaterd] = useState<string>();    
    const [hasAnyPlant, setHasAnyPlant] = useState(false);    

    function handleRemove(plant: PlantProps){
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`,
        [
            {
                text: 'Não 🙏',
                style: 'cancel'
            },
            {
                text: 'Sim 😪',
                onPress: onConfirmeRemove(plant)
            }
        ])
    }

    function onConfirmeRemove(plant: PlantProps): ((value?: string | undefined) => void) | undefined {
        return async () => {
            try {                
                await plantRemove(plant);

                var novaLista = myPlants.filter((item) => item.id !== plant.id);
                setMyPlants(novaLista);
                setHasAnyPlant(novaLista.length > 0);
            } catch (error) {
            }
        };
    }

    async function loadStorageData(){
        try {
            const plantsStorage = await loadPlants();

            setHasAnyPlant(plantsStorage.length > 0);

            if (hasAnyPlant){            
                const nextTime = formatDistance(
                    new Date(plantsStorage[0].dateTimeNotification).getTime(),
                    new Date().getTime(),
                    {locale: ptBR}
                );
        
                setNextWaterd(`Não esqueça de regar a ${plantsStorage[0].name} daqui á ${nextTime}.`);
                setMyPlants(plantsStorage);

            } else 
                setNextWaterd(`Você ainda não tem nenhuma plantinha para regar`);
            
            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {       
        loadStorageData();
    },[hasAnyPlant]);

    if (loading)
        return <Load/>

    return(
        <View style={styles.container}>
            <Header/>  

            <View style={styles.spotlight}>
                <Image source={waterDrop} style={styles.spotlightImagem}/>
                <Text style={styles.spotlightText}>
                    {nextWaterd}
                </Text>
            </View>                 
                <View style={styles.plants}>
                    { hasAnyPlant && <Text style={styles.plantsTitle}> Próximas regadas. </Text> }    
                    <FlatList
                        data={myPlants}
                        keyExtractor={(item)=> String(item.id)}
                        renderItem={({item})=>(
                            <PlantCardSecondary data={item} handleRemove={() => {handleRemove(item)}}/>                        
                        )}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{flex:1}}
                    />
                </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
       flex:1,
       alignItems: 'center',
       justifyContent: 'space-between',
       paddingHorizontal: 30,
       paddingTop: 50,
       backgroundColor: colors.background
    },
    spotlight:{
        backgroundColor: colors.blue_light,        
        marginTop: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    spotlightImagem:{
        width:60,
        height:60
    },
    spotlightText:{
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20
    },
    plants:{
        flex: 1,
        width: '100%'
    },
    plantsTitle:{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20   
    }
});

