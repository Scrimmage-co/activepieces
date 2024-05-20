import { createAction, Property } from '@activepieces/pieces-framework';
import { scrimmageCommon } from '../common/api';
import { ExecutionType } from '@activepieces/shared';
import { generateUserIdProperty } from '../common/properties';

export const giveQuestsToUser = createAction({
  name: 'giveQuestsToUser', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Give Multiple Quests to User',
  description: 'Give Multiple Quests to User',
  errorHandlingOptions: {
    retryOnFailure: {
      defaultValue: true,
      hide: false,
    },
    continueOnFailure: {
      defaultValue: false,
      hide: false,
    },
  },
  requireAuth: true,
  props: {
    user_id: generateUserIdProperty(),
    quests: Property.MultiSelectDropdown({
      displayName: 'Quests',
      description: 'Quests to give to user',
      required: true,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            options: [],
          };
        }
        const response = await scrimmageCommon.getAllQuestTemplates(auth);
        return {
          disabled: false,
          options: response.map((template) => ({
            label: `${template.id}: ${template.title || template.description}`,
            value: template.id,
          }))
        };
      }
    }),
  },
  async run(context) {
    switch (context.executionType) {
      //
      // BEGIN
      //
      case ExecutionType.BEGIN: {
        return await scrimmageCommon.giveQuestsToUser(context.auth, context.propsValue['user_id'], {
          quests: context.propsValue['quests'].map(questId => ({
            questTemplateId: questId,
          })),
        });
      }
      //
      // RESUME
      //
      case ExecutionType.RESUME: {
        return;
      }
    }
  }
});

