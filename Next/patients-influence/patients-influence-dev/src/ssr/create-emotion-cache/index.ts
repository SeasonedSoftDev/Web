import createCache from '@emotion/cache';

const createEmotionCache = () => createCache({ key: 'css' });

export default createEmotionCache;
