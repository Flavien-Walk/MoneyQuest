import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  TrendingUp,
  TrendingDown,
  ZoomIn,
  ZoomOut,
  BarChart3,
  Activity
} from 'lucide-react-native';
import { interactiveChartStyles } from '../styles/InteractiveChartStyle';

const { width: screenWidth } = Dimensions.get('window');

interface ChartDataPoint {
  timestamp: number;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  date: string;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  period: string;
  symbol: string;
  currentPrice: number;
  onDataPointPress?: (point: ChartDataPoint) => void;
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  data,
  period,
  symbol,
  currentPrice,
  onDataPointPress
}) => {
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 0, y: 0 });

  const chartHeight = 250;
  const chartWidth = screenWidth - 48;
  const padding = 40;

  // Convertir les données en format OHLC pour les bougies
  const formatDataForCandles = (rawData: ChartDataPoint[]): ChartDataPoint[] => {
    return rawData.map((point, index) => {
      // Si pas de données OHLC, simuler à partir du prix
      if (!point.open || !point.high || !point.low || !point.close) {
        const variation = 0.02; // 2% de variation max
        const price = point.price;
        const open = index > 0 ? rawData[index - 1].price : price * (1 - Math.random() * variation);
        const close = price;
        const high = Math.max(open, close) * (1 + Math.random() * variation);
        const low = Math.min(open, close) * (1 - Math.random() * variation);

        return {
          ...point,
          open,
          high,
          low,
          close: price
        };
      }
      return point;
    });
  };

  const candleData = formatDataForCandles(data);
  const minPrice = Math.min(...candleData.map(d => chartType === 'candle' ? d.low! : d.price));
  const maxPrice = Math.max(...candleData.map(d => chartType === 'candle' ? d.high! : d.price));
  const priceRange = maxPrice - minPrice;

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `€${price.toFixed(6)}`;
    } else {
      return `€${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    if (period === '1J') {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getYPosition = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * (chartHeight - padding * 2) - padding;
  };

  const getXPosition = (index: number) => {
    return (index / (candleData.length - 1)) * (chartWidth - padding * 2) + padding;
  };

  const handleChartPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    
    // Trouver le point de données le plus proche
    const dataIndex = Math.round(((locationX - padding) / (chartWidth - padding * 2)) * (candleData.length - 1));
    const clampedIndex = Math.max(0, Math.min(dataIndex, candleData.length - 1));
    const point = candleData[clampedIndex];
    
    if (point) {
      setSelectedPoint(point);
      setShowCrosshair(true);
      setCrosshairPosition({ x: locationX, y: locationY });
      onDataPointPress?.(point);
    }
  };

  const renderLineChart = () => {
    const pathData = candleData.map((point, index) => {
      const x = getXPosition(index);
      const y = getYPosition(point.price);
      return index === 0 ? `M${x},${y}` : `L${x},${y}`;
    }).join(' ');

    return (
      <View style={interactiveChartStyles.chartArea}>
        {/* Grille de fond */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <View
            key={`h-${index}`}
            style={[
              interactiveChartStyles.gridLine,
              {
                top: padding + ratio * (chartHeight - padding * 2),
                left: padding,
                width: chartWidth - padding * 2,
                height: 1,
                backgroundColor: index === 2 ? '#e2e8f0' : '#f1f5f9'
              }
            ]}
          />
        ))}

        {/* Lignes verticales */}
        {candleData.map((_, index) => {
          if (index % Math.max(1, Math.floor(candleData.length / 5)) === 0) {
            return (
              <View
                key={`v-${index}`}
                style={[
                  interactiveChartStyles.gridLine,
                  {
                    left: getXPosition(index),
                    top: padding,
                    width: 1,
                    height: chartHeight - padding * 2,
                    backgroundColor: '#f1f5f9'
                  }
                ]}
              />
            );
          }
          return null;
        })}

        {/* Courbe de prix */}
        <View style={interactiveChartStyles.priceLine}>
          {candleData.map((point, index) => {
            if (index === 0) return null;
            
            const prevPoint = candleData[index - 1];
            const x1 = getXPosition(index - 1);
            const x2 = getXPosition(index);
            const y1 = getYPosition(prevPoint.price);
            const y2 = getYPosition(point.price);
            
            const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
            const angle = Math.atan2(y2 - y1, x2 - x1);
            
            return (
              <View
                key={index}
                style={[
                  interactiveChartStyles.priceSegment,
                  {
                    position: 'absolute',
                    left: x1,
                    top: Math.min(y1, y2),
                    width: length,
                    height: 2,
                    backgroundColor: point.price > prevPoint.price ? '#10b981' : '#ef4444',
                    transformOrigin: '0 50%',
                    transform: [{ rotate: `${angle}rad` }]
                  }
                ]}
              />
            );
          })}
        </View>

        {/* Points de données */}
        {candleData.map((point, index) => (
          <View
            key={`point-${index}`}
            style={[
              interactiveChartStyles.dataPoint,
              {
                position: 'absolute',
                left: getXPosition(index) - 2,
                top: getYPosition(point.price) - 2,
                backgroundColor: index === candleData.length - 1 ? '#3b82f6' : '#64748b'
              }
            ]}
          />
        ))}
      </View>
    );
  };

  const renderCandleChart = () => {
    return (
      <View style={interactiveChartStyles.chartArea}>
        {/* Grille de fond identique */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
          <View
            key={`h-${index}`}
            style={[
              interactiveChartStyles.gridLine,
              {
                top: padding + ratio * (chartHeight - padding * 2),
                left: padding,
                width: chartWidth - padding * 2,
                height: 1,
                backgroundColor: index === 2 ? '#e2e8f0' : '#f1f5f9'
              }
            ]}
          />
        ))}

        {/* Bougies japonaises */}
        {candleData.map((point, index) => {
          const x = getXPosition(index);
          const openY = getYPosition(point.open!);
          const highY = getYPosition(point.high!);
          const lowY = getYPosition(point.low!);
          const closeY = getYPosition(point.close!);
          
          const isBullish = point.close! > point.open!;
          const bodyHeight = Math.abs(closeY - openY);
          const bodyTop = Math.min(openY, closeY);
          
          const candleWidth = Math.max(2, (chartWidth - padding * 2) / candleData.length * 0.8);

          return (
            <View key={`candle-${index}`} style={{ position: 'absolute' }}>
              {/* Mèche haute */}
              <View
                style={[
                  interactiveChartStyles.candleWick,
                  {
                    left: x - 0.5,
                    top: highY,
                    width: 1,
                    height: bodyTop - highY,
                    backgroundColor: isBullish ? '#10b981' : '#ef4444'
                  }
                ]}
              />
              
              {/* Corps de la bougie */}
              <View
                style={[
                  interactiveChartStyles.candleBody,
                  {
                    left: x - candleWidth / 2,
                    top: bodyTop,
                    width: candleWidth,
                    height: Math.max(1, bodyHeight),
                    backgroundColor: isBullish ? '#10b981' : '#ef4444',
                    opacity: isBullish ? 0.8 : 1
                  }
                ]}
              />
              
              {/* Mèche basse */}
              <View
                style={[
                  interactiveChartStyles.candleWick,
                  {
                    left: x - 0.5,
                    top: bodyTop + bodyHeight,
                    width: 1,
                    height: lowY - (bodyTop + bodyHeight),
                    backgroundColor: isBullish ? '#10b981' : '#ef4444'
                  }
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderPriceLabels = () => (
    <View style={interactiveChartStyles.priceLabels}>
      {[maxPrice, (maxPrice + minPrice) / 2, minPrice].map((price, index) => (
        <Text key={index} style={interactiveChartStyles.priceLabel}>
          {formatPrice(price)}
        </Text>
      ))}
    </View>
  );

  const renderTimeLabels = () => (
    <View style={interactiveChartStyles.timeLabels}>
      {candleData.filter((_, index) => index % Math.max(1, Math.floor(candleData.length / 4)) === 0).map((point, index) => (
        <Text key={index} style={interactiveChartStyles.timeLabel}>
          {formatTime(point.timestamp)}
        </Text>
      ))}
    </View>
  );

  const renderCrosshair = () => {
    if (!showCrosshair || !selectedPoint) return null;

    return (
      <View style={interactiveChartStyles.crosshair}>
        {/* Ligne horizontale */}
        <View
          style={[
            interactiveChartStyles.crosshairLine,
            {
              left: padding,
              top: crosshairPosition.y,
              width: chartWidth - padding * 2,
              height: 1
            }
          ]}
        />
        {/* Ligne verticale */}
        <View
          style={[
            interactiveChartStyles.crosshairLine,
            {
              left: crosshairPosition.x,
              top: padding,
              width: 1,
              height: chartHeight - padding * 2
            }
          ]}
        />
        
        {/* Tooltip avec informations */}
        <View
          style={[
            interactiveChartStyles.tooltip,
            {
              left: Math.min(crosshairPosition.x + 10, chartWidth - 150),
              top: Math.max(crosshairPosition.y - 60, 10)
            }
          ]}
        >
          <Text style={interactiveChartStyles.tooltipTime}>
            {formatTime(selectedPoint.timestamp)}
          </Text>
          {chartType === 'candle' ? (
            <>
              <Text style={interactiveChartStyles.tooltipPrice}>
                O: {formatPrice(selectedPoint.open!)}
              </Text>
              <Text style={interactiveChartStyles.tooltipPrice}>
                H: {formatPrice(selectedPoint.high!)}
              </Text>
              <Text style={interactiveChartStyles.tooltipPrice}>
                L: {formatPrice(selectedPoint.low!)}
              </Text>
              <Text style={interactiveChartStyles.tooltipPrice}>
                C: {formatPrice(selectedPoint.close!)}
              </Text>
            </>
          ) : (
            <Text style={interactiveChartStyles.tooltipPrice}>
              Prix: {formatPrice(selectedPoint.price)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={interactiveChartStyles.container}>
      {/* Header avec contrôles */}
      <View style={interactiveChartStyles.header}>
        <View style={interactiveChartStyles.currentPrice}>
          <Text style={interactiveChartStyles.currentPriceLabel}>Cours actuel</Text>
          <Text style={interactiveChartStyles.currentPriceValue}>
            {formatPrice(currentPrice)}
          </Text>
        </View>
        
        <View style={interactiveChartStyles.controls}>
          <TouchableOpacity
            style={[
              interactiveChartStyles.controlButton,
              chartType === 'line' && interactiveChartStyles.controlButtonActive
            ]}
            onPress={() => setChartType('line')}
          >
            <Activity size={16} color={chartType === 'line' ? '#ffffff' : '#64748b'} strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              interactiveChartStyles.controlButton,
              chartType === 'candle' && interactiveChartStyles.controlButtonActive
            ]}
            onPress={() => setChartType('candle')}
          >
            <BarChart3 size={16} color={chartType === 'candle' ? '#ffffff' : '#64748b'} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Zone de graphique interactive */}
      <View
        style={[interactiveChartStyles.chartWrapper, { height: chartHeight, width: chartWidth }]}
        onTouchStart={handleChartPress}
        onTouchEnd={() => {
          setShowCrosshair(false);
          setSelectedPoint(null);
        }}
      >
        {chartType === 'line' ? renderLineChart() : renderCandleChart()}
        {renderPriceLabels()}
        {renderCrosshair()}
      </View>

      {/* Labels de temps */}
      {renderTimeLabels()}

      {/* Informations en temps réel */}
      <View style={interactiveChartStyles.liveInfo}>
        <View style={interactiveChartStyles.liveIndicator}>
          <View style={interactiveChartStyles.liveDot} />
          <Text style={interactiveChartStyles.liveText}>EN DIRECT</Text>
        </View>
        <Text style={interactiveChartStyles.periodText}>
          Période: {period} • {candleData.length} points
        </Text>
      </View>
    </View>
  );
};

export default InteractiveChart;