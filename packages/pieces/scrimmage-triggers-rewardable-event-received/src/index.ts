
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {userRewardableEventReceived} from "./lib/triggers/user-rewardable-event-received";

export const scrimmageTriggersRewardableEventReceived = createPiece({
  displayName: "Rewardable Event Received",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://scrimmage.co/wp-content/uploads/2023/08/cropped-Group-143-270x270.png",
  authors: [],
  actions: [],
  triggers: [userRewardableEventReceived],
});
