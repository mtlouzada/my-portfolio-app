import { useState } from 'react';
import './index.css';
import Menu from './components/menu.tsx';

const App: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='bg-white'>
      <header>
        <Menu/>
        <div>
          <h1 className='text-4xl'>WELCOME</h1>

        </div>

      </header>
      
      <main>
          
      </main>

      <footer>
        
      </footer>
    </div>
    </>

  )
}

export default App
