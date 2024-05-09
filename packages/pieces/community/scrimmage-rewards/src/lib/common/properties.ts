import { DropdownState, Property } from '@activepieces/pieces-framework';
import { scrimmageCommon } from './api';

export const generateUserIdProperty = () => {
  return Property.Dropdown({
    displayName: 'User ID',
    description: 'User who will receive the quest. Consider dynamic value',
    required: true,
    refreshers: ['auth'],
    options: async ({auth}): Promise<DropdownState<string>> => {
      if (!auth) {
        return {
          disabled: true,
          options: [],
        };
      }
      const users = await scrimmageCommon.getAllUsers(auth);
      return {
        disabled: false,
        options: users.map((user) => ({
          label: String(user.id),
          value: String(user.id),
        })),
      };
    },
  })
}
