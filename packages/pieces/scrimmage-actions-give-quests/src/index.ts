
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {giveQuests} from "./lib/actions/give-quests";

export const scrimmageActionsGiveQuests = createPiece({
  displayName: "Give Multiple Quests",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://scrimmage.co/wp-content/uploads/2023/08/cropped-Group-143-270x270.png",
  authors: [],
  actions: [giveQuests],
  triggers: [],
});
