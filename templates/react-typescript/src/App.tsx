import React from 'react'
import './style.less'

interface IProps {
  name: string
  age: number
}

function App(props: IProps) {
  const { name, age } = props

  return (
    <div className="app">
      <span className="hhh">{`Hello! I'm ${name}, ${age} years old.`}</span>
    </div>
  )
}

export default App
