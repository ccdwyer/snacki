import { Platform } from 'react-native';

import { Alert as AlertWeb } from './Alert.web';
import { Alert as AlertIOS } from './Alert.ios';
import { Alert as AlertBase } from './Alert';

export const Alert = Platform.select({
    web: AlertWeb,
    ios: AlertIOS,
    default: AlertBase,
});

export const AlertAnchor = Alert;
export * from './types';
