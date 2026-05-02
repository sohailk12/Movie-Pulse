
const Search = ({searchTerm,setSearchTerm}) => {
  return (

    <div className="search">
        <div>
            <img src="/search.svg" alt="Search Icon" />
            <input 
            type="text"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
             />
             {
              searchTerm.length>0 ? 
              <button 
              className="text-red-500 cursor-pointer 
              hover:bg-red-500 
              hover:text-white 
              hover:border-red-600 
              px-2  
              border-2 rounded-full" 
              onClick={()=>setSearchTerm('')
              }>X</button>: ''
             }
        </div>
    </div>
  )
}

export default Search