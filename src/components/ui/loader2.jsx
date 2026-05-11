export default function SpinnerMini() {
  return (
    <>
      <div className="relative w-[9px] h-[9px]">
        <div className="spinner-bar [--delay:0.1] [--rotation:36]"></div>
        <div className="spinner-bar [--delay:0.2] [--rotation:72]"></div>
        <div className="spinner-bar [--delay:0.3] [--rotation:108]"></div>
        <div className="spinner-bar [--delay:0.4] [--rotation:144]"></div>
        <div className="spinner-bar [--delay:0.5] [--rotation:180]"></div>
        <div className="spinner-bar [--delay:0.6] [--rotation:216]"></div>
        <div className="spinner-bar [--delay:0.7] [--rotation:252]"></div>
        <div className="spinner-bar [--delay:0.8] [--rotation:288]"></div>
        <div className="spinner-bar [--delay:0.9] [--rotation:324]"></div>
        <div className="spinner-bar [--delay:1] [--rotation:360]"></div>
      </div>

      <style>
        {`
        .spinner-bar {
          position: absolute;
          width: 50%;
          height: 150%;
          background: #000;
          --translation: 150;
          transform: rotate(calc(var(--rotation) * 1deg))
            translate(0, calc(var(--translation) * 1%));
          animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
        }

        @keyframes spinner-fzua35 {
          0%,10%,20%,30%,50%,60%,70%,80%,90%,100% {
            transform: rotate(calc(var(--rotation) * 1deg))
              translate(0, calc(var(--translation) * 1%));
          }

          50% {
            transform: rotate(calc(var(--rotation) * 1deg))
              translate(0, calc(var(--translation) * 1.5%));
          }
        }
        `}
      </style>
    </>
  );
}
