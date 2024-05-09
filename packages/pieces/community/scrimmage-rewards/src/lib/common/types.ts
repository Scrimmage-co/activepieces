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
