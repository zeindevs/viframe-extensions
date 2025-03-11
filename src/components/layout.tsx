import type React from 'react'

export function Layout({ children }: React.PropsWithChildren) {
	return <div className="w-full min-w-sm max-w-sm p-1">{children}</div>
}
