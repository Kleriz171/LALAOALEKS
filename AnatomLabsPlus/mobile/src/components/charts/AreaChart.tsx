import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../animations';

interface AreaDataPoint {
  date: string;
  value: number;
}

interface AreaSeries {
  data: AreaDataPoint[];
  color: string;
  label: string;
}

interface AreaChartProps {
  series: AreaSeries[];
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLabels?: boolean;
  yAxisSuffix?: string;
  formatYLabel?: (v: number) => string;
}

export default function AreaChart({
  series,
  width: propWidth,
  height = 180,
  showGrid = true,
  showLabels = true,
  yAxisSuffix = '',
  formatYLabel,
}: AreaChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = propWidth || screenWidth - 80;
  const padding = { top: 20, right: 16, bottom: 30, left: 45 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { allMinVal, allMaxVal, yLabels, seriesPaths } = useMemo(() => {
    const allValues = series.flatMap(s => s.data.map(d => d.value));
    if (allValues.length === 0) return { allMinVal: 0, allMaxVal: 0, yLabels: [], seriesPaths: [] };

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    const minV = min - range * 0.1;
    const maxV = max + range * 0.1;
    const yRange = maxV - minV;

    const yCount = 4;
    const yLbls = Array.from({ length: yCount }, (_, i) => Math.round((minV + (yRange / (yCount - 1)) * i) * 10) / 10);

    const paths = series.map(s => {
      const points = s.data.map((d, i) => ({
        x: padding.left + (i / Math.max(s.data.length - 1, 1)) * innerWidth,
        y: padding.top + innerHeight - ((d.value - minV) / yRange) * innerHeight,
      }));

      let linePath = '';
      let areaPath = '';
      if (points.length > 1) {
        linePath = points.reduce((acc, pt, i) => {
          if (i === 0) return `M ${pt.x} ${pt.y}`;
          const prev = points[i - 1];
          const cpx1 = prev.x + (pt.x - prev.x) / 3;
          const cpx2 = prev.x + (2 * (pt.x - prev.x)) / 3;
          return `${acc} C ${cpx1} ${prev.y} ${cpx2} ${pt.y} ${pt.x} ${pt.y}`;
        }, '');
        const bottomY = padding.top + innerHeight;
        areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
      }

      return { ...s, linePath, areaPath, points };
    });

    return { allMinVal: minV, allMaxVal: maxV, yLabels: yLbls, seriesPaths: paths };
  }, [series, chartWidth, height]);

  const fmtY = formatYLabel || ((v: number) => `${Math.round(v)}${yAxisSuffix}`);
  const firstSeries = series[0]?.data || [];
  const xLabelInterval = Math.max(1, Math.floor(firstSeries.length / 5));

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        {seriesPaths.map((s, si) => (
          <Defs key={`defs${si}`}>
            <LinearGradient id={`areaG${si}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={s.color} stopOpacity="0.25" />
              <Stop offset="1" stopColor={s.color} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
        ))}

        {showGrid && yLabels.map((val, i) => {
          const y = padding.top + innerHeight - ((val - allMinVal) / ((allMaxVal - allMinVal) || 1)) * innerHeight;
          return (
            <React.Fragment key={i}>
              <Line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke={COLORS.border} strokeWidth={0.5} strokeDasharray="4,4" />
              <SvgText x={padding.left - 6} y={y + 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="end">
                {fmtY(val)}
              </SvgText>
            </React.Fragment>
          );
        })}

        {seriesPaths.map((s, si) => (
          <React.Fragment key={si}>
            {s.areaPath && <Path d={s.areaPath} fill={`url(#areaG${si})`} />}
            {s.linePath && <Path d={s.linePath} stroke={s.color} strokeWidth={2} fill="none" strokeLinecap="round" />}
          </React.Fragment>
        ))}

        {showLabels && firstSeries.map((d, i) => {
          if (i % xLabelInterval !== 0 && i !== firstSeries.length - 1) return null;
          const x = padding.left + (i / Math.max(firstSeries.length - 1, 1)) * innerWidth;
          return (
            <SvgText key={i} x={x} y={height - 6} fontSize={9} fill={COLORS.textTertiary} textAnchor="middle">
              {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </SvgText>
          );
        })}
      </Svg>

      {series.length > 1 && (
        <View style={styles.legend}>
          {series.map((s, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>{s.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
});
