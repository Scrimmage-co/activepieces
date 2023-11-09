
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {userSignUp} from "./lib/triggers/user-sign-up";

export const scrimmageTriggersUserSignUp = createPiece({
  displayName: "User Signed Up",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://scrimmage.co/wp-content/uploads/2023/08/cropped-Group-143-270x270.png",
  authors: [],
  actions: [],
  triggers: [userSignUp],
});
