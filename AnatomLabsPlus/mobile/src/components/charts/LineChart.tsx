import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../animations';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  color?: string;
  gradientFill?: boolean;
  showDots?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  yAxisSuffix?: string;
  formatLabel?: (point: DataPoint) => string;
  formatYLabel?: (value: number) => string;
}

export default function LineChart({
  data,
  width: propWidth,
  height = 180,
  color = COLORS.primary,
  gradientFill = true,
  showDots = true,
  showLabels = true,
  showGrid = true,
  yAxisSuffix = '',
  formatLabel,
  formatYLabel,
}: LineChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = propWidth || screenWidth - 80;
  const padding = { top: 20, right: 16, bottom: 30, left: 45 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { minVal, maxVal, yLabels, points, linePath, areaPath } = useMemo(() => {
    if (data.length === 0) return { minVal: 0, maxVal: 0, yLabels: [], points: [], linePath: '', areaPath: '' };

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const minV = min - range * 0.1;
    const maxV = max + range * 0.1;
    const yRange = maxV - minV;

    const yLabelCount = 4;
    const yLbls = Array.from({ length: yLabelCount }, (_, i) => {
      const val = minV + (yRange / (yLabelCount - 1)) * i;
      return Math.round(val * 10) / 10;
    });

    const pts = data.map((d, i) => ({
      x: padding.left + (i / Math.max(data.length - 1, 1)) * innerWidth,
      y: padding.top + innerHeight - ((d.value - minV) / yRange) * innerHeight,
      ...d,
    }));

    let lPath = '';
    let aPath = '';
    if (pts.length > 1) {
      lPath = pts.reduce((acc, pt, i) => {
        if (i === 0) return `M ${pt.x} ${pt.y}`;
        const prev = pts[i - 1];
        const cpx1 = prev.x + (pt.x - prev.x) / 3;
        const cpx2 = prev.x + (2 * (pt.x - prev.x)) / 3;
        return `${acc} C ${cpx1} ${prev.y} ${cpx2} ${pt.y} ${pt.x} ${pt.y}`;
      }, '');

      const bottomY = padding.top + innerHeight;
      aPath = `${lPath} L ${pts[pts.length - 1].x} ${bottomY} L ${pts[0].x} ${bottomY} Z`;
    }

    return { minVal: minV, maxVal: maxV, yLabels: yLbls, points: pts, linePath: lPath, areaPath: aPath };
  }, [data, chartWidth, height]);

  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const fmtY = formatYLabel || ((v: number) => `${Math.round(v)}${yAxisSuffix}`);
  const xLabelInterval = Math.max(1, Math.floor(data.length / 5));

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        <Defs>
          <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.3" />
            <Stop offset="1" stopColor={color} stopOpacity="0.02" />
          </LinearGradient>
        </Defs>

        {showGrid && yLabels.map((val, i) => {
          const y = padding.top + innerHeight - ((val - minVal) / ((maxVal - minVal) || 1)) * innerHeight;
          return (
            <React.Fragment key={i}>
              <Line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke={COLORS.border} strokeWidth={0.5} strokeDasharray="4,4" />
              <SvgText x={padding.left - 6} y={y + 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="end">
                {fmtY(val)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {gradientFill && areaPath && <Path d={areaPath} fill="url(#areaGrad)" />}
        {linePath && <Path d={linePath} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}

        {showDots && points.map((pt, i) => (
          <Circle key={i} cx={pt.x} cy={pt.y} r={i === points.length - 1 ? 5 : 3} fill={i === points.length - 1 ? color : COLORS.cardBackground} stroke={color} strokeWidth={2} />
        ))}

        {showLabels && points.map((pt, i) => {
          if (i % xLabelInterval !== 0 && i !== points.length - 1) return null;
          const label = formatLabel ? formatLabel(pt) : new Date(pt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <SvgText key={`l${i}`} x={pt.x} y={height - 6} fontSize={9} fill={COLORS.textTertiary} textAnchor="middle">
              {label}
            </SvgText>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    flex: 1,
    textAlignVertical: 'center',
  },
});
