export default function Form({ role, children="", onSubmit, styles }) {
    return (
        <form aria-label={role} className={styles} onSubmit={onSubmit}>
            {children}
        </form>
    );
}