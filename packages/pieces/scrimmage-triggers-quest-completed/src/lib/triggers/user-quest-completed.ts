import {createTrigger, PieceAuth, TriggerStrategy} from "@activepieces/pieces-framework";
import {scrimmageCommon} from "@scrimmage/pieces-common";

export const userQuestCompleted = createTrigger({
  auth: PieceAuth.None(),
  name: 'user-quest-completed', // Unique name across the piece.
  displayName: 'User Quest Completed', // Display name on the interface.
  description: 'Get triggered when user level up', // Description for the action
  type: TriggerStrategy.WEBHOOK, // Trigger strategy, polling or webhook.

  props: {},
  // Run when the user enable or publish the collection.

  async onEnable(context) {
    const response = await scrimmageCommon.subscribeWebhook('game.event', 'QUEST_COMPLETED', context.webhookUrl)
    console.log(response);
    await context.store?.put('_scrimmage_trigger_quest_completed_id', {
      id: (response.body as any).id,
    });
  },
  // Run when the user disable the collection or
  // the old collection is deleted after new one is published.
  async onDisable(context) {
    const triggerId = await context.store?.get<any>('_scrimmage_trigger_quest_completed_id');
    if (!triggerId) {
      return;
    }
    await scrimmageCommon.unsubscribeWebhook(triggerId.id);
    await context.store?.delete('_scrimmage_trigger_quest_completed_id');
  },
  // Trigger implementation, It takes context as parameter.
  // should returns an array of payload, each payload considered
  // a separate flow run.
  async run(context) {
    return [context.payload.body];
  },
  sampleData: {
    "user": {
      "id": "test_user_id",
      "tags": ["test", "premium"],
      "stats": {
        "level": 1,
        "experience": 0,
        "segments": {
          "test_segment": true,
          "premium_segment": true
        }
      }
    },
    "body": {
      "target": {
        "id": "quest_id",
        "questTemplateId": "quest_template_id",
        "centsReward": 100,
        "questTemplate": {
          "description": "quest description",
        }
      },
    }
  }
})
