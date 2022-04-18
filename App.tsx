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
import { BLI_Channel_1, BLI_Channel_2 } from './data';

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

    const filteredDataC1 = BLI_Channel_1.filter(data => data.value);
    //   const filteredData = BLIData;
    filteredDataC1.map((data, index) => {
        data.value = data.value ? Number(data.value) : null;
        data.time = new Date(data.dateTime).getTime();
    });

   const filteredDataC2 = BLI_Channel_2.filter(data => data.value);
   //   const filteredData = BLIData;
    filteredDataC2.map((data, index) => {
        data.value = data.value ? Number(data.value) : null;
        data.time = new Date(data.dateTime).getTime();
    });

    console.log(filteredDataC1.length);
    console.log(filteredDataC2.length);

    // find maxima for normalizing data
    const maximaC1 = Math.max(...filteredDataC1.map((d) => d.value));
    const minimaC1 = Math.min(...filteredDataC1.map((d) => d.value));
    const maximaC2 = Math.max(...filteredDataC2.map((d) => d.value));

    // TickValues customization
    //https://codesandbox.io/s/oq8o5o4z2z?file=/index.js:1004-1132


    let xTickValues = filteredDataC2.map(d => {
        return d.time;
    });
    xTickValues = xTickValues.filter((d, i) => i % 200 === 0);





    const data = [
        [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }],
        [{ x: 1, y: 400 }, { x: 2, y: 350 }, { x: 3, y: 300 }, { x: 4, y: 250 }],
        [{ x: 1, y: 75 }, { x: 2, y: 85 }, { x: 3, y: 95 }, { x: 4, y: 100 }]
    ];
// find maxima for normalizing data
    const maxima = data.map(
        (dataset) => Math.max(...dataset.map((d) => d.y))
    );

    const xOffsets = [50, 200, 350];
    const tickPadding = [ 0, 0, -15 ];
    const anchors = ["end", "end", "start"];
    const colors = ["black", "red", "blue"];






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
                                          top: 64, bottom: 64, left: 150, right: 64
                                      }}
                        >

                            <VictoryAxis
                                tickValues={xTickValues}
                                tickFormat={x => `${new Date(x).getDate()}. ${monthNames[new Date(x).getMonth()]}`}
                            />

                            {
                                /*<VictoryAxis dependentAxis
                                         offsetX={50}
                                         style={{
                                             marginRight: 10,
                                             axis: {stroke: "transparent"},
                                         }}
                                         tickFormat={(y, i, ticks) => {
                                             if (i === 0 || (i === ticks.length-1)) {
                                                 return `${y / 10}%`;
                                             }
                                         }}/> */
                            }

                            <VictoryAxis dependentAxis
                                         tickCount={10}
                                         offsetX={100}
                                         style={{
                                             marginRight: 10,
                                             axis: {stroke: "transparent"},
                                         }}
                                         tickFormat={(t) => `${(t * maximaC1).toFixed(4)}M%`} />
                            <VictoryLine data={filteredDataC1}
                                         animate={{
                                             duration: 2000,
                                             onLoad: { duration: 2000 }
                                         }}
                                         style={{
                                             data: { stroke: 'orange' }
                                         }}
                                         labels={({ datum }) => `Temperature: ${parseFloat(datum.value).toFixed(2)}°F`}
                                         labelComponent={<VictoryTooltip renderInPortal={false}/>}
                                         x="time"
                                        // normalize data
                                        y={(datum) => {
                                            return (datum.value-minimaC1) / (maximaC1-minimaC1);
                                        }} />

                                <VictoryAxis dependentAxis
                                             tickCount={10}
                                             tickFormat={(t) => `${Math.round(t * maximaC2)}°F`} />
                                <VictoryLine data={filteredDataC2}
                                animate={{
                                duration: 2000,
                                onLoad: { duration: 2000 }
                            }}
                                style={{
                                data: { stroke: '#269af4' }
                            }}
                                labels={({ datum }) => `Temperature: ${parseFloat(datum.value).toFixed(2)}°F`}
                                labelComponent={<VictoryTooltip renderInPortal={false}/>}
                                x="time"
                                // normalize data
                                y={(datum) => datum.value / maximaC2} />



                        </VictoryChart>


                        <VictoryChart theme={VictoryTheme.material}>
                            <VictoryLine
                                data={[
                                    { x: 1, y: 1200 },
                                    { x: 2, y: 1300 },
                                    { x: 3, y: 1500 },
                                    { x: 4, y: 2000 },
                                    { x: 5, y: null },
                                    { x: 6, y: null },
                                    { x: 7, y: 1200 },
                                    { x: 8, y: 1700 },
                                    { x: 9, y: 1800 },
                                    { x: 10, y: 1200 }
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

                        <VictoryChart
                            theme={VictoryTheme.material}
                            width={400} height={400}
                            domain={{ y: [0, 1] }}
                        >
                            <VictoryAxis />
                            {data.map((d, i) => (
                                <VictoryAxis dependentAxis
                                             key={i}
                                             offsetX={xOffsets[i]}
                                             style={{
                                                 axis: { stroke: colors[i] },
                                                 ticks: { padding: tickPadding[i] },
                                                 tickLabels: { fill: colors[i], textAnchor: anchors[i] }
                                             }}
                                    // Use normalized tickValues (0 - 1)
                                             tickValues={[0.25, 0.5, 0.75, 1]}
                                    // Re-scale ticks by multiplying by correct maxima
                                             tickFormat={(t) => t * maxima[i]}
                                />
                            ))}
                            {data.map((d, i) => (
                                <VictoryLine
                                    key={i}
                                    data={d}
                                    style={{ data: { stroke: colors[i] } }}
                                    // normalize data
                                    y={(datum) => datum.y / maxima[i]}
                                />
                            ))}
                        </VictoryChart>

                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </ThemeProvider>
    );
};

export default App;
