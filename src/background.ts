import { autoAppendSuffix } from './utils/textUtils';

chrome.webRequest.onBeforeRequest.addListener(
  ({ url }) => {
    console.log('[cleanup_csdn] listen new request', url);

    const urlObj = new URL(url);
    if (urlObj.pathname !== '/search') {
      return;
    }

    const q = urlObj.searchParams.get('q');
    if (q?.endsWith(' -csdn')) {
      return;
    }

    const newQ = autoAppendSuffix(q);
    if (newQ) {
      urlObj.searchParams.set('1', newQ);

      return { redirectUrl: urlObj.href };
    }

    // chrome.declarativeNetRequest.updateDynamicRules({
    //   addRules: [
    //     {
    //       id: 1,
    //       condition: {
    //         urlFilter: '/search',
    //         initiatorDomains: ['bing.com'],
    //       },
    //       action: {
    //         type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
    //         redirect: {
    //           transform: {
    //             queryTransform: {
    //               addOrReplaceParams: [{ key: 'q', value: newQ }],
    //             },
    //           },
    //         },
    //       },
    //     },
    //   ],
    //   removeRuleIds: [1],
    // });
  },
  { urls: ['https://cn.bing.com/search?*', 'https://www.bing.com/search?*'] },
  ['blocking']
);

// chrome.webNavigation.onBeforeNavigate.addListener(
//   ({ url, tabId }) => {
//     console.log('[cleanup_csdn] listen new nav', url);

//     const urlObj = new URL(url);
//     if (urlObj.pathname !== '/search') {
//       return;
//     }

//     const q = urlObj.searchParams.get('q');
//     const newQ = autoAppendSuffix(q);
//     if (!newQ) {
//       return;
//     }

//     chrome.declarativeNetRequest.updateDynamicRules({
//       addRules: [
//         {
//           id: 1,
//           condition: {
//             // tabIds: [tabId],
//             // initiatorDomains: ['bing.com'],
//             urlFilter: 'https://*.bing.com/search?*',
//             requestMethods: [chrome.declarativeNetRequest.RequestMethod.GET],
//           },
//           action: {
//             type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
//             redirect: {
//               transform: {
//                 queryTransform: {
//                   addOrReplaceParams: [{ key: 'q', value: newQ }],
//                 },
//               },
//             },
//           },
//         },
//       ],
//       removeRuleIds: [1],
//     });
//   },
//   { url: [{ hostSuffix: 'bing.com' }] }
// );
