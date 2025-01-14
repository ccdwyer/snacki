// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const OriginalResolver = require('metro-resolver');
const { withNativeWind } = require('nativewind/metro');

const webBlacklistedModules = ['react-native-maps'];

/** @type {import('expo/metro-config').MetroConfig} */
// eslint-disable-next-line no-undef
const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && webBlacklistedModules.includes(moduleName)) {
        return {
            type: 'empty',
        };
    }
    // Default behavior for other module resolutions
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css', inlineRem: 16 });
