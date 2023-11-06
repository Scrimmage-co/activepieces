import {createPiece, PieceAuth} from "@activepieces/pieces-framework";
import {giveQuest} from "./lib/actions/give-quest";
import {PieceCategory} from "@activepieces/shared";
import {giveRandomQuest} from "./lib/actions/give-random-quest";

export const scrimmageAuth = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Scrimmage API Key',
  required: true,
});

export const scrimmageQuests = createPiece({
  displayName: "Scrimmage Quests",
  auth: scrimmageAuth,
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://coinflip.apps.scrimmage.co/api/fs/assets/goldQuests?nonce=0&namespace=production",
  authors: [],
  actions: [giveQuest, giveRandomQuest],
  triggers: [],
  categories: [PieceCategory.GAMIFICATION],
});
