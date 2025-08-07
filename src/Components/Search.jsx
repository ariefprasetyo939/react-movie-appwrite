export default function SearchMovies({searchTerm, setSearchTerm}){
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="Search Icon"/>
                <input type="text"
                       placeholder="Search you favourite movie"
                       value={searchTerm}
                       onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
        </div>
    )
}