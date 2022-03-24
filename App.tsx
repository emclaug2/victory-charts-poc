/**
 Copyright (c) 2021-present, Eaton

 All rights reserved.

 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/
import React, { useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Linking,
    TextStyle,
    ViewStyle,
    View,
    Animated,
    Easing,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Divider, Provider as ThemeProvider, useTheme } from 'react-native-paper';
import * as BLUIThemes from '@brightlayer-ui/react-native-themes';
import { Body1, Header, H4 } from '@brightlayer-ui/react-native-components';
import { Theme } from 'react-native-paper/lib/typescript/types';
import Logo from './assets/images/Logo.svg';
import { BLUIVictoryChartsTheme } from './chart-theme';
import { BLIData } from './data';

import { VictoryScatter, VictoryAxis, VictoryTooltip, VictoryChart, VictoryLine, VictoryTheme, VictoryVoronoiContainer} from "victory-native";

const styles = (
    theme: Theme
): StyleSheet.NamedStyles<{
    content: ViewStyle;
    pxbLogoWrapper: ViewStyle;
    pxbLogo: ViewStyle;
    title: TextStyle;
    subtitle: TextStyle;
    bold: TextStyle;
    divider: ViewStyle;
    openURLButtonText: TextStyle;
}> =>
    StyleSheet.create({
        content: {
            flex: 1,
        },
        pxbLogoWrapper: {
            justifyContent: 'center',
            marginTop: 16,
        },
        pxbLogo: {
            alignSelf: 'center',
            height: 100,
            width: 100,
        },
        title: {
            textAlign: 'center',
            marginBottom: 16,
        },
        subtitle: {
            textAlign: 'center',
        },
        bold: {
            fontWeight: 'bold',
        },
        divider: {
            marginVertical: 24,
        },
        openURLButtonText: {
            color: theme.colors.text,
            padding: 8,
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f5fcff"
        },
        parent: {
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        }
    });

const OpenURLButton = (props: any): JSX.Element => {
    const { url, title } = props;
    const theme = useTheme();
    const defaultStyles = styles(theme);

    const handlePress = useCallback(async () => {
        await Linking.openURL(url);
    }, [url]);

    return (
        <Button
            onPress={(): Promise<void> => handlePress()}
            labelStyle={defaultStyles.openURLButtonText}
            uppercase={false}
        >
            {title}
        </Button>
    );
};

const App = (): JSX.Element => {
    const theme = useTheme();
    const defaultStyles = styles(theme);
    const spinValue = new Animated.Value(0);

    Animated.loop(
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2500,
            easing: Easing.linear,
            useNativeDriver: true,
        })
    ).start();

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });


    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
        "July", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    let minTemp = 999;
    let maxTemp = -999;

    const filteredData = BLIData.filter(data => data.value);
    //  const filteredData = BLIData;
    filteredData.map((data, index) => {
        data.temp = data.value ? Number(data.value) : null;
        data.time = new Date(data.dateTime).getTime();

        if (data.value) {
            if (data.value > maxTemp) {
                maxTemp = Math.round(data.value);
            }
            if (data.value < minTemp) {
                minTemp = Math.round(data.value);
            }
        }
    });


    const graph2 = Array.from(filteredData).slice(0,200);

    // TickValues customization
    //https://codesandbox.io/s/oq8o5o4z2z?file=/index.js:1004-1132


    let xTickValues = filteredData.map(d => {
        return d.time;
    });
    xTickValues = xTickValues.filter((d, i) => i % 200 === 0);

    return (
        <ThemeProvider theme={BLUIThemes.blue}>
            <SafeAreaProvider>
                <Header title={'Brightlayer UI React Native'} />
                <SafeAreaView style={defaultStyles.content}>
                    <ScrollView
                        styles={styles.parent}
                        contentInsetAdjustmentBehavior="automatic">
                        <VictoryChart theme={BLUIVictoryChartsTheme}
                                      containerComponent={<VictoryVoronoiContainer />}
                                      width={400}
                                      height={500}
                                      padding={{
                                          top: 64, bottom: 64, left: 96, right: 64
                                      }}
                                      style={{paddingLeft: 96}}
                        >

                            <VictoryAxis
                                tickValues={xTickValues}
                                tickFormat={x => `${new Date(x).getDate()}. ${monthNames[new Date(x).getMonth()]}`}
                            />

                            <VictoryAxis dependentAxis
                                         tickCount={10}
                                         domain={{y: [minTemp, maxTemp]}}
                                         tickFormat={(y) => `${y}°F`} />


                            <VictoryAxis dependentAxis
                                         offsetX={50}
                                         style={{
                                             marginRight: 10,
                                             axis: {stroke: "transparent"},
                                         }}
                                         tickFormat={(y, i, ticks) => {
                                             if (i === 0 || (i === ticks.length-1)) {
                                                 return `${y / 10}%`;
                                             }
                                         }}/>

                            <VictoryLine data={filteredData}
                                         animate={{
                                             duration: 2000,
                                             onLoad: { duration: 2000 }
                                         }}
                                         style={{
                                             data: { stroke: '#269af4' }
                                         }}
                                         labels={({ datum }) => `Temperature: ${parseFloat(datum.temp).toFixed(2)}°F`}
                                         labelComponent={<VictoryTooltip renderInPortal={false}/>}
                                         x="time" y="temp" />



                        </VictoryChart>


                        <VictoryChart theme={VictoryTheme.material}>
                            <VictoryLine
                                data={[
                                    { x: 1, y: 1 },
                                    { x: 2, y: 3 },
                                    { x: 3, y: 5 },
                                    { x: 4, y: 2 },
                                    { x: 5, y: null },
                                    { x: 6, y: null },
                                    { x: 7, y: 6 },
                                    { x: 8, y: 7 },
                                    { x: 9, y: 8 },
                                    { x: 10, y: 12 }
                                ]}
                            />
                        </VictoryChart>

                        <VictoryChart containerComponent={<VictoryVoronoiContainer />} >
                            <VictoryScatter
                                labelComponent={<VictoryTooltip renderInPortal={false}/>}
                                labels={({ datum }) => datum.y + '0000000000000000'}
                                style={{ data: { fill: ({ datum }) => datum.fill } }}
                                data={[
                                    { x: 1, y: 3 },
                                    { x: 3, y: 5 }
                                ]}
                            />
                        </VictoryChart>

                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </ThemeProvider>
    );
};

export default App;
