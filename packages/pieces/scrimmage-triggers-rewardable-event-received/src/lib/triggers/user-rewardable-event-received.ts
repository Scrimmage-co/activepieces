import {createTrigger, PieceAuth, TriggerStrategy} from "@activepieces/pieces-framework";
import {scrimmageCommon} from "@activepieces/pieces-common";

export const userRewardableEventReceived = createTrigger({
  auth: PieceAuth.None(),
  name: 'user-redeem-completed', // Unique name across the piece.
  displayName: 'User Redeem Completed', // Display name on the interface.
  description: 'Get triggered when user redeems something', // Description for the action
  type: TriggerStrategy.WEBHOOK, // Trigger strategy, polling or webhook.

  props: {},
  // Run when the user enable or publish the collection.

  async onEnable(context) {
    const response = await scrimmageCommon.subscribeWebhook('rewardable.event', '*', context.webhookUrl)
    console.log(response);
    await context.store?.put('_scrimmage_trigger_reawrdable_event_received_id', {
      id: (response.body as any).id,
    });
  },
  // Run when the user disable the collection or
  // the old collection is deleted after new one is published.
  async onDisable(context) {
    const triggerId = await context.store?.get<any>('_scrimmage_trigger_reawrdable_event_received_id');
    if (!triggerId) {
      return;
    }
    await scrimmageCommon.unsubscribeWebhook(triggerId.id);
    await context.store?.delete('_scrimmage_trigger_reawrdable_event_received_id');
  },
  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  async run(context) {
    return [context.payload.body];
  },
  sampleData: {
    "userId": "test",
    "dataType": "betExecuted",
    "body": {
      "amount": 100,
    },
  }
})
