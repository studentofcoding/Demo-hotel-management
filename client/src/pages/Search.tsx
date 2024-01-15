import { useSearchContext } from "../Context/SearchContext";

const Search = () => {
    const search = useSearchContext();
    console.log(search);

    return (
        <div>
            <p>Search Page</p>
        </div>
    );
};

export default Search;