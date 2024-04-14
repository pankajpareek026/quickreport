import { config as dotEnvConfig } from "dotenv";
dotEnvConfig()

const _config = {
    mongoUrl: process.env.MONGODB_URL,
    jwtKey: process.env.JWT_KEY,
    appMode: process.env.APP_MODE,
    debugMode: process.env.DEBUG_MODE,
    cloudName: process.env.CLOUD_NAME,
    cloudApiKey: process.env.CLOUD_API_KEY,
    cloudApiKeySecret: process.env.CLOUD_API_SECRET,
    maxFileSize: process.env.MAX_FILE_SIZE,
    port: process.env.PORT,
    corsOrigin: process.env.CORS_ORIGIN,
    resendAPIKey: process.env.RESEND_API_KEY



}

export const config = Object.freeze(_config);
