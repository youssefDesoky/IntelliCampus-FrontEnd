import SearchBar from "../../../components/ui/SearchBar";

export default function ChatUsersHeader() {
    return (
        <div className="flex flex-col gap-2 mb-4">
            <div className="flex flex-row justify-between gap-2">
                <h3>Members</h3>
                <p>24</p>
            </div>

            <SearchBar placeholder="Search Members" onSearch={(msg) => console.log("Send message:", msg)} />
        </div>
    );
}