const config = require("./config.js");

const getUrl = () => {
  return (
    "https://airapi.airly.eu/v2/measurements/point?lat=" +
    config.LAT +
    "&lng=" +
    config.LNG
  );
};

const formatLM_Response = (response) => {
  const smogIndex = getSmogIndex(response.current);
  const temperatureValue = findValues(response.current.values, "TEMPERATURE");
  const humidityValue = findValues(response.current.values, "HUMIDITY");
  const pressureValue = findValues(response.current.values, "PRESSURE");
  const smogHistory = getSmogHistory(response.history);
  const temperatureHistory = getTemperatureHistory(response.history);

  const frames = [
    smogIndex ? getSmogIndexFrame(smogIndex) : undefined,
    smogHistory ? getHistoryFrame(smogHistory) : undefined,
    smogIndex ? getSmogAdviceFrame(smogIndex) : undefined,
    temperatureValue ? getTemperatureFrame(temperatureValue) : undefined,
    temperatureHistory ? getHistoryFrame(temperatureHistory) : undefined,
    humidityValue ? getHumidityFrame(humidityValue) : undefined,
    pressureValue ? getPressureFrame(pressureValue) : undefined
  ]
    .filter(frame => frame !== undefined)
    .reduce((accumulator, current) => {
      return [
        ...accumulator,
        {
          ...current,
          index: accumulator.length
        }
      ];
    }, []);

  return {
    frames
  };
};

const prepareRequest = () => ({
  method: "GET",
  headers: {
    Accept: "application/json",
    apikey: config.AIRLY_API_KEY
  }
});

const getSmogIndex = (measurement) =>
  measurement.indexes.find(index => index.name === "AIRLY_CAQI");

const findValues = (values, valueName) =>
  values.find(value => value.name === valueName).value;

const getPressureFrame = (pressureValue) => ({
  text: pressureValue.toString(),
  icon: "i20767"
});

const getHumidityFrame = (humidityValue) => ({
  goalData: {
    start: 0,
    current: humidityValue.toFixed(0),
    end: 100,
    unit: "%"
  },
  icon: "i8990"
});

const getTemperatureFrame = (temperatureValue) => ({
  text: temperatureValue.toFixed(1) + " °",
  icon: "i19654"
});

const getSmogAdviceFrame = (smogIndex) => ({
  text: smogIndex.advice
});

const getHistoryFrame = (smogHistory) => ({
  chartData: smogHistory
});

const getSmogIndexFrame = (smogIndex) => ({
  text: smogIndex.value.toString(),
  icon: getCloudIcon(smogIndex.value)
});

const getCloudIcon = (smogIndexValue) => {
  if (smogIndexValue < 25) {
    return "i36268";
  } else if (smogIndexValue < 50) {
    return "i91";
  } else if (smogIndexValue < 75) {
    return "i36266";
  } else {
    return "i36267";
  }
};

const getSmogHistory = (history) =>
  history
    .map(measurement => getSmogIndex(measurement))
    .filter(index => index !== undefined)
    .map(definedIndex => definedIndex.value.toFixed(0));

const getTemperatureHistory = (history) => {
  const temperatureHistory = history
    .map(measurement => findValues(measurement.values, "TEMPERATURE"))
    .filter(value => value !== undefined);
  const minTemperature = temperatureHistory.reduce(
    (accumulator, current) =>
      accumulator === undefined || current < accumulator ? current : accumulator
  );
  const normalization = minTemperature < 0 ? minTemperature : 0;
  return temperatureHistory.map(temperature =>
    ((temperature - normalization) * 10).toFixed(0)
  );
};

exports.getUrl = getUrl;
exports.framesNow = formatLM_Response;
exports.request = prepareRequest;
