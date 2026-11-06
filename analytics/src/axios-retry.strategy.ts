import { Logger } from '@nestjs/common';
import axios from 'axios';
import axiosRetry from 'axios-retry';

export class AxiosRetryStrategy {
    static readonly MAX_RETRIES = 5

    static apply() {
        const logger = new Logger(AxiosRetryStrategy.name);

        axiosRetry(axios, {
            retries: AxiosRetryStrategy.MAX_RETRIES,
            retryDelay: (retryCount, error) => {
                const delay = error.response?.status === 429 
                    ? Math.min(1000 * Math.pow(2, retryCount), 15000)
                    : Math.min(1000 * retryCount, 5000);

                return delay;
            },
            retryCondition: (error) => {
                const config = error.config as any;
                const retryState = config?.['axios-retry'];
                const retryCount = retryState?.retryCount ?? 0;

                const status = error.response?.status;
                const method = config?.method?.toUpperCase();
                const url = config?.url?.split('?')[0];

                
                if (retryCount === 0) {
                    logger.error(
                        `Запрос завершился с ошибкой: ${method} ${url} -> ${status ?? 'Нет ответа'}`
                    );
                }

                if (!error.response) return true;
                if (error.response.status === 429) return true;
                if (error.response.status >= 500) return true;
                return false;
            },
            onRetry(retryCount, error, requestConfig) {
                const status = error.response?.status;
                const method = requestConfig.method?.toUpperCase();
                const url = requestConfig.url?.split('?')[0];

                logger.warn(
                    `Повтор ${retryCount}/${AxiosRetryStrategy.MAX_RETRIES}: ${method} ${url} -> ${status ?? 'Нет ответа'}`
                );
            }
        });
    }
}