import SearchIcon from "./icons/SearchIcon";

export default function SearchBar({placeholder, className=""}) {
    return (
        <div className={`flex items-center border border-border-primary-focus-light dark:border-border-primary-focus-dark rounded-md px-3 py-2 w-full max-w-160 ${className}`}>
            <SearchIcon className="w-5 h-5 text-icon-secondary-default-light dark:text-icon-secondary-default-dark mr-2" />
            <input
                type="text"
                placeholder={placeholder}
                className="w-full outline-none placeholder:text-text-primary-default-light dark:placeholder:text-text-primary-default-dark"
            />
        </div>
    );
}