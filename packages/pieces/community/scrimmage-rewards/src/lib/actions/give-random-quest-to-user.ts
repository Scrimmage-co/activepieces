import { createAction, Property } from '@activepieces/pieces-framework';
import { scrimmageCommon } from '../common/api';
import { ExecutionType } from '@activepieces/shared';
import { generateUserIdProperty } from '../common/properties';

export const giveRandomQuestToUser = createAction({
  name: 'giveRandomQuestToUser', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Give Random Quests to User',
  description: 'Give Random Quests to User',
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
      description: 'Quests for a random selection',
      required: true,
      refreshers: ['auth'],
      options: async ({auth}) => {
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
          })),
        };
      },
    }),
    amount: Property.Number({
      displayName: 'Amount',
      description: 'Amount of quests to give',
      required: true,
    }),
  },
  async run(context) {
    switch (context.executionType) {
      //
      // BEGIN
      //
      case ExecutionType.BEGIN: {
        return await scrimmageCommon.giveRandomQuestsToUser(context.auth, context.propsValue['user_id'], {
          count: context.propsValue['amount'],
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
  },
});
