export default function Layout({header, aside, children}) {
    return (
        <div className="min-h-screen bg-page-bg-light text-primary-text-light dark:bg-page-bg-dark dark:text-primary-text-dark">
            <div className="mx-auto flex">
                {header}
                
                {aside}

                <main className="container mx-auto mt-20 py-6" style={{paddingLeft: 'var(--sidebar-width)'}}>
                    {children}
                </main>
            </div>
        </div>
    );
}