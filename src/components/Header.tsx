import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {loadStorageUserName} from '../libs/storage';
import userImage from '../assets/foto.png';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header(){
    const [userName, setUserName] = useState<string>();

    async function loadData(){
        var user = await loadStorageUserName(); 
        setUserName(user);
    }

    useEffect(()=>{
        loadData();
    },[]);

    return(
        <View style={styles.container}>

            <View>
                <Text style={styles.greeting}> Olá,</Text>
                <Text style={styles.userName}> {userName} </Text>              
            </View>

            <Image style={styles.userImage} source={userImage}/>

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: getStatusBarHeight(),        
        paddingTop: 20
    },
    greeting:{
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.text
    },
    userName:{
        fontSize: 32,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 40
    },
    userImage:{
        width:70,
        height:70,
        borderRadius: 50
    }
});


