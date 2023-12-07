
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {userRedeemCompleted} from "./lib/triggers/user-redeem-completed";

export const scrimmageTriggersRedeemMade = createPiece({
  displayName: "Redeem Completed",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.0.1',
  logoUrl: "https://scrimmage.co/wp-content/uploads/2023/08/cropped-Group-143-270x270.png",
  authors: [],
  actions: [],
  triggers: [userRedeemCompleted],
});
