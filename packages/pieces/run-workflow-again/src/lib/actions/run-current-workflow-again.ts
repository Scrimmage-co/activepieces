import { createAction, PieceAuth } from "@activepieces/pieces-framework";

export const runCurrentWorkflowAgain = createAction({
  name: 'run_current_workflow_again', // Must be a unique across the piece, this shouldn't be changed.
  auth: PieceAuth.None(),
  displayName:'Run Current workflow again',
  description: '',
  props: {
    // Properties to ask from the user, in this ask we will take number of
  },
  async run(context) {
    const url = context.serverUrl;
    return {};
  },
});

