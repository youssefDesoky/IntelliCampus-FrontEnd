export default function Fahim({style}) {
    return (
        <div id="fahim" className={`fixed bottom-2 right-2 w-40 h-40 ${style}`}>
            <video
                src="videos/Fahim_Welcome_1.5x_4k.webm"
                type="video/webm"
                autoPlay
                muted
            ></video>
        </div>
    );
}