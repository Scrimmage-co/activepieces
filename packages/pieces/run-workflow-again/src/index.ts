
import { createPiece, PieceAuth } from "@activepieces/pieces-framework";
import {runCurrentWorkflowAgain} from "./lib/actions/run-current-workflow-again";

export const runWorkflowAgain = createPiece({
  displayName: "Run Workflow",
  auth: PieceAuth.None(),
  minimumSupportedRelease: '0.9.0',
  logoUrl: "https://static-00.iconduck.com/assets.00/workflow-circle-05-icon-465x512-7r7m2to8.png",
  authors: [],
  actions: [runCurrentWorkflowAgain],
  triggers: [],
});
