import { useState, useEffect } from "react";


const App = () => {
  const [value, setValue] = useState('')
  const [message, setMessage] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)

  const [loading, setLoading] = useState(false);

  const createNewChat = () => {
    setMessage(null)
    setValue('')
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue('')
  }

  const getMessages = async () => {
    setLoading(true);
    const options = {
      method: 'POST', body: JSON.stringify({
        message: value
      }), headers: {
        'Content-Type': 'application/json'
      }
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setMessage(data.choices[0].message)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false);
    }
  }

  console.log(value)

  useEffect(() => {
    if(!currentTitle && value && message) {
      setCurrentTitle(value)
    }
    if(currentTitle && value && message) {
      setPreviousChats(prevChats => ([...prevChats, {
        title: currentTitle, role: 'user', content: value
      }, {
        title: currentTitle, role: message.role, content: message.content
      }]))
    }
  }, [message, currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))

  return (<div className='app'>
    <section className='side-bar'>
      <button onClick={createNewChat}>+ New chat</button>
      <ul className='history'>
        {uniqueTitles?.map((uniqueTitle, idx) =>
          <li
            key={idx}
            onClick={() => handleClick(uniqueTitle)}
          >{uniqueTitle}</li>)}
      </ul>
      <nav>
        <p>Made by @VitaliyJC</p>
      </nav>
    </section>
    <section className='main'>
      <div className='feed-wrapper'>
        {!currentTitle ? <h1>VitaliyGPT</h1> : currentTitle}
        {loading && <div>Loading...</div>}
        <ul className='feed'>
          {currentChat.map((chatMessage, idx) => <li key={idx}>
            <p className='role'>{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
      </div>

      <div className='bottom-section'>
        {/*<form onSubmit={handleSubmit} className='input-container'>*/}
        {/*  <input name='question'/>*/}
        {/*  <button onClick={getMessages} className='submit'>➢</button>*/}
        {/*</form>*/}

        <form onSubmit={(e) => e.preventDefault()} className='input-container'>
          <input value={value} onChange={(e) => setValue(e.target.value)}/>
          <button className='submit' onClick={getMessages}>➢</button>
        </form>
        <p className='info'>
          ChstGPT ver 3.5-turbo
        </p>
      </div>
    </section>
  </div>);
}

export default App;
