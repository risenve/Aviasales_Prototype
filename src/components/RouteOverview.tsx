import React from 'react';
import { CitySegment } from '../App';
import { ArrowLeft, Calendar, Clock, Plane, AlertCircle, CheckCircle } from 'lucide-react';

interface RouteOverviewProps {
  route: CitySegment[];
  onBack: () => void;
  onSearch: () => void;
}

export function RouteOverview({ route, onBack, onSearch }: RouteOverviewProps) {
  // Расчет общей продолжительности
  const totalDays = route.reduce((sum, city) => sum + city.days, 0);
  
  // Расчет примерной стоимости
  const estimatedCost = route
    .filter(city => city.priceRange && city.priceRange !== '—')
    .reduce((sum, city) => {
      const match = city.priceRange!.match(/(\d+)\s*000/g);
      if (match && match.length >= 2) {
        const min = parseInt(match[0]);
        const max = parseInt(match[1]);
        return sum + (min + max) / 2 * 1000;
      }
      return sum;
    }, 0);

  // Проверка на проблемы
  const warnings: string[] = [];
  route.forEach((city, index) => {
    if (city.days < 1 && index > 0 && index < route.length - 1) {
      warnings.push(`Короткая стыковка в ${city.city}`);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться к конструктору
          </button>
        </div>
      </header>

      {/* Основной контент */}
      <main className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Обзор маршрута</h1>
          <p className="text-gray-600">
            Проверьте детали вашего путешествия перед поиском билетов
          </p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Общая информация */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Общая продолжительность</div>
                <div className="text-2xl">{totalDays} дней</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Количество перелётов</div>
                <div className="text-2xl">{route.length - 1}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Примерная стоимость</div>
                <div className="text-2xl">{Math.round(estimatedCost / 1000)} 000 ₽</div>
              </div>
            </div>
          </div>
        </div>

        {/* Предупреждения */}
        {warnings.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900 mb-2">Обратите внимание</h3>
                <ul className="space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-orange-800">• {warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Детальный маршрут */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl mb-6">Детальный маршрут</h2>
          
          <div className="space-y-6">
            {route.map((city, index) => {
              const nextCity = route[index + 1];
              const isLast = index === route.length - 1;

              return (
                <div key={city.id}>
                  {/* Информация о городе */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg mb-1">{city.city}, {city.country}</h3>
                          {index > 0 && (
                            <div className="text-sm text-gray-600 mb-1">
                              Прибытие: {new Date(city.arrivalDate).toLocaleDateString('ru-RU', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'long'
                              })}
                            </div>
                          )}
                          {city.days > 0 && (
                            <div className="text-sm text-gray-600">
                              Продолжительность: {city.days} {city.days === 1 ? 'день' : city.days < 5 ? 'дня' : 'дней'}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          {city.priceRange && city.priceRange !== '—' && (
                            <div className="text-sm text-blue-600">{city.priceRange}</div>
                          )}
                        </div>
                      </div>

                      {/* Детали */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{city.weather === 'sunny' ? '☀️' : city.weather === 'rainy' ? '🌧' : '❄️'}</span>
                          <span className="text-gray-600">
                            {city.weather === 'sunny' ? 'Тепло' : city.weather === 'rainy' ? 'Осадки' : 'Прохладно'}
                          </span>
                        </div>
                        
                        {city.events.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">🎉</span>
                            <span className="text-gray-600">{city.events[0]}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2">
                          {city.transport.map((t, i) => (
                            <span key={i} className="text-lg">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Перелет */}
                  {!isLast && (
                    <div className="ml-5 pl-5 border-l-2 border-gray-200 pt-4 pb-2">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Plane className="w-4 h-4" />
                        <span className="text-sm">Перелет {city.city} → {nextCity.city}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Рекомендации */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Рекомендации</h3>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Рекомендуем оформить туристическую страховку для всех стран маршрута</li>
                <li>• Проверьте визовые требования для каждой страны</li>
                <li>• Учитывайте время на трансфер между аэропортом и отелем</li>
                <li>• Бронируйте отели заранее для лучших цен</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={onBack}
            className="px-8 py-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Изменить маршрут
          </button>
          <button
            onClick={onSearch}
            className="px-12 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg"
          >
            Найти билеты
          </button>
        </div>
      </main>
    </div>
  );
}
