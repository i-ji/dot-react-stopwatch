import { useState } from "react";

type Logs = {
  id: number;
  time: string;
  rap: number | null;
  elapsed: string;
};

let startTime: number;

const StopWatch = () => {
  // 画面に表示される時間
  const [displayedTime, setDisplayedTime] = useState("00:00.000");
  // ストップ時の残り時間
  const [elapsedTime, setElapsedTime] = useState(0);
  // timeoutId
  const [timeoutId, setTimeoutId] = useState<number | null>(null);
  // 開始時刻
  // const [startTime, setStartTime] = useState<number | null>(null);

  // カウントダウンの処理
  const countUp = () => {
    const d = new Date(Date.now() - startTime! + elapsedTime);
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ms = d.getMilliseconds();
    setDisplayedTime(
      `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(
        ms
      ).padStart(3, "0")}`
    );

    setTimeoutId(
      setTimeout(() => {
        countUp();
      }, 10)
    );
  };

  // 初期のボタン状態
  const buttonStateInitial = {
    start: false,
    stop: true,
    reset: true,
    rap: true,
  };

  // 起動中のボタン状態
  const buttonStateRunning = {
    start: true,
    stop: false,
    reset: true,
    rap: false,
  };

  // 停止中のボタン状態
  const buttonStateStopped = {
    start: false,
    stop: true,
    reset: false,
    rap: true,
  };

  // ボタンの状態管理
  const [buttonState, setButtonState] = useState(buttonStateInitial);

  // スタートボタンの処理
  const start = () => {
    setButtonState(buttonStateRunning);
    // setStartTime(now);

    startTime = Date.now();
    countUp();
  };

  // ラップタイム
  const createRap = () => {
    let rapTime: number;
    const d = new Date(Date.now() - startTime! + elapsedTime);
    const m = d.getMinutes();
    const s = d.getSeconds();
    const ms = d.getMilliseconds();
    logs.unshift({
      id: logs.length + 1,
      time: `${m * 60 + s}.${ms}`,
      rap: null,
      elapsed: displayedTime,
    });

    if (logs.length === 1) {
      rapTime = Number(logs[0].time);
    } else {
      rapTime = Number(
        (Number(logs[0].time) - Number(logs[1].time)).toFixed(3)
      );
    }
    logs[0].rap = rapTime;

    setLogs(logs);
  };

  // ストップボタンの処理
  const stop = () => {
    clearInterval(timeoutId!);
    setElapsedTime((prev) => prev + Date.now() - startTime!);
    setButtonState(buttonStateStopped);
    createRap();
  };

  // リセットボタンの処理
  const reset = () => {
    setDisplayedTime("00:00.000");
    setElapsedTime(0);
    setButtonState(buttonStateInitial);
    setLogs([]);
  };

  const [logs, setLogs] = useState<Logs[]>([]);

  // ラップボタンの処理
  const rap = () => {
    createRap();
  };

  return (
    <main className="w-[300px] mx-auto mt-5 bg-white p-[15px] text-center">
      <div className="bg-gray-300 h-[120px] leading-[120px] text-[40px] mb-[15px]">
        {displayedTime}
      </div>

      <div className="flex justify-between gap-[10px]">
        <button
          onClick={start}
          disabled={buttonState.start}
          className={`w-20 h-[45px] leading-[45px] bg-gray-300 font-bold ${
            buttonState.start ? "opacity-60" : ""
          }`}
        >
          Start
        </button>
        <button
          onClick={stop}
          disabled={buttonState.stop}
          className={`w-20 h-[45px] leading-[45px] bg-gray-300 font-bold ${
            buttonState.stop ? "opacity-60" : ""
          }`}
        >
          Stop
        </button>
        <button
          onClick={reset}
          disabled={buttonState.reset}
          className={`w-20 h-[45px] leading-[45px] bg-gray-300 font-bold ${
            buttonState.reset ? "opacity-60" : ""
          }`}
        >
          Reset
        </button>
        <button
          onClick={rap}
          disabled={buttonState.rap}
          className={`w-20 h-[45px] leading-[45px] bg-gray-300 font-bold ${
            buttonState.rap ? "opacity-60" : ""
          }`}
        >
          Rap
        </button>
      </div>
      <div className="flex justify-between mt-10 mb-5">
        <div>ラップ数</div>
        <div>経過タイム</div>
        <div>ラップタイム</div>
      </div>
      <ul>
        {logs.map((log) => {
          return (
            <li key={log.id} className="flex justify-between">
              <div>ラップ{log.id}</div>
              <div>{log.elapsed}</div>
              <div>{`${String(Math.floor(log.rap! / 60)).padStart(
                2,
                "0"
              )}:${String(Math.floor(log.rap! % 60)).padStart(2, "0")}.${String(
                log.rap!
              )
                .split(".")[1]
                .padStart(3, "0")}`}</div>
            </li>
          );
        })}
      </ul>
    </main>
  );
};
export default StopWatch;

// disabled
// initial Start: false, Stop: true,  Reset: true,  Rap: true
// running Start: true,  Stop: false, Reset: true,  Rap: false
// Stopped Start: false, Stop: true , Reset: false, Rap: true
