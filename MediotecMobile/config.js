export const API_CONFIG = {
    // URL da API no Netlify (produção)
    PROD_API_URL: 'https://sistemasenac.netlify.app/.netlify/functions/api',
    
    // URL da API local (desenvolvimento)
    DEV_API_URL: 'http://192.168.1.7:3000',
    
    // Define qual URL usar
    getApiUrl: () => {
        const isDev = __DEV__;  // Variável global do React Native
        return isDev ? API_CONFIG.DEV_API_URL : API_CONFIG.PROD_API_URL;
    }
};
