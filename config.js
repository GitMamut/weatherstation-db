exports.db = {
    apiKey: process.env.apiKey || "",
    authDomain: process.env.authDomain || "",
    databaseURL: process.env.databaseURL || "",
    storageBucket: process.env.storageBucket || "",
    messagingSenderId: process.env.messagingSenderId || "",
};

exports.PORT = process.env.PORT || 5000

exports.pm10_icons = ["i18018", "i18019", "i18020", "i18021", "i18022"];
exports.pm10_scale = 50.0;

exports.pm2_5_icons = ["i18023", "i18024", "i18025", "i18026", "i18027"];
exports.pm2_5_scale = 25.0;
