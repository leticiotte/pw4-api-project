import { createLogger, format, transports } from "winston";

// Define os níveis de log personalizados
const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3,
    },
};

// Cria um logger
const logger = createLogger({
    levels: customLevels.levels,
    format: format.combine(
        format.timestamp(),
        format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Saída para o console
        // Pode adicionar outras saídas, como para arquivos
    ],
});

export default logger;
