const prepare_LM_frames_out = (snapshot) => {
  const dateKey = Object.keys(snapshot.val())[0];
  const values = snapshot.val()[dateKey];
  const temp_outside = values.outdoor_temperature;
  return {
      frames: [
          {
              text: temp_outside + "°",
              icon: "i7066",
              index: 0
          }
      ]
  };
}

const prepare_LM_frames_out_history = (snapshot) => {
  const values = Object.keys(snapshot.val())
      .map(dateKey => snapshot.val()[dateKey]["outdoor_temperature"])
      .map(floatValue => parseInt(floatValue * 10));
  const minValue = values.reduce((prev, curr) => {
      return curr < prev ? curr : prev;
  }, values[0]);
  var processedValues = values;
  if (minValue < 0) {
      processedValues = values.map(value => value - minValue);
  }
  const temp_outside = values[values.length - 1] / 10;
  return {
      frames: [
          {
              text: temp_outside + "°",
              icon: "i7066",
              index: 0
          },
          {
              chartData: processedValues,
              index: 1
          }
      ]
  };
}


exports.framesNow = prepare_LM_frames_out;
exports.framesHistory = prepare_LM_frames_out_history;
