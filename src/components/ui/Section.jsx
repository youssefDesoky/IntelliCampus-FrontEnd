export default function Section({ children, className = "", ...props }) {
    return (
        <section className={className} {...props}>
            {children}
        </section>
    );
}