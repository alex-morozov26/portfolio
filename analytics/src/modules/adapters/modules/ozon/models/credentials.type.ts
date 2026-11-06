export type OzonSellerApiCredentials = {
    clientId: string;
    apiKey: string;
}

export type OzonPerformanceApiCredentials = {
    clientId: string;
    clientSecret: string;
}

export type OzonApiCredentials = {
    seller?: OzonSellerApiCredentials;
    performance?: OzonPerformanceApiCredentials;
}