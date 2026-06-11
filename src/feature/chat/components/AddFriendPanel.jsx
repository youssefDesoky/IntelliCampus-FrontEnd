import React from "react";

export default function AddFriendPanel({
  friendId,
  setFriendId,
  friendRequests,
  onInvite,
  onBack,
  onAcceptRequest,
  onDeclineRequest,
}) {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04)] dark:shadow-none">
        <button
          onClick={onBack}
          className="flex items-center justify-center w-8 h-8 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-all active:scale-90"
          aria-label="Back to chat"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 12L6 8l4-4" />
          </svg>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M19 8v6M16 11h6" />
            </svg>
          </div>
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Add Friend
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-5 py-5 overflow-y-auto flex-1">
        {/* Search / Invite Section */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Invite by ID
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M11 11l3 3" />
                </svg>
              </span>
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-400 dark:focus:border-blue-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] dark:shadow-none transition-all"
                placeholder="Enter friend ID…"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onInvite()}
              />
            </div>
            <button
              onClick={onInvite}
              disabled={!friendId.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 active:scale-95 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_1px_2px_rgba(59,130,246,0.3)] hover:shadow-[0_2px_4px_rgba(59,130,246,0.4)] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v10M3 8h10" />
              </svg>
              Send
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">Requests</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />
        </div>

        {/* Friend Requests Section */}
        <div className="flex flex-col gap-1.5">
          {friendRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]">
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <circle cx="8" cy="5" r="3" />
                  <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                </svg>
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">No pending requests</p>
            </div>
          ) : (
            friendRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white dark:hover:bg-gray-800/60 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:hover:shadow-none hover:ring-1 hover:ring-gray-100 dark:hover:ring-gray-700/50 transition-all group"
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  {req.avatar ? (
                    <img
                      className="w-9 h-9 rounded-xl object-cover shrink-0 ring-1 ring-gray-100 dark:ring-gray-700/50"
                      src={req.avatar}
                      alt={req.name}
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center shrink-0 ring-1 ring-gray-100 dark:ring-gray-700/50">
                      <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate leading-tight">
                      {req.name}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight">
                      ID: {req.id}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onAcceptRequest(req.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 hover:shadow-[0_1px_2px_rgba(34,197,94,0.2)] active:scale-95 transition-all"
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8l4 4 6-7" />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() => onDeclineRequest(req.id)}
                    className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 active:scale-90 transition-all"
                    aria-label="Decline"
                  >
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M4 4l8 8M12 4l-8 8" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}