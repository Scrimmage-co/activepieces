import { createAction, Property } from '@activepieces/pieces-framework';
import { scrimmageCommon } from '../common/api';
import { ExecutionType } from '@activepieces/shared';
import { generateUserIdProperty } from '../common/properties';

export const giveQuestToUser = createAction({
  name: 'giveQuestToUser', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Give Quest to User',
  description: 'Distributed quest to user',
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
    quest: Property.Dropdown({
      displayName: 'Quest',
      description: 'Quest to give to user',
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
            label: `${template.id}: ${template.description}`,
            value: template.id,
          })),
        };
      },
    }),
  },
  async run(context) {
    switch (context.executionType) {
      //
      // BEGIN
      //
      case ExecutionType.BEGIN: {
        return await scrimmageCommon.giveQuestToUser(context.auth, context.propsValue['user_id'], {
          questTemplateId: context.propsValue['quest'],
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
