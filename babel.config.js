module.exports = function(api) {
<<<<<<< HEAD
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
=======
    api.cache(true);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            [
                "module-resolver",
                {
                    "root": ["./src"],
                    "alias": {
                        "@assets/*": "./src/assets/*"
                    }
                }
            ],
            [
                "module:react-native-dotenv", {
                    "moduleName": "react-native-dotenv",
                    "path": ".env",
                    "blacklist": null,
                    "whitelist": null,
                    "safe": false,
                    "allowUndefined": true
                }
            ]
        ],
        env: {
            production: {
                plugins: ['react-native-paper/babel'],
            },
        },
    };
};
>>>>>>> cdcaa6e (Initialize expo app)
