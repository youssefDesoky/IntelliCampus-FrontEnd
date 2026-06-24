import { useState, useRef } from "react";
import TextArea from "../../../components/ui/TextArea";
import { ImageIcon } from "../../../components/ui/icons";

export default function CreateGroupPanel({
  friends = [],
  onCreate,
  onCancel,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const fileInputRef = useRef(null);

  const handleToggleFriend = (id) => {
    setSelectedFriends((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setProfileImage(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = () => {
    if (title.trim() && selectedFriends.length > 0) {
      onCreate({ title, description, members: selectedFriends, profileImage });
    }
  };

  const canCreate = title.trim() && selectedFriends.length > 0;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)] dark:shadow-none">
        <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-900/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
            <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          Create Group
        </h2>
      </div>

      {/* Scrollable Body */}
      <div className="flex flex-col gap-5 px-5 py-5 overflow-y-auto flex-1 no-scrollbar">

        {/* Group Image */}
        <div className="flex flex-col items-center gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700/80 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
          >
            {profileImage ? (
              <img src={profileImage} alt="Group" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <ImageIcon size={20} className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl" />
            <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-white dark:bg-gray-800 shadow-[0_1px_3px_rgba(0,0,0,0.12)] flex items-center justify-center">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-gray-500">
                <path d="M8 3v10M3 8h10" />
              </svg>
            </div>
          </button>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 tracking-wide">
            Group Photo — optional
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>

        {/* Group Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Group Title
          </label>
          <input
            type="text"
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-400 dark:focus:border-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none transition-all"
            placeholder="e.g. Design Team"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Description
            <span className="ml-1.5 normal-case text-gray-300 dark:text-gray-600 font-normal tracking-normal">
              — optional
            </span>
          </label>
          <TextArea
            className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-400 dark:focus:border-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none transition-all"
            placeholder="What's this group about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Members</span>
          {selectedFriends.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shadow-[inset_0_1px_2px_rgba(59,130,246,0.1)]">
              {selectedFriends.length} selected
            </span>
          )}
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        </div>

        {/* Friends List */}
        <div className="flex flex-col gap-1">
          {friends.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">No friends to add yet</p>
            </div>
          ) : (
            friends.map((friend) => {
              const isSelected = selectedFriends.includes(friend.id);
              return (
                <button
                  key={friend.id}
                  onClick={() => handleToggleFriend(friend.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-800 shadow-[0_1px_3px_rgba(59,130,246,0.08)]"
                      : "hover:bg-white dark:hover:bg-gray-800/60 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:hover:shadow-none hover:ring-1 hover:ring-gray-100 dark:hover:ring-gray-700/50"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}>
                    {friend.name?.[0]?.toUpperCase() ?? "?"}
                  </div>

                  {/* Name */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate leading-tight transition-colors ${
                      isSelected ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-100"
                    }`}>
                      {friend.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight">
                      ID: {friend.id}
                    </p>
                  </div>

                  {/* Checkmark */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all shrink-0 ${
                    isSelected
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}>
                    {isSelected && (
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-2 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!canCreate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:active:scale-95 shadow-[0_1px_2px_rgba(59,130,246,0.3)] hover:shadow-[0_2px_4px_rgba(59,130,246,0.4)] transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v10M3 8h10" />
          </svg>
          Create Group
        </button>
      </div>
    </div>
  );
}