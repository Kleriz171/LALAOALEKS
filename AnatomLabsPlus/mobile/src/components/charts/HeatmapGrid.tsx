import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { COLORS } from '../animations';

interface HeatmapDay {
  date: string;
  value: number;
}

interface HeatmapGridProps {
  data: HeatmapDay[];
  weeks?: number;
  cellSize?: number;
  color?: string;
  emptyColor?: string;
}

export default function HeatmapGrid({
  data,
  weeks = 12,
  cellSize = 14,
  color = COLORS.success,
  emptyColor = COLORS.cardBackgroundLight,
}: HeatmapGridProps) {
  const gap = 3;
  const dayLabels = ['', 'M', '', 'W', '', 'F', ''];
  const labelWidth = 16;

  const { grid, maxVal, monthLabels } = useMemo(() => {
    const dateMap = new Map(data.map(d => [d.date, d.value]));
    const max = Math.max(...data.map(d => d.value), 1);

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7 - 1));
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    const gridData: { date: string; value: number; col: number; row: number }[] = [];
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(startDate);
        cellDate.setDate(cellDate.getDate() + w * 7 + d);
        const dateStr = cellDate.toISOString().split('T')[0];

        if (cellDate.getMonth() !== lastMonth) {
          lastMonth = cellDate.getMonth();
          months.push({
            label: cellDate.toLocaleDateString('en-US', { month: 'short' }),
            col: w,
          });
        }

        if (cellDate > today) continue;

        gridData.push({
          date: dateStr,
          value: dateMap.get(dateStr) || 0,
          col: w,
          row: d,
        });
      }
    }

    return { grid: gridData, maxVal: max, monthLabels: months };
  }, [data, weeks]);

  const svgWidth = labelWidth + weeks * (cellSize + gap);
  const svgHeight = 7 * (cellSize + gap) + 20;

  const getOpacity = (value: number) => {
    if (value === 0) return 0;
    return 0.2 + (value / maxVal) * 0.8;
  };

  return (
    <View style={styles.container}>
      <Svg width={svgWidth} height={svgHeight}>
        {dayLabels.map((label, i) => (
          label ? (
            <SvgText key={`dl${i}`} x={8} y={20 + i * (cellSize + gap) + cellSize / 2 + 3} fontSize={9} fill={COLORS.textTertiary} textAnchor="middle">
              {label}
            </SvgText>
          ) : null
        ))}

        {monthLabels.map((m, i) => (
          <SvgText key={`ml${i}`} x={labelWidth + m.col * (cellSize + gap)} y={10} fontSize={9} fill={COLORS.textTertiary} textAnchor="start">
            {m.label}
          </SvgText>
        ))}

        {grid.map((cell, i) => (
          <Rect
            key={i}
            x={labelWidth + cell.col * (cellSize + gap)}
            y={18 + cell.row * (cellSize + gap)}
            width={cellSize}
            height={cellSize}
            rx={3}
            ry={3}
            fill={cell.value > 0 ? color : emptyColor}
            opacity={cell.value > 0 ? getOpacity(cell.value) : 0.3}
          />
        ))}
      </Svg>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((opacity, i) => (
          <View
            key={i}
            style={[
              styles.legendCell,
              {
                backgroundColor: opacity === 0 ? emptyColor : color,
                opacity: opacity === 0 ? 0.3 : 0.2 + opacity * 0.8,
              },
            ]}
          />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  legendText: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
});
