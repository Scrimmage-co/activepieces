import { createTrigger, TriggerStrategy, Property } from '@activepieces/pieces-framework';
import { scrimmageCommon } from '../common/api';

export const eventReceived = createTrigger({
  name: 'eventReceived', // Must be a unique across the piece, this shouldn't be changed.
  displayName: 'Event Received',
  description: 'Get triggered when user receives or emits the event',
  type: TriggerStrategy.WEBHOOK,
  props: {
    event: Property.Dropdown({
      displayName: 'Event',
      description: 'The name of the event',
      required: true,
      refreshers: [],
      options: async ({auth}) => {
        const response = await scrimmageCommon.getAllEvents(auth);
        return {
          disabled: false,
          options: response.map((event) => {
            return {
              label: event,
              value: event
            };
          })
        };
      }
    }),
    event_type: Property.Dropdown({
      displayName: 'Event Type',
      description: 'The type of the event',
      required: true,
      refreshers: ['event'],
      options: async ({auth, event}) => {
        const response = await scrimmageCommon.getAllEventTypes(auth, event as any);
        return {
          disabled: false,
          options: response.map((eventType) => {
            return {
              label: eventType,
              value: eventType
            };
          })
        };
      }
    }),
    markdown: Property.MarkDown({
      value:
        `
This trigger will be triggered when a user receives or emits the event.

Webhook URL for debugging:
\`\`\`text
{{webhookUrl}}
\`\`\`
`,
    }),
  },
  async onEnable(context) {
    const response = await scrimmageCommon.subscribeWebhook(context.auth, context.propsValue['event'], context.propsValue['event_type'], context.webhookUrl);
    await context.store?.put('_scrimmage_trigger_event_received_id', {
      id: response.body.id,
    });
  },
  async onDisable(context) {
    const triggerId = await context.store?.get<any>('_scrimmage_trigger_event_received_id');
    if (!triggerId) {
      return;
    }
    await scrimmageCommon.unsubscribeWebhook(context.auth, triggerId.id);
    await context.store?.delete('_scrimmage_trigger_event_received_id');
  },
  async run(context) {
    return [context.payload.body];
  },
  sampleData: {
    "userId": "test",
    "dataType": "betExecuted",
    "body": {
      "amount": 100,
    },
  },
});
