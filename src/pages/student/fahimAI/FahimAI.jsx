import FahimAIBody from "./FahimBody/FahimAIBody";
import FahimAIHeader from "./FahimHeader/FahimAIHeader";
import FahimAIFooter from "./FahimFooter/FahimAIFooter";

export default function FahimAI() {
  const iconStyles = "w-6 h-6 fill-current text-gray-600 hover:text-blue-500 transition-colors duration-200 cursor-pointer";

  const fahimIcon = 
    <div style={{width: "240px", height: "240px", zIndex: 1000, borderRadius: "10px", overflow: "hidden", cursor: "pointer"}} onClick={() => window.open("https://www.google.com","_blank")}>
        <video 
            src="Hailuo_Video_make_him_intreduce_him_self_an_457837616222322696.webm" 
            type="video/webm"
            autoplay="true" 
            muted="true" 
            style={{width: "100%", height: "100%", objectFit: "cover"}}
            >
        </video>
    </div>;

  const chatHistoryIcon = 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={iconStyles}>
      <path d="M320 128C426 128 512 214 512 320C512 426 426 512 320 512C254.8 512 197.1 479.5 162.4 429.7C152.3 415.2 132.3 411.7 117.8 421.8C103.3 431.9 99.8 451.9 109.9 466.4C156.1 532.6 233 576 320 576C461.4 576 576 461.4 576 320C576 178.6 461.4 64 320 64C234.3 64 158.5 106.1 112 170.7L112 144C112 126.3 97.7 112 80 112C62.3 112 48 126.3 48 144L48 256C48 273.7 62.3 288 80 288L104.6 288C105.1 288 105.6 288 106.1 288L192.1 288C209.8 288 224.1 273.7 224.1 256C224.1 238.3 209.8 224 192.1 224L153.8 224C186.9 166.6 249 128 320 128zM344 216C344 202.7 333.3 192 320 192C306.7 192 296 202.7 296 216L296 320C296 326.4 298.5 332.5 303 337L375 409C384.4 418.4 399.6 418.4 408.9 409C418.2 399.6 418.3 384.4 408.9 375.1L343.9 310.1L343.9 216z"/>
    </svg>

  const moreOptionsIcon = 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={iconStyles}>
      <path d="M320 208C289.1 208 264 182.9 264 152C264 121.1 289.1 96 320 96C350.9 96 376 121.1 376 152C376 182.9 350.9 208 320 208zM320 432C350.9 432 376 457.1 376 488C376 518.9 350.9 544 320 544C289.1 544 264 518.9 264 488C264 457.1 289.1 432 320 432zM376 320C376 350.9 350.9 376 320 376C289.1 376 264 350.9 264 320C264 289.1 289.1 264 320 264C350.9 264 376 289.1 376 320z"/>
    </svg>

  const sendQuestionIcon = 
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={iconStyles}>
      <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480l0-83.6c0-4 1.5-7.8 4.2-10.8L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z"/>
    </svg>

  const voiceInputIcon =
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={iconStyles}>
      <path d="M192 0C139 0 96 43 96 96l0 160c0 53 43 96 96 96s96-43 96-96l0-160c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 89.1 66.2 162.7 152 174.4l0 33.6-48 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0 0-33.6c85.8-11.7 152-85.3 152-174.4l0-40c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 40c0 70.7-57.3 128-128 128s-128-57.3-128-128l0-40z"/>
    </svg>

  const user = {
    Name: "Youssef Ahmed",
    Icon: 
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
        <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
      </svg>
  }

  return (
    <section className="fahim-ai-section bg-white shadow-md rounded-lg mt-6">
      <div className="container mx-auto px-4">
        <FahimAIHeader
          fahimIcon={fahimIcon}
          chatHistoryIcon={chatHistoryIcon}
          moreOptionsIcon={moreOptionsIcon}
        />

        <FahimAIBody fahimIcon={fahimIcon} user={user}></FahimAIBody>

        <FahimAIFooter sendQuestionIcon={sendQuestionIcon} voiceInputIcon={voiceInputIcon} />
      </div>
    </section>
  )
}