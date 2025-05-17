export const configs = () => {
    const env = process.env;
    if (!env) {
        return {};
    }

    return {
        MONGODB_URI: env.MONGODB_URI,
    };
};