import {HttpMethod, HttpRequest, httpClient } from "../http";

export interface GiveQuestDto {
  questTemplateId: number;
}

export interface GiveQuestResponseDto {
  success: boolean;
  message?: string;
  questId?: number;
}

export interface GiveQuestsDto {
  quests: GiveQuestDto[];
}

export interface GiveQuestsResponseDto {
  quests: GiveQuestResponseDto[];
}

export interface GiveRandomQuestsDto {
  count: number;
  quests: GiveQuestDto[];
}

export interface GiveRandomQuestsResponseDto {
  quests: GiveQuestResponseDto[];
}

export const scrimmageCommon = {
  baseUrl: "https://coinflip.apps.scrimmage.co",
  namespace: "production",
  token: "LzsEZwaYlNL/wKU+Q98eKCsOhG0QulefxXV/3E4LZm373hH5ip263EnwffSv4rOC",
  subscribeWebhook: async (eventType: string, event: string, webhookUrl: string) => {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${scrimmageCommon.baseUrl}/nbc/webhooks/`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      body: {
        url: webhookUrl,
        method: "POST",
        eventType,
        event,
      },
      queryParams: {},
    };

    return await httpClient.sendRequest(request);
  },
  unsubscribeWebhook: async (webhookId: string) => {
    const request: HttpRequest = {
      method: HttpMethod.DELETE,
      url: `${scrimmageCommon.baseUrl}/nbc/webhooks/${webhookId}`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      queryParams: {},
    };

    return await httpClient.sendRequest(request);
  },
  getAllUsers: async () => {
    const request: HttpRequest = {
      method: HttpMethod.GET,
      url: `${scrimmageCommon.baseUrl}/p2e/players?limit=100000`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      queryParams: {},
    };

    const response = await httpClient.sendRequest<any[]>(request);
    if (response.status === 200) {
      return response.body;
    }

    return [];
  },
  getAllQuestTemplates: async () => {
    const request: HttpRequest = {
      method: HttpMethod.GET,
      url: `${scrimmageCommon.baseUrl}/p2e/quests`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      queryParams: {},
    };

    const response = await httpClient.sendRequest<any[]>(request);
    if (response.status === 200) {
      return response.body;
    }

    return [];
  },
  giveQuestToUser: async (userId: string, giveQuestDto: GiveQuestDto): Promise<GiveQuestResponseDto> => {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${scrimmageCommon.baseUrl}/p2e/players/${userId}/quests`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      body: giveQuestDto,
    };

    const response = await httpClient.sendRequest<GiveQuestResponseDto>(request);
    if (response.status === 200) {
      return response.body;
    }
    console.error(response);
    return {
      success: false,
    }
  },
  giveQuestsToUser: async (userId: string, giveQuestsDto: GiveQuestsDto): Promise<GiveQuestsResponseDto> => {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${scrimmageCommon.baseUrl}/p2e/players/${userId}/quests/bulk`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      body: giveQuestsDto,
    };

    const response = await httpClient.sendRequest<GiveQuestsResponseDto>(request);
    if (response.status === 200) {
      return response.body;
    }
    console.error(response);
    return {
      quests: [],
    }
  },
  giveRandomQuestsToUser: async (userId: string, giveRandomQuestsDto: GiveRandomQuestsDto): Promise<GiveRandomQuestsResponseDto> => {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `${scrimmageCommon.baseUrl}/p2e/players/${userId}/quests/random`,
      headers: {
        "Content-Type": "application/json",
        'Authorization': 'Token ' + scrimmageCommon.token,
        'Scrimmage-Namespace': scrimmageCommon.namespace,
      },
      body: giveRandomQuestsDto,
    };

    const response = await httpClient.sendRequest<GiveRandomQuestsResponseDto>(request);
    if (response.status === 200) {
      return response.body;
    }
    console.error(response);
    return {
      quests: [],
    }
  }
}
