import {createAction, createTrigger, Property, TriggerStrategy} from "@activepieces/pieces-framework";
import {scrimmageAuthOnEvent} from "../../index";

export const onUserSignedup = createTrigger({
  auth: scrimmageAuthOnEvent,
  name: 'on_user_signed_up',
  displayName: 'On User Sign Up',
  description: 'Will be triggered once new user joins',
  type: TriggerStrategy.WEBHOOK,
  props: {},
  sampleData: {},
  onEnable: async (ctx) => {},
  // Run when the user disable the collection or
  // the old collection is deleted after new one is published.
  onDisable: async (ctx) => {},

  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  run: async (context) => {
    return Promise.resolve([{}]);
  }

});
