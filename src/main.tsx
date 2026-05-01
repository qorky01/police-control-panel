import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import * as React from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Car,
  Mic,
  Power,
  RotateCcw,
  Shield,
  Siren,
  Volume2,
  Waves,
} from "lucide-react";
import "./styles.css";

type ButtonGroup =
  | "siren"
  | "light"
  | "direction"
  | "display"
  | "utility"
  | "audio"
  | "mic";

type PanelButton = {
  id: string;
  label: string;
  group: ButtonGroup;
  color: "red" | "blue" | "green" | "amber" | "white";
  statusText: string;
  exclusive?: boolean;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const buttons: PanelButton[] = [
  {
    id: "siren-wail",
    label: "경광",
    group: "siren",
    color: "red",
    statusText: "경광 사이렌 작동",
    exclusive: true,
    icon: Siren,
  },
  {
    id: "siren-yelp",
    label: "경음",
    group: "siren",
    color: "red",
    statusText: "경음 패턴 작동",
    exclusive: true,
    icon: Bell,
  },
  {
    id: "display-front",
    label: "전광",
    group: "display",
    color: "amber",
    statusText: "전광판 표시 ON",
    icon: Shield,
  },
  {
    id: "display-stop",
    label: "정지",
    group: "display",
    color: "amber",
    statusText: "정지 안내 표시",
    exclusive: true,
    icon: Car,
  },
  {
    id: "light-blue",
    label: "청색",
    group: "light",
    color: "blue",
    statusText: "청색 LED 점멸",
    icon: Waves,
  },
  {
    id: "light-red",
    label: "적색",
    group: "light",
    color: "red",
    statusText: "적색 LED 점멸",
    icon: Waves,
  },
  {
    id: "left",
    label: "좌",
    group: "direction",
    color: "green",
    statusText: "좌측 유도 신호",
    exclusive: true,
    icon: ArrowLeft,
  },
  {
    id: "up",
    label: "상",
    group: "direction",
    color: "green",
    statusText: "전방 유도 신호",
    exclusive: true,
    icon: ArrowUp,
  },
  {
    id: "down",
    label: "하",
    group: "direction",
    color: "green",
    statusText: "후방 유도 신호",
    exclusive: true,
    icon: ArrowDown,
  },
  {
    id: "right",
    label: "우",
    group: "direction",
    color: "green",
    statusText: "우측 유도 신호",
    exclusive: true,
    icon: ArrowRight,
  },
  {
    id: "speaker",
    label: "스피커",
    group: "audio",
    color: "white",
    statusText: "외부 스피커 연결",
    icon: Volume2,
  },
  {
    id: "mic",
    label: "마이크",
    group: "mic",
    color: "white",
    statusText: "마이크 입력 대기",
    icon: Mic,
  },
  {
    id: "reset",
    label: "리셋",
    group: "utility",
    color: "white",
    statusText: "시스템 초기화 완료",
    icon: RotateCcw,
  },
  {
    id: "power",
    label: "전원",
    group: "utility",
    color: "blue",
    statusText: "컨트롤 패널 전원",
    icon: Power,
  },
];

const colorLabels = {
  red: "red",
  blue: "blue",
  green: "green",
  amber: "amber",
  white: "white",
} as const;

function playBeep(isActive: boolean) {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) {
    return;
  }

  const audio = new AudioContextCtor();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const now = audio.currentTime;

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(isActive ? 920 : 520, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.06, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
}

function App() {
  const [activeIds, setActiveIds] = React.useState<Set<string>>(
    () => new Set(["power"]),
  );
  const [status, setStatus] = React.useState("대기 중");
  const [logs, setLogs] = React.useState<string[]>(["전원 준비"]);

  const activeButtons = buttons.filter((button) => activeIds.has(button.id));
  const displayModes = activeButtons
    .filter((button) => button.group !== "utility")
    .slice(0, 4);

  function handlePress(button: PanelButton) {
    setActiveIds((current) => {
      const next = new Set(current);
      const wasActive = next.has(button.id);

      if (button.id === "reset") {
        playBeep(false);
        setStatus(button.statusText);
        setLogs((items) => [button.statusText, ...items].slice(0, 5));
        return new Set(["power"]);
      }

      if (button.exclusive && !wasActive) {
        for (const other of buttons) {
          if (other.group === button.group) {
            next.delete(other.id);
          }
        }
      }

      if (wasActive && button.id !== "power") {
        next.delete(button.id);
      } else {
        next.add(button.id);
      }

      const nowActive = next.has(button.id);
      playBeep(nowActive);
      setStatus(nowActive ? button.statusText : `${button.label} 해제`);
      setLogs((items) =>
        [`${button.label} ${nowActive ? "ON" : "OFF"}`, ...items].slice(0, 5),
      );
      return next;
    });
  }

  return (
    <main className="stage" aria-label="경찰차 제어장치 웹앱">
      <section className="control-panel" aria-label="정방형 경찰차 제어 패널">
        <div className="panel-shell">
          <div className="top-rail">
            <div className="port-lights" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="brand">
              <strong>POLICE SY</strong>
              <span>UNIT CONTROL</span>
            </div>
            <div className="signal-dot is-blue" aria-hidden="true" />
          </div>

          <div className="display-bank">
            <div className="display-left">
              <span className="display-kicker">상태</span>
              <strong>{status}</strong>
              <div className="meter" aria-hidden="true">
                {Array.from({ length: 14 }).map((_, index) => (
                  <span
                    key={index}
                    className={index < Math.max(3, activeButtons.length + 4) ? "lit" : ""}
                  />
                ))}
              </div>
            </div>
            <div className="display-center">
              <span className="warning-mark">!</span>
              <div>
                <strong>비상 제어</strong>
                <span>
                  {displayModes.length
                    ? displayModes.map((button) => button.label).join(" · ")
                    : "안전 대기"}
                </span>
              </div>
            </div>
            <div className="display-right">
              {logs.map((log) => (
                <span key={log}>{log}</span>
              ))}
            </div>
          </div>

          <div className="button-grid">
            {buttons.map((button) => {
              const Icon = button.icon;
              const isActive = activeIds.has(button.id);
              return (
                <button
                  key={button.id}
                  type="button"
                  data-testid={`panel-button-${button.id}`}
                  className={`panel-button tone-${colorLabels[button.color]} ${
                    isActive ? "is-active" : ""
                  } group-${button.group}`}
                  onClick={() => handlePress(button)}
                  aria-pressed={isActive}
                >
                  <span className="button-led" aria-hidden="true" />
                  <span className="button-face">
                    {Icon ? <Icon size={20} strokeWidth={2.4} /> : null}
                    <span>{button.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="lower-console">
            <div className="reference-strip" aria-label="참고 사진">
              <img src="/police-control-panel/reference-panel.jpg" alt="경찰차 실제 제어장치 참고 사진" />
            </div>
            <div className="knob" aria-hidden="true">
              <span />
            </div>
            <div className="mic-jack">
              <span>마이크</span>
              <div aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
