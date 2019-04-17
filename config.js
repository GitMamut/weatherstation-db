exports.db = {
    apiKey: process.env.apiKey || "",
    authDomain: process.env.authDomain || "",
    databaseURL: process.env.databaseURL || "",
    storageBucket: process.env.storageBucket || "",
    messagingSenderId: process.env.messagingSenderId || "",
};

exports.PORT = process.env.PORT || 5000
