import React from 'react';
import wateringImg from '../assets/watering.png'
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import {Feather} from '@expo/vector-icons'

import {
    SafeAreaView, 
    Text, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions, 
    View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function Welcome(){
    const navigation = useNavigation();

    function handlerStart(){
        navigation.navigate('UserIdentification');
    }

    return(
        <SafeAreaView style={styles.container}>

            <View style={styles.wrapper}>
                <Text style={styles.title}>
                    Gerencie {'\n'} 
                    suas plantas de{'\n'} 
                    forma fácil
                </Text>

                <Image 
                    style={styles.image} source={wateringImg}
                    resizeMode='contain'
                />
    
                <Text style={styles.subtitle}>
                    Não esqueça mais de regar suas plantas.
                    Nós cuidamos de lembrar você sempre que precisar.
                </Text>

                <TouchableOpacity 
                    style={styles.button} 
                    activeOpacity={0.7} 
                    onPress={handlerStart}
                >                
                    <Feather name='chevron-right'style={styles.buttonIcon}/>
                </TouchableOpacity>    

            </View>            
        </SafeAreaView>        
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    wrapper:{
        flex: 1,
        alignItems:'center',
        justifyContent:'space-around',
        paddingHorizontal: 20
    },    
    title:{
        fontFamily: fonts.heading,
        fontSize:28,
        textAlign: 'center',
        color: colors.heading,
        marginTop: 38,
        lineHeight: 34
    },
    subtitle:{
        fontFamily: fonts.text,
        textAlign: 'center',
        fontSize:18,
        fontWeight:'bold',
        paddingHorizontal: 20,
        color: colors.heading,
        lineHeight: 30
    },
    image:{       
       height: Dimensions.get('window').width * 0.7
    },
    button:{
        backgroundColor: colors.green,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        marginBottom: 10,
        height: 56,
        width:56
     },
     buttonIcon:{        
        fontSize: 32,
        color:colors.white
     }
 
});
