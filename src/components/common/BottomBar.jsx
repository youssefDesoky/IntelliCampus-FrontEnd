export default function BottomBar({ children }) {  
  return (
    <nav 
      id="bottom-bar" 
      className={`fixed flex flex-row justify-around h-auto w-full bottom-0 left-0 z-50 p-2 border-t border-border-primary-default-light dark:border-border-primary-default-dark bg-bg-surface-primary-default-light dark:bg-bg-surface-primary-default-dark text-text-primary-active-light dark:text-text-primary-active-dark`}
    >
        {children}
    </nav>
  );
}
