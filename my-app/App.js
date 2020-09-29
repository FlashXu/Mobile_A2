import React from "react";
import { Pedometer } from "expo-legacy";
import { StyleSheet, Text, View, Button } from "react-native";



export default class App extends React.Component {
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0
  };

  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    delete this._subscription;
  }

  init = async () => {
    let isPedometerAvailable = false;
    try {
      isPedometerAvailable = await Pedometer.isAvailableAsync();
      this.setState({ isPedometerAvailable: String(isPedometerAvailable) });
    } catch ({ message }) {
      this.setState({ isPedometerAvailable: `Could not get isPedometerAvailable: ${message}` });
    }
    if (isPedometerAvailable) {
      this._subscription = Pedometer.watchStepCount(result => {
        this.setState({
          currentStepCount: result.steps
        });
      });
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);
      try {
        const { steps } = await Pedometer.getStepCountAsync(start, end);
        this.setState({ pastStepCount: steps });
      } catch ({ message }) {
        this.setState({ pastStepCount: `Could not get stepCount: ${message}` });
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}
        </Text>
        <Text>
          Steps taken in the last 24 hours: {this.state.pastStepCount}
        </Text>
        <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
        <Button title="INIT" onPress={this.init} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    alignItems: "center",
    justifyContent: "center"
  }
});
