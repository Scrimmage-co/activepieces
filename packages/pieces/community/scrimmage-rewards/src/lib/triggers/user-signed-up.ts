import { createTrigger, Property, TriggerStrategy } from '@activepieces/pieces-framework';
import { scrimmageCommon } from '../common/api';

export const userSignedUp = createTrigger({
  name: 'userSignedUp', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'User Signed Up',
  description: 'Get triggered when user signs up',
  type: TriggerStrategy.WEBHOOK,
  props: {
    markdown: Property.MarkDown({
      value:
`
This trigger will be triggered when a user signs up.

Webhook URL for debugging:
\`\`\`text
{{webhookUrl}}
\`\`\`
`,
    }),
  },
  async onEnable(context) {
    const response = await scrimmageCommon.subscribeWebhook(context.auth, 'game.events', 'USER_CREATED', context.webhookUrl);
    await context.store?.put('_scrimmage_trigger_user_sign_up_id', {
      id: response.body.id,
    });
  },
  async onDisable(context) {
    const triggerId = await context.store?.get<any>('_scrimmage_trigger_user_sign_up_id');
    if (!triggerId) {
      return;
    }
    await scrimmageCommon.unsubscribeWebhook(context.auth, triggerId.id);
    await context.store?.delete('_scrimmage_trigger_user_sign_up_id');
  },
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
    }
  },
});
