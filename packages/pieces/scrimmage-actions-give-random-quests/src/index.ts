
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {giveRandomQuests} from "./lib/actions/give-random-quests";

export const scrimmageActionsGiveRandomQuests = createPiece({
  displayName: "Give Random Quests",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.0.1',
  logoUrl: "https://scrimmage.co/wp-content/uploads/2023/08/cropped-Group-143-270x270.png",
  authors: [],
  actions: [giveRandomQuests],
  triggers: [],
});
