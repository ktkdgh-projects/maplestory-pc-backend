export const configs = () => {
    const env = process.env;
    if (!env) {
        return {};
    }

    return {
        MONGODB_URI: env.MONGODB_URI,
        JWT_SECRET_KEY: env.JWT_SECRET_KEY,
        JWT_ACCESS_SECRET_KEY: env.JWT_ACCESS_SECRET_KEY,
        JWT_REFRESH_SECRET_KEY: env.JWT_REFRESH_SECRET_KEY,
        JWT_ACCESS_TOKEN_TIME: env.JWT_ACCESS_TOKEN_TIME,
        JWT_REFRESH_TOKEN_TIME: env.JWT_REFRESH_TOKEN_TIME,
        INTERATIONS: env.INTERATIONS,
        DKLEN: env.DKLEN,
        HASH: env.HASH,
        AUTH_SERVER_URL: env.AUTH_SERVER_URL,
        EVENT_SERVER_URL: env.EVENT_SERVER_URL
    };
};