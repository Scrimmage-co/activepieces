import { createPiece, PieceAuth, Property } from '@activepieces/pieces-framework';
import { giveQuestToUser } from './lib/actions/give-quest-to-user';
import { giveQuestsToUser } from './lib/actions/give-quests-to-user';
import { giveRandomQuestToUser } from './lib/actions/give-random-quest-to-user';
import { userSignedUp } from './lib/triggers/user-signed-up';
import { eventReceived } from './lib/triggers/event-received';
import { PieceCategory } from '@activepieces/shared';

const scrimmageAuth = PieceAuth.CustomAuth({
  description: 'Authenticate with Scrimmage',
  required: true,
  props: {
    baseUrl: Property.ShortText({
      displayName: 'Integration URL',
      required: true,
    }),
    p2eToken: PieceAuth.SecretText({
      displayName: 'Game Service Secret',
      required: true,
    }),
    nbcToken: PieceAuth.SecretText({
      displayName: 'Notification Service Secret',
      required: true,
    }),
    namespace: Property.ShortText({
      displayName: 'Namespace',
      required: true,
      defaultValue: 'production',
    }),
  },
});

export const scrimmageRewards = createPiece({
  displayName: 'Scrimmage Rewards',
  auth: scrimmageAuth,
  minimumSupportedRelease: '0.20.0',
  logoUrl: 'https://cdn.scrimmage.co/icons/Scrimmage-Logo.webp',
  categories: [PieceCategory.CORE],
  authors: [],
  actions: [giveQuestToUser, giveQuestsToUser, giveRandomQuestToUser],
  triggers: [eventReceived, userSignedUp],
});
