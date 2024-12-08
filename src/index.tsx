import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'

import './index.css'
import { Layout } from './components/layout'
import { Message } from './components/message'
import { classNames } from './util'

type Data = {
  type: string
  url: string
}

export function App() {
  const [data, setData] = useState<Data[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error] = useState<object | null>(null)

  const onMessage = (msg: any) => {
    if (msg.from === 'inject') {
      setData((prev) => [...prev, ...msg.data])
      updateBadge()
    }
    setLoading(false)
  }

  const updateBadge = () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, ([tab]) => {
      chrome.action.setBadgeText({
        text: `${data.length}`,
        tabId: tab.id,
      })
      chrome.action.setBadgeBackgroundColor({
        color: '#CA2E0B',
        tabId: tab.id,
      })
    })
  }

  useEffect(() => {
    chrome.runtime.onMessage.addListener(onMessage)
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.url && !tab?.url?.includes('chrome://')) {
        setLoading(true)
        chrome.scripting.executeScript({
          target: {
            tabId: tab.id!,
          },
          files: ['inject.js'],
        })
      } else {
        setLoading(false)
        chrome.action.setBadgeText({ text: '0' })
      }
    })
    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [])

  if (loading) return <Message>Waiting for page to load...</Message>

  if (error)
    return (
      <Message>
        Sorry, an error occurred retrieving iframe information on this page.
      </Message>
    )

  if (data.length === 0) return <Message>No iframes detected!</Message>

  return (
    <table className="w-full">
      <tbody>
        {data.map((item, i) => (
          <tr
            key={i}
            className={classNames(
              i % 2 == 0 ? 'bg-zinc-800' : 'bg-zinc-950',
              'hover:bg-red-500',
            )}
          >
            <td className="px-2 py-1 text-nowrap w-[1%]">{i + 1}</td>
            <td className="px-2 py-1 text-nowrap w-[1%]">{item.type}</td>
            <td className="px-2 py-1 text-nowrap">
              <a href={item.url} target="_blank">
                {item.url}
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

createRoot(document.getElementById('root')!).render(
  <Layout>
    <App />
  </Layout>,
)
