export default function Button({ role, isOn = true, primaryIcon, secondaryIcon = primaryIcon, children="", onClick, styles }) {
    return (
        <button aria-label={role} className={`${styles} cursor-none`} onClick={onClick}>
            {isOn ? primaryIcon : secondaryIcon}
            {children}
        </button>
    );
}