import { useMemo, useState } from "react";
import { formatCurrency } from "../utils/format";

const RANGES = [
  { id: "7", label: "7D", size: 7 },
  { id: "14", label: "14D", size: 14 },
  { id: "30", label: "30D", size: 30 },
  { id: "all", label: "All", size: Infinity }
];

const buildSmoothPath = (points) => {
  if (!points.length) {
    return "";
  }

  const [start] = points;
  let path = `M ${start.x} ${start.y}`;

  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const current = points[index];
    const midX = (prev.x + current.x) / 2;
    path += ` Q ${midX} ${prev.y} ${current.x} ${current.y}`;
  }

  return path;
};

export function CashflowChart({ series, currency }) {
  const [range, setRange] = useState("30");
  const [hoverIndex, setHoverIndex] = useState(null);

  const selectedRange = RANGES.find((item) => item.id === range) || RANGES[2];
  const displayedSeries = useMemo(() => {
    if (!Number.isFinite(selectedRange.size)) {
      return series;
    }
    return series.slice(-selectedRange.size);
  }, [selectedRange.size, series]);

  if (!series.length || !displayedSeries.length) {
    return <div className="empty-state">No cashflow data yet.</div>;
  }

  const values = displayedSeries.map((item) => item.value);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const rangeValue = max - min || 1;
  const step = displayedSeries.length > 1 ? 100 / (displayedSeries.length - 1) : 0;

  const pointData = values.map((value, index) => {
    const x = Number((index * step).toFixed(2));
    const y = Number((100 - ((value - min) / rangeValue) * 100).toFixed(2));
    return { x, y, value, label: displayedSeries[index]?.label };
  });

  const points = pointData.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPath = `${points} 100,100 0,100`;
  const path = buildSmoothPath(pointData);
  const zeroY = Number((100 - ((0 - min) / rangeValue) * 100).toFixed(2));
  const net = values.reduce((sum, value) => sum + value, 0);
  const avg = net / (values.length || 1);
  const maxPoint = pointData.reduce((acc, point) => (point.value > acc.value ? point : acc), pointData[0]);
  const minPoint = pointData.reduce((acc, point) => (point.value < acc.value ? point : acc), pointData[0]);
  const hoverPoint = hoverIndex != null ? pointData[hoverIndex] : null;

  const handleMouseMove = (event) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const offset = event.clientX - left;
    const ratio = Math.min(Math.max(offset / width, 0), 1);
    const index = Math.round(ratio * (pointData.length - 1));
    setHoverIndex(index);
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="stat-label">Cashflow</div>
          <div className="stat-value">{formatCurrency(net, currency)}</div>
          <div className="chart-subtitle">
            Avg/day {formatCurrency(avg, currency)}
          </div>
        </div>
        <div className="chart-toolbar">
          {RANGES.map((item) => (
            <button
              key={item.id}
              className={`chart-button ${item.id === range ? "active" : ""}`}
              type="button"
              onClick={() => setRange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <svg
        className="chart-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="cashflow-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line className="chart-zero" x1="0" y1={zeroY} x2="100" y2={zeroY} />
        <polygon className="chart-area" points={areaPath} fill="url(#cashflow-area)" />
        <path className="chart-line" d={path} />
        {hoverPoint ? (
          <g>
            <line
              className="chart-hover"
              x1={hoverPoint.x}
              y1="0"
              x2={hoverPoint.x}
              y2="100"
            />
            <circle
              className="chart-marker"
              cx={hoverPoint.x}
              cy={hoverPoint.y}
              r="2.5"
            />
          </g>
        ) : null}
      </svg>
      <div className="chart-axis">
        <span>{displayedSeries[0]?.label}</span>
        <span>{displayedSeries[displayedSeries.length - 1]?.label}</span>
      </div>
      <div className="chart-insights">
        <div>
          <span className="muted">High</span>
          <span>{formatCurrency(maxPoint.value, currency)}</span>
        </div>
        <div>
          <span className="muted">Low</span>
          <span>{formatCurrency(minPoint.value, currency)}</span>
        </div>
        <div>
          <span className="muted">Latest</span>
          <span>
            {hoverPoint
              ? formatCurrency(hoverPoint.value, currency)
              : formatCurrency(pointData[pointData.length - 1]?.value, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CategoryBreakdownChart({ items, currency }) {
  if (!items.length) {
    return <div className="empty-state">Add expenses to see category trends.</div>;
  }

  const total = items.reduce((sum, item) => sum + item.total, 0) || 1;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <div className="stat-label">Category spend</div>
          <div className="stat-value">{formatCurrency(total, currency)}</div>
        </div>
        <span className="pill">This month</span>
      </div>
      <div className="bar-list">
        {items.map((item) => {
          const percent = Math.round((item.total / total) * 100);
          return (
            <div className="bar-row" key={item.id}>
              <div className="bar-head">
                <span className="list-title">{item.name}</span>
                <span className="amount expense">
                  {formatCurrency(item.total, currency)}
                </span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
