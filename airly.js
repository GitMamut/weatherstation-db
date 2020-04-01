const getUrl = () => {
  return (
    "https://airapi.airly.eu/v2/measurements/point?lat=" +
    process.env.LAT +
    "&lng=" +
    process.env.LNG
  );
};

const formatLM_Response = (indexValue) => {
  return {
    frames: [
      {
        text: "" + indexValue,
        icon: "i7066",
        index: 0
      }
    ]
  };
};

function prepareRequest() {
  return {
      method: "GET",
      headers: {
          Accept: "application/json",
          apikey: process.env.AIRLY_API_KEY
      }
  };
}

exports.getUrl = getUrl;
exports.framesNow = formatLM_Response;
exports.request = prepareRequest;
