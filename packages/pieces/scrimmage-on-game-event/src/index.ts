
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {onQuestCompleted} from "./lib/actions/on-quest-completed";
import {onUserSignedup} from "./lib/triggers/on-user-signedup";

export const scrimmageAuthOnEvent = PieceAuth.SecretText({
  displayName: 'API Key',
  description: 'Scrimmage API Key',
  required: true,
});

export const scrimmageOnGameEvent = createPiece({
  displayName: "On Game Event",
  auth: scrimmageAuthOnEvent,
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://coinflip.apps.scrimmage.co/api/fs/assets/goldQuests?nonce=0&namespace=production",
  authors: [],
  actions: [onQuestCompleted],
  triggers: [onUserSignedup],
});
