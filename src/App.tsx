import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>


        <header>
          <div className='menu-bar'>
            <div>
              <a href="">matheuslouzadaa@gmail.com</a>
                <a href="">CV</a>
            </div>
            <div>
              <a href="https://www.linkedin.com/in/matheus-louzadaa/" target='black'>LinkedIn</a>
              <a href="https://github.com/mtlouzada" target='black'>GitHub</a>
            </div>
          </div>

          <div>
            <img src="./perfil-project.jpeg" alt="Foto Perfil"/>
            <h1>Matheus Louzada</h1>
            <h3>Desenvolvedor web</h3>

            <p>
            Me formei em ADS no fim de 2023, desde então estou fazendo cursos profissionalizantes focado no desenvolvimento Web2. Também participei de um BootCamp seguido de um Hackathon na ICP HUB Brasil, onde tive a experiência de desenvolver um projeto em equipe e apresentá-lo.

Estudo sobre programação diariamente, me desafiando a criar projetos completos, utilizando bibliotecas, frameworks e banco de dados para isso. Desenvolvendo autonomia na criação de código e aprimorando o meu raciocínio lógico. Visando ser capaz de entregar soluções tecnológicas de forma rápida e eficaz.
            </p>

            <a href="">Ver Currículo</a>
            <a href="">Enviar Email</a>

          </div>

        </header>

        <main>

          <h2>Melhores Projetos</h2>

          <div>
            <a href="">projeto-1</a>
            <h3>projetos-1</h3>
            <p>about projeto</p>
            <a href="">ir ao site</a>
            <a href="">ver video</a>
          </div>

          <div>
            <a href="">projeto-1</a>
            <h3>projetos-1</h3>
            <p>about projeto</p>
            <a href="">ir ao site</a>
            <a href="">ver video</a>
          </div>

          <div>
            <a href="">projeto-1</a>
            <h3>projetos-1</h3>
            <p>about projeto</p>
            <a href="">ir ao site</a>
            <a href="">ver video</a>
          </div>

        </main>

        <footer>
          <div>
          <h3>Meu Email:</h3>
          <a href="">matheuslouzadaa@gmail.com</a>
          </div>

          <div>
            <a href="">Github</a>
            <a href="">LinkedIn</a>
          </div>
        
        </footer>

        
      </div>
    </>
  )
}

export default App
