import React from 'react'

const Header = (props) => {
  const [search, setSearch] = React.useState('')

  function handleSubmit (e){
    e.preventDefault()
    e.target.reset()
    props.SearchData(search)
  }
  
  return (
    <div>
        <div className="header">
          <h1>Newsy</h1> 
          <form onSubmit={handleSubmit} className='inputCnt'>

            <input className='search' 
              type="text"
              name="search"
              id="search"
              placeholder='search'
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
            />

            <button type="submit" className='submitBtn'>Search</button>
          </form>
        </div>
    </div>
  )
}

export default Header