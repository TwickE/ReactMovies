import { SearchProps } from "../types/interfaces"
import { useTranslation } from "react-i18next"

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
    const {t} = useTranslation("global");

    return (
        <div className='search'>
            <div>
                <img src="search.svg" alt="search" />
                <input
                    type="text"
                    placeholder={t("search.placeholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )
}

export default Search