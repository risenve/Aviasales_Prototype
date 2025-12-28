import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { CitySegment } from '../App';
import { Plus, GripVertical, Edit2, Trash2, AlertTriangle } from 'lucide-react';

interface RouteTimelineProps {
  route: CitySegment[];
  onAddCity: (index: number) => void;
  onEditCity: (city: CitySegment) => void;
  onDeleteCity: (id: string) => void;
  onReorder: (newRoute: CitySegment[]) => void;
}

const ItemTypes = {
  CITY_CARD: 'cityCard'
};

interface CityCardProps {
  city: CitySegment;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

function CityCard({ city, index, onEdit, onDelete, moveCard, isFirst, isLast }: CityCardProps) {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CITY_CARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isFirst && !isLast, // Первый и последний город нельзя перетаскивать
  });

  const [, drop] = useDrop({
    accept: ItemTypes.CITY_CARD,
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  const weatherIcon = city.weather === 'sunny' ? '☀️' : 
                      city.weather === 'rainy' ? '🌧' : '❄️';

  // Проверка на предупреждения
  const hasWarning = city.days < 1 && !isFirst && !isLast;

  return (
    <div
      ref={(node) => !isFirst && !isLast ? drop(drag(node)) : null}
      className={`relative bg-white rounded-xl border-2 transition-all ${
        isDragging ? 'opacity-50 border-blue-400' : 'border-gray-200'
      } ${!isFirst && !isLast ? 'cursor-move hover:border-blue-300' : ''}`}
      style={{ minWidth: '280px', maxWidth: '280px' }}
    >
      {/* Предупреждение */}
      {hasWarning && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          Короткая стыковка
        </div>
      )}

      <div className="p-4">
        {/* Заголовок карточки */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-2 flex-1">
            {!isFirst && !isLast && (
              <GripVertical className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-lg">{city.city}</h4>
                {(isFirst || isLast) && (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">
                    {isFirst && isLast ? 'Туда-обратно' : isFirst ? 'Старт' : 'Финиш'}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{city.country}</p>
            </div>
          </div>
          
          {!isFirst && (
            <div className="flex gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Редактировать"
              >
                <Edit2 className="w-4 h-4 text-gray-600" />
              </button>
              {!isLast && (
                <button
                  onClick={onDelete}
                  className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Информация о датах */}
        <div className="mb-3 pb-3 border-b border-gray-100">
          {!isFirst && (
            <div className="text-sm mb-1">
              <span className="text-gray-600">Прибытие:</span>{' '}
              <span className="font-medium">
                {new Date(city.arrivalDate).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long'
                })}
              </span>
            </div>
          )}
          {city.days > 0 && (
            <div className="text-sm">
              <span className="text-gray-600">Продолжительность:</span>{' '}
              <span className="font-medium">
                {city.days} {city.days === 1 ? 'день' : city.days < 5 ? 'дня' : 'дней'}
              </span>
            </div>
          )}
        </div>

        {/* Иконки: погода, события, транспорт */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weatherIcon}</span>
            <span className="text-sm text-gray-600">
              {city.weather === 'sunny' ? 'Тепло и солнечно' :
               city.weather === 'rainy' ? 'Возможны осадки' : 'Прохладно'}
            </span>
          </div>
          
          {city.events.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xl">🎉</span>
              <span className="text-sm text-gray-600">{city.events[0]}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {city.transport.map((t, i) => (
                <span key={i} className="text-lg">{t}</span>
              ))}
            </div>
            <span className="text-sm text-gray-500">Доступный транспорт</span>
          </div>
        </div>

        {/* Диапазон цен */}
        {city.priceRange && city.priceRange !== '—' && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">Примерная стоимость</div>
            <div className="text-sm text-blue-600">{city.priceRange}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RouteTimeline({
  route,
  onAddCity,
  onEditCity,
  onDeleteCity,
  onReorder
}: RouteTimelineProps) {
  const moveCard = (dragIndex: number, hoverIndex: number) => {
    const newRoute = [...route];
    const dragCard = newRoute[dragIndex];
    newRoute.splice(dragIndex, 1);
    newRoute.splice(hoverIndex, 0, dragCard);
    onReorder(newRoute);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-4 overflow-x-auto pb-4">
        {route.map((city, index) => (
          <React.Fragment key={city.id}>
            {/* Карточка города */}
            <CityCard
              city={city}
              index={index}
              onEdit={() => onEditCity(city)}
              onDelete={() => onDeleteCity(city.id)}
              moveCard={moveCard}
              isFirst={index === 0}
              isLast={index === route.length - 1}
            />
            
            {/* Кнопка добавления между городами */}
            {index < route.length - 1 && (
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="h-0.5 w-12 bg-gray-300"></div>
                <button
                  onClick={() => onAddCity(index + 1)}
                  className="w-10 h-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center shadow-md"
                  title="Добавить город"
                >
                  <Plus className="w-5 h-5" />
                </button>
                <div className="h-0.5 w-12 bg-gray-300"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Подсказка для drag & drop */}
      {route.length > 2 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          💡 Перетаскивайте карточки, чтобы изменить порядок посещения городов
        </div>
      )}
    </div>
  );
}
