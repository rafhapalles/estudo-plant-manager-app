import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {RectButton, RectButtonProps} from 'react-native-gesture-handler';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentsButtonProps extends RectButtonProps{
    title: string;
    active?: boolean;
}

export function EnvironmentsButton({title, active = false, ...rest}: EnvironmentsButtonProps){
    return(
        <RectButton style={[styles.container, active && styles.containerActive]} {...rest}>
            <Text style={[styles.text, active && styles.textActive]}>
                {title}
            </Text>
        </RectButton>
    );
}

const styles = StyleSheet.create({
    container:{
        height: 40,
        width: 76,
        backgroundColor: colors.shape,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 12,
        marginHorizontal: 5

    },
    containerActive:{
        backgroundColor: colors.green_light
    },
    text:{
       color: colors.heading,
       fontFamily: fonts.text 
    },
    textActive: {
        fontFamily: fonts.heading,
        color: colors.green_dark,

    }
});