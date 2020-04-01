const prepare_LM_frames_pm = (snapshot) => {
  const dateKey = Object.keys(snapshot.val())[0];
  const values = snapshot.val()[dateKey];
  const pm2_5 = values.espeasy_PM2_5;
  const mp2_5_percent = pm2_5 / config.pm2_5_scale * 100.0;
  const pm2_5_iconIndex = Math.min(parseInt(pm2_5 / config.pm2_5_scale * 4.0), 4);
  const pm10 = values.espeasy_PM10;
  const mp10_percent = pm10 / config.pm10_scale * 100.0;
  const pm10_iconIndex = Math.min(parseInt(pm10 / config.pm10_scale * 4.0), 4);
  return {
      frames: [
          {
              text: mp2_5_percent.toFixed(1) + "%",
              icon: config.pm2_5_icons[pm2_5_iconIndex],
              index: 0
          },
          {
              text: mp10_percent.toFixed(1) + "%",
              icon: config.pm10_icons[pm10_iconIndex],
              index: 1
          }
      ]
  };
}

exports.framesNow = prepare_LM_frames_pm;
