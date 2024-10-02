import { useState } from 'react'
import './index.css'

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='bg-white'>
      <header>
        <div>
          <h1 className='text-2xl font-bold'>WELCOME</h1>

        </div>

      </header>
      
      <main>
          <div>
            <p className='text-black'>Count teste: {count}</p>
            <button 
              className='bg-blue-500 text-white p-2 rounded'
              onClick={() => setCount(count + 1)}
            >Increment
            </button>
          </div>
      </main>

      <footer>
        <div>
          <p>Links vão ser criador aqui</p>
        </div>
      </footer>
    </div>
    </>

  )
}

export default App
