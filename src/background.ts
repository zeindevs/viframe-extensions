type Message = {
  id: number
  from?: string
  data?: any[]
}

type BadgeType = 'loading' | 'complete'

function updateBadge(response: Message, type: BadgeType) {
  if (response) {
    if (type == 'complete') {
      if (response.data && response.data?.length > 0) {
        chrome.action.setTitle({
          title: 'viframes detected, click for more info',
          tabId: response.id,
        })
        chrome.action.setBadgeText({
          text: response.data.length.toString(),
          tabId: response.id,
        })
        chrome.action.setBadgeBackgroundColor({
          color: '#CA2E0B',
          tabId: response.id,
        })
      } else {
        chrome.action.setTitle({
          title: 'No viframes detected',
          tabId: response.id,
        })
        chrome.action.setBadgeText({
          text: '0',
          tabId: response.id,
        })
        chrome.action.setBadgeBackgroundColor({
          color: '#CA2E0B',
          tabId: response.id,
        })
      }
    }
    if (type === 'loading') {
      chrome.action.setTitle({
        title: 'Page loading',
        tabId: response.id,
      })
      chrome.action.setBadgeText({ text: '?', tabId: response.id })
      chrome.action.setBadgeBackgroundColor({
        color: '#3F51B5',
        tabId: response.id,
      })
    }
  }
}

function sendScript(tab: chrome.tabs.Tab) {
  if (tab?.url && !tab?.url?.includes('chrome://')) {
    chrome.scripting.executeScript({
      target: {
        tabId: tab?.id!,
      },
      files: ['inject.js'],
    })
  } else {
    chrome.action.setBadgeText({ text: '0' })
  }
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  try {
    updateBadge({ id: activeInfo.tabId }, 'loading')
    chrome.tabs.query(
      { active: true, lastFocusedWindow: true, windowId: activeInfo.windowId },
      ([tab]) => sendScript(tab),
    )
  } catch (err) {
    console.error(err)
  }
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    sendScript(tab)
  } else if (changeInfo.status == 'loading') {
    updateBadge({ id: tabId }, 'loading')
  }
})

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.from === 'inject') {
    updateBadge({ ...msg, id: sender.tab?.id }, 'complete')
  }
})
