
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {giveQuest} from "./lib/actions/give-quest";

export const scrimmageActionsGiveQuest = createPiece({
  displayName: "Give Quest",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.0.1',
  logoUrl: "https://scrimmage.co/wp-content/uploads/2023/08/cropped-Group-143-270x270.png",
  authors: [],
  actions: [giveQuest],
  triggers: [],
});
