export const API_CONFIG = {
    // URL da API no Vercel (produção)
    PROD_API_URL: 'https://sistema-escolar-senac-lvwda6g3m-vilton-edsons-projects.vercel.app',
    
    // URL da API local (desenvolvimento)
    DEV_API_URL: 'http://192.168.1.7:3000',
    
    // Define qual URL usar
    getApiUrl: () => {
        // Forçando o uso da URL de produção
        return API_CONFIG.PROD_API_URL;
    }
};
