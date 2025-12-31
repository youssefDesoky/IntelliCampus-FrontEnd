export default function Button({styles, children, onClick, ...props}) {
    return (
        <button className={`${styles}`} onClick={onClick} {...props}>
            {children}
        </button>
    );
}