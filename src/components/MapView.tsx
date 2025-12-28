import React from 'react';
import { CitySegment } from '../App';

interface MapViewProps {
  route: CitySegment[];
  layer: 'routes' | 'weather' | 'events';
}

export function MapView({ route, layer }: MapViewProps) {
  // Конвертация координат в SVG координаты
  const projectToSVG = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 1200;
    const y = ((90 - lat) / 180) * 600;
    return { x, y };
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-blue-100">
      <svg
        viewBox="0 0 1200 600"
        className="w-full h-[500px]"
      >
        {/* Фон карты */}
        <rect width="1200" height="600" fill="#e3f2fd" />
        
        {/* Упрощенная карта мира */}
        {/* Континенты (упрощенные формы) */}
        <g opacity="0.3">
          {/* Европа */}
          <ellipse cx="550" cy="180" rx="120" ry="80" fill="#90caf9" />
          {/* Азия */}
          <ellipse cx="750" cy="220" rx="200" ry="120" fill="#90caf9" />
          {/* Африка */}
          <ellipse cx="550" cy="350" rx="100" ry="140" fill="#90caf9" />
          {/* Америка */}
          <ellipse cx="250" cy="250" rx="130" ry="180" fill="#90caf9" />
          {/* Австралия */}
          <ellipse cx="950" cy="450" rx="90" ry="60" fill="#90caf9" />
        </g>

        {/* Слой погоды */}
        {layer === 'weather' && (
          <g opacity="0.6">
            {route.map((city, index) => {
              const pos = projectToSVG(city.lat, city.lng);
              const color = city.weather === 'sunny' ? '#ff9800' : 
                           city.weather === 'rainy' ? '#2196f3' : '#64b5f6';
              return (
                <circle
                  key={`weather-${index}`}
                  cx={pos.x}
                  cy={pos.y}
                  r="60"
                  fill={color}
                  opacity="0.3"
                />
              );
            })}
          </g>
        )}

        {/* Слой событий */}
        {layer === 'events' && (
          <g>
            {route.map((city, index) => {
              if (city.events.length === 0) return null;
              const pos = projectToSVG(city.lat, city.lng);
              return (
                <g key={`event-${index}`}>
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r="40"
                    fill="#ff4081"
                    opacity="0.2"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 50}
                    textAnchor="middle"
                    fontSize="24"
                  >
                    🎉
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* Линии маршрута */}
        {layer === 'routes' && route.length > 1 && (
          <g>
            {route.slice(0, -1).map((city, index) => {
              const start = projectToSVG(city.lat, city.lng);
              const end = projectToSVG(route[index + 1].lat, route[index + 1].lng);
              
              // Создаем изогнутую линию
              const midX = (start.x + end.x) / 2;
              const midY = (start.y + end.y) / 2 - 50;
              
              return (
                <g key={`line-${index}`}>
                  <path
                    d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                    stroke="#1976d2"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="5,5"
                    opacity="0.6"
                  />
                  {/* Стрелка */}
                  <polygon
                    points={`${end.x},${end.y} ${end.x-8},${end.y-8} ${end.x-8},${end.y+8}`}
                    fill="#1976d2"
                    opacity="0.6"
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* Маркеры городов */}
        {route.map((city, index) => {
          const pos = projectToSVG(city.lat, city.lng);
          const isFirst = index === 0;
          const isLast = index === route.length - 1;
          
          return (
            <g key={`marker-${index}`}>
              {/* Круг маркера */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="12"
                fill={isFirst || isLast ? '#2e7d32' : '#1976d2'}
                stroke="white"
                strokeWidth="3"
              />
              {/* Внутренний круг */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill="white"
              />
              {/* Название города */}
              <g>
                <rect
                  x={pos.x - 50}
                  y={pos.y + 20}
                  width="100"
                  height="32"
                  rx="4"
                  fill="white"
                  stroke="#e0e0e0"
                  strokeWidth="1"
                />
                <text
                  x={pos.x}
                  y={pos.y + 38}
                  textAnchor="middle"
                  fontSize="13"
                  fill="#333"
                  fontWeight="500"
                >
                  {city.city}
                </text>
              </g>
              {/* Номер сегмента */}
              <circle
                cx={pos.x - 60}
                cy={pos.y - 20}
                r="16"
                fill="#ff9800"
                stroke="white"
                strokeWidth="2"
              />
              <text
                x={pos.x - 60}
                y={pos.y - 15}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="600"
              >
                {index + 1}
              </text>
            </g>
          );
        })}
      </svg>
      
      {/* Легенда */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-700"></div>
            <span>Начало/Конец</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-700"></div>
            <span>Промежуточный город</span>
          </div>
        </div>
      </div>
    </div>
  );
}
