import { useEffect, useRef } from "react";

const AnalogWatch = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  const SIZE = 56;
  const CENTER = SIZE / 2;
  const DIAL_RADIUS = 22; // ONE radius for everything

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours() % 12;

      secondRef.current.style.transform = `rotate(${s * 6}deg)`;
      minuteRef.current.style.transform = `rotate(${m * 6 + s * 0.1}deg)`;
      hourRef.current.style.transform = `rotate(${h * 30 + m * 0.5}deg)`;
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const pos = (angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      left: CENTER + DIAL_RADIUS * Math.sin(rad),
      top: CENTER - DIAL_RADIUS * Math.cos(rad),
    };
  };

  return (
    <div className="w-14 h-14">
      <div className="relative w-full h-full rounded-full bg-black border border-slate-600 box-border">

        {/* DIGITS */}
        {[12, 3, 6, 9].map((n) => {
          const angle = n === 12 ? 0 : n === 3 ? 90 : n === 6 ? 180 : 270;
          const { left, top } = pos(angle);

          return (
            <div
              key={n}
              className="absolute text-[9px] font-semibold text-white"
              style={{
                left,
                top,
                transform: "translate(-50%, -50%)",
              }}
            >
              {n}
            </div>
          );
        })}

        {/* DASH MARKERS */}
        {[...Array(12)].map((_, i) => {
          if ([0, 3, 6, 9].includes(i)) return null;

          const angle = i * 30;
          const { left, top } = pos(angle);

          return (
            <div
              key={i}
              className="absolute w-[6px] h-[1px] bg-slate-400"
              style={{
                left,
                top,
                transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              }}
            />
          );
        })}

        {/* HANDS */}
        <div
          ref={hourRef}
          className="absolute left-1/2 top-1/2 h-4 w-[3px] bg-white origin-bottom
          -translate-x-1/2 -translate-y-full rounded"
        />
        <div
          ref={minuteRef}
          className="absolute left-1/2 top-1/2 h-5 w-[2px] bg-indigo-200 origin-bottom
          -translate-x-1/2 -translate-y-full rounded"
        />
        <div
          ref={secondRef}
          className="absolute left-1/2 top-1/2 h-6 w-[1.5px] bg-yellow-400 origin-bottom
          -translate-x-1/2 -translate-y-full"
        />

        <div className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full
        -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
};

export default AnalogWatch;
