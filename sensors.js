const sensors_reading = (snapshot) => {
  const dateKey = Object.keys(snapshot.val())[0];
  const values = snapshot.val()[dateKey];
  return { dateKey, values };
};

const prepareHeaders = (dateKey) => ({
  "Content-type": "text/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET",
  "Access-Control-Max-Age": 2592000,
  "X-Reading-Time": dateKey
});

exports.getReading = sensors_reading;
exports.prepareHeaders = prepareHeaders;