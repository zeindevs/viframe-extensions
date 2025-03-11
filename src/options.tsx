import { createRoot } from 'react-dom/client'

import './index.css'
import { Layout } from './components/layout'
import { Message } from './components/message'

function App() {
	return <Message>No options</Message>
}

createRoot(document.getElementById('root')!).render(
	<Layout>
		<App />
	</Layout>,
)
