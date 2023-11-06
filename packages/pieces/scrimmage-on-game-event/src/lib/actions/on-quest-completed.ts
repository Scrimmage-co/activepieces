import { createAction, Property } from "@activepieces/pieces-framework";
import { HttpMethod, httpClient } from "@activepieces/pieces-common";
import { ExecutionType, PauseType } from "@activepieces/shared";
import {scrimmageAuthOnEvent} from "../../index";

export const onQuestCompleted = createAction({
  auth: scrimmageAuthOnEvent,
  name: 'on_quest_completed',
  description: 'Pause the workflow till the moment any of the specified quests are completed',
  displayName: 'Wait till Quest is Completed',
  props: {
    quests: Property.MultiSelectDropdown({
      displayName: 'Quests',
      description: 'Quests to wait for. Workflow will resume when any of the quests are completed',
      required: true,
      refreshers: [],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            options: [],
            placeholder: 'Please enter your API key first.'
          }
        }

        const response = await httpClient.sendRequest<any[]>({
          method: HttpMethod.GET,
          url: `https://coinflip.apps.scrimmage.co/p2e/quests`,
          headers: {
            'Authorization': 'Token ' + auth,
            'Scrimmage-Namespace': 'production',
          }
        })
        console.log(response);
        if (response.status === 200) {
          return {
            disabled: false,
            options: response.body.map((template) => {
              return {
                label: `${template.id}: ${template.description}`,
                value: `${template.id}: ${template.description}`
              }
            })
          }
        }

        return {
          disabled: true,
          options: [],
          placeholder: "Error processing templates"
        }
      }
    }),
  },
  async run(configValue) {
    if (configValue.executionType === ExecutionType.BEGIN) {
      configValue.run.pause({
        pauseMetadata: {
          type: PauseType.WEBHOOK,
          actions: ['approve', 'disapprove'],
        }
      });

      // const resumeLink = `${configValue.serverUrl}v1/flow-runs/${configValue.run.id}/resume?action=QUEST_COMPLETED`;

      return {}
    } else {
      const payload = configValue.resumePayload as { action: string, questId: string, user: string };
      const questIds = configValue.propsValue.quests.map((quest) => quest.split(':')[0]);

      return {
        approved: payload.action === 'QUEST_COMPLETED' && questIds.includes(payload.questId),
      }
    }
  },

});
