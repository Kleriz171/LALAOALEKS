import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../animations';

interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarDataPoint[];
  width?: number;
  height?: number;
  color?: string;
  showValues?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  horizontal?: boolean;
  yAxisSuffix?: string;
  formatValue?: (value: number) => string;
  barRadius?: number;
}

export default function BarChart({
  data,
  width: propWidth,
  height = 180,
  color = COLORS.primary,
  showValues = true,
  showLabels = true,
  showGrid = true,
  horizontal = false,
  yAxisSuffix = '',
  formatValue,
  barRadius = 4,
}: BarChartProps) {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = propWidth || screenWidth - 80;

  if (horizontal) {
    return <HorizontalBarChart data={data} width={chartWidth} height={height} color={color} formatValue={formatValue} barRadius={barRadius} />;
  }

  const padding = { top: 16, right: 16, bottom: 30, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { maxVal, bars, yLabels } = useMemo(() => {
    if (data.length === 0) return { maxVal: 0, bars: [], yLabels: [] };

    const max = Math.max(...data.map(d => d.value), 1);
    const barGap = 6;
    const barW = Math.min(28, (innerWidth - barGap * (data.length - 1)) / data.length);
    const totalBarsWidth = barW * data.length + barGap * (data.length - 1);
    const offsetX = (innerWidth - totalBarsWidth) / 2;

    const brs = data.map((d, i) => {
      const barH = (d.value / max) * innerHeight;
      return {
        x: padding.left + offsetX + i * (barW + barGap),
        y: padding.top + innerHeight - barH,
        width: barW,
        height: barH,
        ...d,
      };
    });

    const yCount = 4;
    const yLbls = Array.from({ length: yCount }, (_, i) => Math.round((max / (yCount - 1)) * i));

    return { maxVal: max, bars: brs, yLabels: yLbls };
  }, [data, chartWidth, height]);

  if (data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  const fmtVal = formatValue || ((v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`);

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={height}>
        {showGrid && yLabels.map((val, i) => {
          const y = padding.top + innerHeight - (val / (maxVal || 1)) * innerHeight;
          return (
            <React.Fragment key={i}>
              <Line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke={COLORS.border} strokeWidth={0.5} strokeDasharray="4,4" />
              <SvgText x={padding.left - 6} y={y + 4} fontSize={10} fill={COLORS.textTertiary} textAnchor="end">
                {fmtVal(val)}{yAxisSuffix}
              </SvgText>
            </React.Fragment>
          );
        })}

        {bars.map((bar, i) => (
          <React.Fragment key={i}>
            <Defs>
              <LinearGradient id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={bar.color || color} stopOpacity="1" />
                <Stop offset="1" stopColor={bar.color || color} stopOpacity="0.6" />
              </LinearGradient>
            </Defs>
            <Rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={Math.max(bar.height, 2)}
              rx={barRadius}
              ry={barRadius}
              fill={`url(#barGrad${i})`}
            />
            {showValues && bar.value > 0 && (
              <SvgText x={bar.x + bar.width / 2} y={bar.y - 6} fontSize={9} fill={COLORS.textSecondary} textAnchor="middle">
                {fmtVal(bar.value)}
              </SvgText>
            )}
            {showLabels && (
              <SvgText x={bar.x + bar.width / 2} y={height - 6} fontSize={9} fill={COLORS.textTertiary} textAnchor="middle">
                {bar.label}
              </SvgText>
            )}
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

function HorizontalBarChart({
  data,
  width,
  height,
  color,
  formatValue,
  barRadius,
}: {
  data: BarDataPoint[];
  width: number;
  height: number;
  color: string;
  formatValue?: (v: number) => string;
  barRadius: number;
}) {
  const padding = { top: 8, right: 50, bottom: 8, left: 80 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const barH = Math.min(20, (innerHeight - 4 * (data.length - 1)) / data.length);
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const fmtVal = formatValue || ((v: number) => `${Math.round(v)}`);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const barW = (d.value / maxVal) * innerWidth;
          const y = padding.top + i * (barH + 4);
          return (
            <React.Fragment key={i}>
              <SvgText x={padding.left - 6} y={y + barH / 2 + 4} fontSize={10} fill={COLORS.textSecondary} textAnchor="end">
                {d.label}
              </SvgText>
              <Rect x={padding.left} y={y} width={Math.max(barW, 2)} height={barH} rx={barRadius} ry={barRadius} fill={d.color || color} opacity={0.85} />
              <SvgText x={padding.left + barW + 6} y={y + barH / 2 + 4} fontSize={10} fill={COLORS.text} textAnchor="start">
                {fmtVal(d.value)}
              </SvgText>
            </React.Fragment>
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
