import { createAction, Property, PieceAuth } from "@activepieces/pieces-framework";
import { httpClient, HttpMethod } from "@activepieces/pieces-common";
import {scrimmageAuth} from "../../index";

export const giveRandomQuest = createAction({
	name: 'give_random_quest', // Must be a unique across the piece, this shouldn't be changed.
  auth: scrimmageAuth,
  displayName:'Give Random Quest to User',
  description: 'Distribute random quest to user',
	props: {
        // Properties to ask from the user, in this ask we will take number of
		quests: Property.MultiSelectDropdown({
      displayName: 'Quests',
      description: 'Quests selection for a random',
      required: true,
      refreshers: [],
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            options: [],
            placeholder: 'Please enter your API key first.'
          }
        }

        const response = await httpClient.sendRequest<any[]>({
          method: HttpMethod.GET,
          url: `https://coinflip.apps.scrimmage.co/p2e/quests`,
          headers: {
            'Authorization': 'Token ' + auth,
            'Scrimmage-Namespace': 'production',
          }
        })
        console.log(response);
        if (response.status === 200) {
          return {
            disabled: false,
            options: response.body.map((template) => {
              return {
                label: `${template.id}: ${template.description}`,
                value: `${template.id}: ${template.description}`
              }
            })
          }
        }

        return {
          disabled: true,
          options: [],
          placeholder: "Error processing templates"
        }
      }
    }),
    if_not_exists: Property.Checkbox({
      displayName: 'If Not Exists',
      description: 'If the user already has a quest, do not give them another one',
      required: false,
    }),
	},
	async run(context) {
        // const SCRIMMAGE_URL = "https://coinflip.apps.scrimmage.co/";
        // const topStoryIdsResponse = await httpClient.sendRequest<string[]>({
        //   method: HttpMethod.GET,
        //   url: `${HACKER_NEWS_API_URL}topstories.json`
        // });
        // const topStoryIds: string[] = topStoryIdsResponse.body;
        // const topStories = [];
        // for (let i = 0; i < Math.min(context.propsValue['number_of_stories']!, topStoryIds.length); i++) {
        //   const storyId = topStoryIds[i];
        //   const storyResponse = await httpClient.sendRequest({
        //     method: HttpMethod.GET,
        //     url: `${HACKER_NEWS_API_URL}item/${storyId}.json`
        //   });
        //   topStories.push(storyResponse.body);
        // }
		return {
      quests: context.propsValue.quests,
      chosenQuest: context.propsValue.quests[Math.floor(Math.random() * context.propsValue.quests.length)],
      context: context,
    };
	},
});

