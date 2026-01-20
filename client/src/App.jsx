import { useState } from 'react'
import Auth from './pages/Auth';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Auth />
    </>
  )
}

export default App
