/**
 Copyright (c) 2021-present, Eaton

 All rights reserved.

 This code is licensed under the BSD-3 license found in the LICENSE file in the root directory of this source tree and at https://opensource.org/licenses/BSD-3-Clause.
 **/
import React, { useCallback, useState } from 'react';
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
import CheckBox from 'react-native-check-box';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Divider, Provider as ThemeProvider, useTheme } from 'react-native-paper';
import * as BLUIThemes from '@brightlayer-ui/react-native-themes';
import { Body1, Header, H4 } from '@brightlayer-ui/react-native-components';
import { Theme } from 'react-native-paper/lib/typescript/types';
import Logo from './assets/images/Logo.svg';
import { BLUIVictoryChartsTheme } from './chart-theme';
import { BLI_Channel_1, BLI_Channel_2 } from './data';
import {
    VictoryScatter,
    VictoryAxis,
    VictoryTooltip,
    VictoryChart,
    VictoryLine,
    VictoryTheme,
    VictoryVoronoiContainer,
} from 'victory-native';

const styles = (
    theme: Theme
): StyleSheet.NamedStyles<{
    content: ViewStyle;
    title: TextStyle;
}> =>
    StyleSheet.create({
        content: {
            flex: 1,
        },
        title: {
            textAlign: 'center',
            marginBottom: 16,
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5fcff',
        },
        parent: {
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

const App = (): JSX.Element => {
    const theme = useTheme();
    const defaultStyles = styles(theme);
    const [isSelected, setSelection] = useState(false);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const filteredDataC1 = BLI_Channel_1.filter((data) => data.value);
    //   const filteredData = BLIData;
    filteredDataC1.map((data, index) => {
        data.value = data.value ? Number(data.value) : null;
        data.time = new Date(data.dateTime).getTime();
    });

    const filteredDataC2 = BLI_Channel_2.filter((data) => data.value);
    //   const filteredData = BLIData;
    filteredDataC2.map((data, index) => {
        data.value = data.value ? Number(data.value) : null;
        data.time = new Date(data.dateTime).getTime();
    });

    // find maxima for normalizing data
    const maximaC1 = Math.max(...filteredDataC1.map((d) => d.value));
    const minimaC1 = Math.min(...filteredDataC1.map((d) => d.value));
    const maximaC2 = Math.max(...filteredDataC2.map((d) => d.value));

    // TickValues customization
    //https://codesandbox.io/s/oq8o5o4z2z?file=/index.js:1004-1132

    let xTickValues = filteredDataC2.map((d) => {
        return d.time;
    });
    xTickValues = xTickValues.filter((d, i) => i % 200 === 0);

    return (
        <ThemeProvider theme={BLUIThemes.blue}>
            <SafeAreaProvider>
                <Header title={'Brightlayer UI React Native'} />
                <SafeAreaView style={defaultStyles.content}>
                    <ScrollView styles={styles.parent} contentInsetAdjustmentBehavior="automatic">
                        <VictoryChart
                            theme={BLUIVictoryChartsTheme}
                            containerComponent={<VictoryVoronoiContainer />}
                            width={400}
                            height={500}
                            padding={{
                                top: 64,
                                bottom: 64,
                                left: 120,
                                right: 64,
                            }}
                        >
                            <VictoryAxis
                                tickValues={xTickValues}
                                tickFormat={(x) => `${new Date(x).getDate()}. ${monthNames[new Date(x).getMonth()]}`}
                            />
                            <VictoryAxis
                                dependentAxis
                                tickCount={10}
                                offsetX={80}
                                style={{
                                    marginRight: 10,
                                    axis: { stroke: 'transparent' },
                                }}
                                tickFormat={(t) => `${(t * (maximaC1 - minimaC1) + minimaC1).toFixed(3)}%`}
                            />
                            <VictoryLine
                                data={filteredDataC1}
                                animate={{
                                    duration: 2000,
                                    onLoad: { duration: 2000 },
                                }}
                                style={{
                                    data: { stroke: 'orange' },
                                }}
                                labels={({ datum }) => `Temperature: ${parseFloat(datum.value).toFixed(2)}°F`}
                                labelComponent={<VictoryTooltip renderInPortal={false} />}
                                x="time"
                                // normalize data
                                y={(datum) => {
                                    return (datum.value - minimaC1) / (maximaC1 - minimaC1);
                                }}
                            />

                            {isSelected && (
                                <View>
                                    <VictoryAxis
                                        dependentAxis
                                        tickCount={10}
                                        tickFormat={(t) => `${Math.round(t * maximaC2)}°F`}
                                    />
                                    <VictoryLine
                                        data={filteredDataC2}
                                        animate={{
                                            duration: 2000,
                                            onLoad: { duration: 2000 },
                                        }}
                                        style={{
                                            data: { stroke: '#269af4' },
                                        }}
                                        labels={({ datum }) => `Temperature: ${parseFloat(datum.value).toFixed(2)}°F`}
                                        labelComponent={<VictoryTooltip renderInPortal={false} />}
                                        x="time"
                                        // normalize data
                                        y={(datum) => datum.value / maximaC2}
                                    />
                                </View>
                            )}
                        </VictoryChart>
                        <CheckBox
                            onClick={() => {
                                setSelection(!isSelected);
                            }}
                            isChecked={isSelected}
                            onValueChange={setSelection}
                            style={styles.checkbox}
                        />
                    </ScrollView>
                </SafeAreaView>
            </SafeAreaProvider>
        </ThemeProvider>
    );
};

export default App;
