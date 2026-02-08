export default function Section({ children, className = "", ...props }) {
    return (
        <section className={`${className} mb-6`} {...props}>
            {children}
        </section>
    );
}