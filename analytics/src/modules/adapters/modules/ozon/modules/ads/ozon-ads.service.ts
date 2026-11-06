import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

interface OzonPerformanceTokenData {
    token: string;
    expiresAt: number;
}

@Injectable()
export class OzonAdsService {
    private readonly logger = new Logger(OzonAdsService.name);
    private readonly loginUrl = 'https://api-performance.ozon.ru/api/client/token';
    private readonly refreshBuffer = 3 * 60 * 1000;

    private tokensMap: Map<string, OzonPerformanceTokenData> = new Map();
    private refreshPromises: Map<string, Promise<void>> = new Map();

    async getPerformanceToken(clientId: string, clientSecret: string, dataSourceId: string): Promise<string> {
        const tokenData = this.tokensMap.get(dataSourceId);

        if (!tokenData || Date.now() >= tokenData.expiresAt - this.refreshBuffer) {
            if (!this.refreshPromises.has(dataSourceId)) {
                const refreshPromise = this.refreshToken(clientId, clientSecret, dataSourceId);
                this.refreshPromises.set(dataSourceId, refreshPromise);
                refreshPromise.finally(() => this.refreshPromises.delete(dataSourceId));
            }

            await this.refreshPromises.get(dataSourceId);
            const refreshedToken = this.tokensMap.get(dataSourceId);
            return refreshedToken!.token;
        }

        return tokenData.token;
    }

    private async refreshToken(clientId: string, clientSecret: string, dataSourceId: string): Promise<void> {
        this.logger.warn('Авторизационный токен Ozon Performance API устарел! Получение нового токена!');
        try {
            const payload = {
                client_id: clientId, 
                client_secret: clientSecret, 
                grant_type: "client_credentials"
            };

            const { data } = await axios.post(this.loginUrl, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            this.tokensMap.set(dataSourceId, {
                token: data.access_token,
                expiresAt: Date.now() + data.expires_in * 1000
            });

            this.logger.log('Авторизационный токен Ozon Performance API получен успешно!');
        } catch (error) {
            this.logger.error('Ошибка при получении авторизационного токена Ozon Performance API!', error);
            throw error;
        }
    }
}
