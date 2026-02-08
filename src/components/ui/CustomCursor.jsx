import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
    const cursorRef = useRef(null);
    const imgRef = useRef(null);
    const defaultSrc = "/cursors/FahimFinger.cur";
    const inputFallback = "/cursors/FahimAntenna.cur";  
    const [hasMouse] = useState(() => window.matchMedia('(pointer: fine)').matches);

    useEffect(() => {
        if (!hasMouse) return;

        const moveCursor = (e) => {
            if (!cursorRef.current) return;
            cursorRef.current.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
            cursorRef.current.style.opacity = "1";
        };

        const hideCursor = () => {
            if (!cursorRef.current) return;
            cursorRef.current.style.opacity = "0";
        };

        const showCursor = () => {
            if (!cursorRef.current) return;
            cursorRef.current.style.opacity = "1";
        };

        const handleDocMouseOut = (e) => {
            if (!e.relatedTarget && !e.toElement) hideCursor();
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseout", handleDocMouseOut);
        window.addEventListener("blur", hideCursor);
        window.addEventListener("focus", showCursor);
        window.addEventListener("mouseenter", showCursor);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseout", handleDocMouseOut);
            window.removeEventListener("blur", hideCursor);
            window.removeEventListener("focus", showCursor);
            window.removeEventListener("mouseenter", showCursor);
        };
    }, [hasMouse]);

    useEffect(() => {
        if (!hasMouse) return;

        const enterClickable = () => {
            return () => {
            if (!cursorRef.current || !imgRef.current) return;
            cursorRef.current.classList.add("clickable");
            imgRef.current.style.transform = "rotateY(0deg) rotateZ(-45deg)";
            };
        };

        const leaveClickable = () => {
            if (!cursorRef.current || !imgRef.current) return;
            cursorRef.current.classList.remove("clickable");
            imgRef.current.style.transform = "rotateY(180deg)";
        };

        const clickEls = Array.from(document.querySelectorAll("button, a, label, [data-cursor='clickable']"));
        clickEls.forEach((el) => {
            el.addEventListener("mouseenter", enterClickable(el));
            el.addEventListener("mouseleave", leaveClickable);
        });

        const inputSelector = "input, textarea, select, [data-cursor='input']";
        const inputEls = Array.from(document.querySelectorAll(inputSelector));
        const enterInputHandlers = new Map();

        inputEls.forEach((el) => {
            const src = el.getAttribute("data-cursor-src") || inputFallback;
            const onEnter = () => {
            if (!imgRef.current) return;
            imgRef.current.src = src;
            };
            const onLeave = () => {
            if (!imgRef.current) return;
            imgRef.current.src = defaultSrc;
            };
            enterInputHandlers.set(el, { onEnter, onLeave });
            el.addEventListener("mouseenter", onEnter);
            el.addEventListener("mouseleave", onLeave);
        });

        return () => {
            clickEls.forEach((el) => {
            el.removeEventListener("mouseenter", enterClickable(el));
            el.removeEventListener("mouseleave", leaveClickable);
            });
            inputEls.forEach((el) => {
            const handlers = enterInputHandlers.get(el);
            if (handlers) {
                el.removeEventListener("mouseenter", handlers.onEnter);
                el.removeEventListener("mouseleave", handlers.onLeave);
            }
            });
        };
    }, [hasMouse, defaultSrc, inputFallback]);

    if (!hasMouse) return null;

    return (
        <div
            ref={cursorRef}
            className="custom-cursor fixed top-0 left-0 w-10 h-10 pointer-events-none z-9999 transition-opacity duration-200"
            style={{ opacity: 1 }}
        >
            <img
                ref={imgRef}
                src={defaultSrc}
                alt="Custom Cursor"
                className="w-full h-full object-cover transform transition-transform duration-0 ease-linear rotate-y-180"
            />
        </div>
    );
}
