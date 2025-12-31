import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Fahim({style}) {
    const navigate = useNavigate();
    useEffect(() => {
        document.getElementById("fahim").addEventListener("click", () => {
            navigate("/fahim");
        });
    }, [navigate]);

    useEffect(() => {
        document.getElementById("fahim").addEventListener("contextmenu", (e) => e.preventDefault());
    }, []);

    return (
        <div id="fahim" className={`fixed bottom-2 right-2 w-40 h-40 ${style}`} data-cursor="clickable">
            <video
                src="videos/Fahim_Welcome_1.25_HD.webm"
                type="video/webm"
                autoPlay
                muted
                controls={false}
                disablePictureInPicture={true}
            ></video>
        </div>
    );
}