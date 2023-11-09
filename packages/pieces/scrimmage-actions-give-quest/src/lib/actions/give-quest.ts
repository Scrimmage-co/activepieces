import { createAction, Property, PieceAuth } from "@activepieces/pieces-framework";
import {httpClient, HttpMethod, scrimmageCommon} from "@activepieces/pieces-common";
import {ExecutionType, PauseType} from "@activepieces/shared";

export const giveQuest = createAction({
  name: 'give_quest', // Must be a unique across the piece, this shouldn't be changed.
  auth: PieceAuth.None(),
  displayName:'Give Quest to User',
  description: 'Distributed quest to user',
  props: {
    user_id: Property.Dropdown({
      displayName: 'User ID',
      description: 'User ID',
      required: true,
      refreshers: [],
      options: async () => {
        const response = await scrimmageCommon.getAllUsers();
        console.log(response);
        return {
          disabled: false,
          options: response.map((user) => {
            return {
              label: `${user.id}`,
              value: `${user.id}`
            }
          })
        }
      }
    }),
    // Properties to ask from the user, in this ask we will take number of
    quest: Property.Dropdown({
      displayName: 'Quest',
      description: 'Quest to give to user',
      required: true,
      refreshers: [],
      options: async () => {
        const response = await scrimmageCommon.getAllQuestTemplates();
        console.log(response);
        return {
          disabled: false,
          options: response.map((template) => {
            return {
              label: `${template.id}: ${template.description}`,
              value: `${template.id}: ${template.description}`
            }
          })
        }
      }
    }),
    wait_till_quest_removed: Property.Checkbox({
      displayName: 'Stop Workflow',
      description: 'Stop the workflow till the quest is completed, canceled by user or lost',
      required: false,
    }),
  },
  async run(context) {
    if (context.executionType === ExecutionType.BEGIN) {
      const response = await scrimmageCommon.giveQuestToUser(context.propsValue['user_id'], {
        questTemplateId: parseInt(context.propsValue['quest'].split(":")[0]),
      });
      await context.store?.put('_scrimmage_give_quest_id', {
        id: response.questId,
      });
      if (response.success && context.propsValue['wait_till_quest_removed']) {
        context.run.pause({
          pauseMetadata: {
            type: PauseType.WEBHOOK,
            actions: ['approve', 'disapprove'],
          }
        });
        const resumeLink = `${context.serverUrl}v1/flow-runs/${context.run.id}/resume`;
        const responseOnQuestCompleted = await scrimmageCommon.subscribeWebhook('game.event', 'QUEST_COMPLETED', resumeLink)
        console.log(responseOnQuestCompleted);
        const responseOnQuestCanceled = await scrimmageCommon.subscribeWebhook('game.event', 'QUEST_CANCELED', resumeLink)
        console.log(responseOnQuestCanceled);
        const responseOnQuestLost = await scrimmageCommon.subscribeWebhook('game.event', 'QUEST_LOST', resumeLink)
        console.log(responseOnQuestLost);
      }

      return response;
    }
    const payload = context.resumePayload as { action: string }
    try {
      const parsedAction = JSON.parse(payload.action);
      const questId = await context.store?.get<any>('_scrimmage_give_quest_id');

      if (parsedAction.target.id === questId) {
        await context.store?.delete('_scrimmage_give_quest_id');
        return {
          approved: true,
        }
      }
      return {
        approved: false,
        reason: 'Wrong quest was completed',
      }
    } catch {
      return {
        approved: false,
        reason: 'Invalid payload',
      }
    }
  },
});

