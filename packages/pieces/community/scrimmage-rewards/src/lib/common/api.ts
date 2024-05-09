import { HttpMethod } from '@activepieces/pieces-common';
import { IPlayerDTO, IQuestTemplateDTO, PaginationContainer, ProcessableEventType } from '@scrimmage/schemas';
import {
  GiveQuestDto,
  GiveQuestResponseDto,
  GiveQuestsDto,
  GiveQuestsResponseDto,
  GiveRandomQuestsDto,
  GiveRandomQuestsResponseDto,
} from './types';
import { scrimmageService } from './service';

export const scrimmageCommon = {
  subscribeWebhook: async (auth: any, eventType: string, event: string, webhookUrl: string, method = 'POST') => {
    return scrimmageService.makeRequest(auth, {
      url: '/nbc/webhooks',
      method: HttpMethod.POST,
      body: {
        url: webhookUrl,
        method,
        eventType,
        event,
      },
    });
  },
  unsubscribeWebhook: async (auth: any, webhookId: string) => {
    return scrimmageService.makeRequest(auth, {
      url: `/nbc/webhooks/${webhookId}`,
      method: HttpMethod.DELETE,
    });
  },
  getAllUsers: async (auth: any): Promise<IPlayerDTO[]> => {
    const response = await scrimmageService.makeRequest<PaginationContainer<IPlayerDTO>>(auth, {
      url: '/p2e/players',
      method: HttpMethod.GET,
      queryParams: {
        limit: '10',
        page: '0',
        orderBy: 'availableBalance',
        orderByType: 'DESC',
      },
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body.data;
    }
    return [];
  },
  getAllQuestTemplates: async (auth: any): Promise<IQuestTemplateDTO[]> => {
    const response = await scrimmageService.makeRequest<IQuestTemplateDTO[]>(auth, {
      url: '/p2e/quests',
      method: HttpMethod.GET,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body;
    }
    return [];
  },
  giveQuestToUser: async (auth: any, userId: string, giveQuestDto: GiveQuestDto): Promise<GiveQuestResponseDto> => {
    const response = await scrimmageService.makeRequest(auth, {
      url: `/p2e/players/${userId}/quests`,
      method: HttpMethod.POST,
      body: giveQuestDto,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body;
    }
    return {
      success: false,
    };
  },
  giveQuestsToUser: async (auth: any, userId: string, giveQuestsDto: GiveQuestsDto): Promise<GiveQuestsResponseDto> => {
    const response = await scrimmageService.makeRequest(auth, {
      url: `/p2e/players/${userId}/quests/bulk`,
      method: HttpMethod.POST,
      body: giveQuestsDto,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body;
    }
    return {
      quests: [],
    };
  },
  giveRandomQuestsToUser: async (auth: any, userId: string, giveRandomQuestsDto: GiveRandomQuestsDto): Promise<GiveRandomQuestsResponseDto> => {
    const response = await scrimmageService.makeRequest(auth, {
      url: `/p2e/players/${userId}/quests/random`,
      method: HttpMethod.POST,
      body: giveRandomQuestsDto,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body;
    }
    return {
      quests: [],
    };
  },
  getAllEvents: async (auth: any): Promise<ProcessableEventType[]> => {
    const response = await scrimmageService.makeRequest<ProcessableEventType[]>(auth, {
      url: '/nbc/event-keys',
      method: HttpMethod.GET,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body;
    }
    return [];
  },
  getAllEventTypes: async (auth: any, event: string): Promise<string[]> => {
    const response = await scrimmageService.makeRequest<string[]>(auth, {
      url: `/nbc/event-keys/${event}/types`,
      method: HttpMethod.GET,
    });
    if (response.status >= 200 && response.status < 300) {
      return response.body;
    }
    return [];
  },
};
