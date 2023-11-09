import { createAction, Property, PieceAuth } from "@activepieces/pieces-framework";
import {scrimmageCommon} from "@activepieces/pieces-common";
import {ExecutionType, PauseType} from "@activepieces/shared";

export const giveQuests = createAction({
  name: 'give_quests', // Must be a unique across the piece, this shouldn't be changed.
  auth: PieceAuth.None(),
  displayName:'Give Multiple Quests to User',
  description: 'Give Multiple Quests to User',
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
    quests: Property.MultiSelectDropdown({
      displayName: 'Quests',
      description: 'Quests to give to user',
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
    wait_till: Property.StaticDropdown({
      displayName: 'Resume Workflow',
      description: 'When should workflow be resumed',
      required: true,
      options: {
        "options": [
          {
            label: 'Immediately',
            value: 'immediately'
          },
          {
            label: 'On Any Quest Completed/Canceled/Lost',
            value: 'on_any_quest_completed'
          },
          {
            label: 'On All Quests Completed/Canceled/Lost',
            value: 'on_all_quest_completed'
          },
        ]
      }
    }),
  },
  async run(context) {
    if (context.executionType === ExecutionType.BEGIN) {
      const response = await scrimmageCommon.giveQuestsToUser(context.propsValue['user_id'], {
        quests: context.propsValue['quests'].map(quest => {
          return {
            questTemplateId: parseInt(quest.split(":")[0]),
          }
        }),
      });
    const succeededQuests = response.quests.filter(quest => quest.success);
      await context.store?.put('_scrimmage_give_quests_ids', {
        ids: succeededQuests.map(quest => quest.questId),
      });
      if (succeededQuests.length > 0 && context.propsValue['wait_till'] !== 'immediately') {
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
      const questIds = await context.store?.get<any>('_scrimmage_give_quests_ids');

      if (questIds.ids.includes(parsedAction.target.id)) {
        if (context.propsValue['wait_till'] === 'on_any_quest_completed') {
          await context.store?.delete('_scrimmage_give_quests_ids')
          return {
            approved: true,
          }
        }
        if (context.propsValue['wait_till'] === 'on_all_quest_completed') {
          if (questIds.ids.length === 1) {
            await context.store?.delete('_scrimmage_give_quests_ids')
            return {
              approved: true,
            }
          } else {
            await context.store?.put('_scrimmage_give_quests_ids', {
              ids: questIds.ids.filter((id: number) => id !== parsedAction.target.id),
            });
            return {
              approved: false,
              reason: 'Waiting for other quests to complete',
            }
          }
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

