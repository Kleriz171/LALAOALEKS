import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../animations';

interface RadarDataPoint {
  label: string;
  value: number;
  maxValue?: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  size?: number;
  color?: string;
  levels?: number;
}

export default function RadarChart({
  data,
  size = 200,
  color = COLORS.primary,
  levels = 4,
}: RadarChartProps) {
  const center = size / 2;
  const radius = size / 2 - 30;

  const { points, gridPolygons, axisLines } = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length;
    const startAngle = -Math.PI / 2;

    const pts = data.map((d, i) => {
      const angle = startAngle + i * angleStep;
      const normalizedValue = d.value / (d.maxValue || 100);
      const clampedValue = Math.min(Math.max(normalizedValue, 0), 1);
      return {
        x: center + radius * clampedValue * Math.cos(angle),
        y: center + radius * clampedValue * Math.sin(angle),
        labelX: center + (radius + 18) * Math.cos(angle),
        labelY: center + (radius + 18) * Math.sin(angle),
        ...d,
      };
    });

    const grids = Array.from({ length: levels }, (_, level) => {
      const r = (radius / levels) * (level + 1);
      return data.map((_, i) => {
        const angle = startAngle + i * angleStep;
        return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
      }).join(' ');
    });

    const axes = data.map((_, i) => {
      const angle = startAngle + i * angleStep;
      return {
        x2: center + radius * Math.cos(angle),
        y2: center + radius * Math.sin(angle),
      };
    });

    return { points: pts, gridPolygons: grids, axisLines: axes };
  }, [data, size]);

  const dataPolygon = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {gridPolygons.map((polygon, i) => (
          <Polygon key={i} points={polygon} fill="none" stroke={COLORS.border} strokeWidth={0.5} opacity={0.5} />
        ))}

        {axisLines.map((axis, i) => (
          <Line key={i} x1={center} y1={center} x2={axis.x2} y2={axis.y2} stroke={COLORS.border} strokeWidth={0.5} opacity={0.3} />
        ))}

        <Polygon points={dataPolygon} fill={color} fillOpacity={0.2} stroke={color} strokeWidth={2} />

        {points.map((pt, i) => (
          <React.Fragment key={i}>
            <Circle cx={pt.x} cy={pt.y} r={4} fill={color} />
            <SvgText
              x={pt.labelX}
              y={pt.labelY + 3}
              fontSize={9}
              fill={COLORS.textSecondary}
              textAnchor="middle"
            >
              {pt.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
