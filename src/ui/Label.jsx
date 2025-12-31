export default function label({styles, children, ...props}) {
    return (
        <label className={`${styles} cursor-none`} {...props}>
            {children}
        </label>
    );
}