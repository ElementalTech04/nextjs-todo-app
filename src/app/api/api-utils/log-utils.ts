export const LogInfo = (message: string) => {
    console.log(`Info: ${message}`);
}

export const LogError = (message: string, source: string, error: Error) => {
    console.error(`Error: Error occurred from source ${source} with error ${message}: ${error}`);
}

export const LogWarning = (message: string) => {
    console.warn(`Warning: ${message}`);
}

export const LogSuccess = (message: string) => {
    console.log(`Success: ${message}`);
}

module.exports = {
    LogInfo,
    LogError,
    LogWarning,
    LogSuccess
}