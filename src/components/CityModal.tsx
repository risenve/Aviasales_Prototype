import React, { useState, useEffect } from 'react';
import { CitySegment } from '../App';
import { X, Search, MapPin } from 'lucide-react';

interface CityModalProps {
  city: CitySegment | null;
  onSave: (city: CitySegment) => void;
  onClose: () => void;
}

const popularCities = [
  { name: 'Париж', country: 'Франция', lat: 48.8566, lng: 2.3522, weather: 'rainy' as const },
  { name: 'Лондон', country: 'Великобритания', lat: 51.5074, lng: -0.1278, weather: 'rainy' as const },
  { name: 'Барселона', country: 'Испания', lat: 41.3851, lng: 2.1734, weather: 'sunny' as const },
  { name: 'Рим', country: 'Италия', lat: 41.9028, lng: 12.4964, weather: 'sunny' as const },
  { name: 'Амстердам', country: 'Нидерланды', lat: 52.3676, lng: 4.9041, weather: 'rainy' as const },
  { name: 'Прага', country: 'Чехия', lat: 50.0755, lng: 14.4378, weather: 'cold' as const },
  { name: 'Берлин', country: 'Германия', lat: 52.5200, lng: 13.4050, weather: 'cold' as const },
  { name: 'Вена', country: 'Австрия', lat: 48.2082, lng: 16.3738, weather: 'cold' as const },
  { name: 'Бангкок', country: 'Таиланд', lat: 13.7563, lng: 100.5018, weather: 'sunny' as const },
  { name: 'Токио', country: 'Япония', lat: 35.6762, lng: 139.6503, weather: 'sunny' as const },
  { name: 'Нью-Йорк', country: 'США', lat: 40.7128, lng: -74.0060, weather: 'cold' as const },
  { name: 'Сингапур', country: 'Сингапур', lat: 1.3521, lng: 103.8198, weather: 'sunny' as const },
];

export function CityModal({ city, onSave, onClose }: CityModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<typeof popularCities[0] | null>(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [days, setDays] = useState(3);
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    if (city) {
      setSelectedCity({
        name: city.city,
        country: city.country,
        lat: city.lat,
        lng: city.lng,
        weather: city.weather
      });
      setArrivalDate(city.arrivalDate);
      setDays(city.days);
      setEvents(city.events);
    }
  }, [city]);

  const filteredCities = popularCities.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedCity || !arrivalDate) return;

    const newCity: CitySegment = {
      id: city?.id || `city-${Date.now()}`,
      city: selectedCity.name,
      country: selectedCity.country,
      lat: selectedCity.lat,
      lng: selectedCity.lng,
      arrivalDate,
      days,
      weather: selectedCity.weather,
      events,
      transport: ['✈️'],
      priceRange: '15 000 – 30 000 ₽'
    };

    onSave(newCity);
  };

  const isValid = selectedCity && arrivalDate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl">
            {city ? 'Редактировать город' : 'Добавить город'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Поиск города */}
          {!city && (
            <div className="mb-6">
              <label className="block text-sm mb-2">Выберите город</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск города..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Список городов */}
              <div className="mt-4 grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {filteredCities.map((cityOption) => (
                  <button
                    key={cityOption.name}
                    onClick={() => setSelectedCity(cityOption)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedCity?.name === cityOption.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{cityOption.name}</div>
                        <div className="text-sm text-gray-500">{cityOption.country}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {(selectedCity || city) && (
            <>
              {/* Выбранный город */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-lg">{selectedCity?.name || city?.city}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedCity?.country || city?.country}
                </div>
              </div>

              {/* Дата прибытия */}
              <div className="mb-6">
                <label className="block text-sm mb-2">
                  Дата прибытия
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Продолжительность пребывания */}
              <div className="mb-6">
                <label className="block text-sm mb-2">
                  Продолжительность пребывания (дней)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    className="w-20 px-4 py-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:border-blue-500"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value) || 1)}
                  />
                  <button
                    onClick={() => setDays(Math.min(30, days + 1))}
                    className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600">
                    {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                  </span>
                </div>
              </div>

              {/* События (опционально) */}
              <div className="mb-6">
                <label className="block text-sm mb-2">
                  Интересующие события (опционально)
                </label>
                <input
                  type="text"
                  placeholder="Например: Фестиваль музыки"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  value={events[0] || ''}
                  onChange={(e) => setEvents(e.target.value ? [e.target.value] : [])}
                />
              </div>

              {/* Информация о погоде */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">
                    {(selectedCity?.weather || city?.weather) === 'sunny' ? '☀️' :
                     (selectedCity?.weather || city?.weather) === 'rainy' ? '🌧' : '❄️'}
                  </span>
                  <div>
                    <div className="text-sm text-gray-600">Ожидаемая погода</div>
                    <div className="font-medium">
                      {(selectedCity?.weather || city?.weather) === 'sunny' ? 'Тепло и солнечно' :
                       (selectedCity?.weather || city?.weather) === 'rainy' ? 'Возможны осадки' : 'Прохладно'}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {city ? 'Сохранить изменения' : 'Добавить город'}
          </button>
        </div>
      </div>
    </div>
  );
}
