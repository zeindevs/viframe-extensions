import { useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'

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

	const updateBadge = useCallback(() => {
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
	}, [data])

	useEffect(() => {
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
	}, [])

	useEffect(() => {
		const onMessage = (msg: { from: string; data: Data[] }) => {
			if (msg.from === 'inject') {
				setData((prev) => [...prev, ...msg.data])
				updateBadge()
			}
			setLoading(false)
		}

		chrome.runtime.onMessage.addListener(onMessage)

		return () => chrome.runtime.onMessage.removeListener(onMessage)
	}, [updateBadge])

	if (loading) return <Message>Waiting for page to load...</Message>

	if (error)
		return (
			<Message>
				Sorry, an error occurred retrieving iframe information on this page.
			</Message>
		)

	if (data.length === 0) return <Message>No iframes detected!</Message>

	return (
		<div className="overflow-auto">
			<table className="w-full">
				<tbody>
					{data.map((item, i) => (
						<tr
							key={i}
							className={classNames(
								i % 2 === 0 ? 'bg-zinc-800' : 'bg-zinc-950',
								'hover:bg-red-500',
							)}
						>
							<td className="w-[1%] text-nowrap px-2 py-1">{i + 1}</td>
							<td className="w-[1%] text-nowrap px-2 py-1">{item.type}</td>
							<td className="text-nowrap px-2 py-1">
								<a href={item.url} target="_blank" rel="noreferrer">
									{item.url}
								</a>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

createRoot(document.getElementById('root')!).render(
	<Layout>
		<App />
	</Layout>,
)
