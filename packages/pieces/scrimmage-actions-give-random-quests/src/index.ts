
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {giveRandomQuests} from "./lib/actions/give-random-quests";

export const scrimmageActionsGiveRandomQuests = createPiece({
  displayName: "Scrimmage-actions-give-random-quests",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://cdn.activepieces.com/pieces/scrimmage-actions-give-random-quests.png",
  authors: [],
  actions: [giveRandomQuests],
  triggers: [],
});
