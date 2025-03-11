import type React from 'react'

export function Message({ children }: React.PropsWithChildren) {
	return (
		<div className="text-nowrap bg-zinc-800 py-1 text-center">{children}</div>
	)
}
