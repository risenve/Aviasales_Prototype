import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RouteTimeline } from './components/RouteTimeline';
import { CityModal } from './components/CityModal';
import { RouteOverview } from './components/RouteOverview';
import { Toaster } from './components/ui/sonner';

export interface CitySegment {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  arrivalDate: string;
  days: number;
  weather: 'sunny' | 'rainy' | 'cold';
  events: string[];
  transport: string[];
  priceRange?: string;
}

const initialRoute: CitySegment[] = [
  {
    id: '1',
    city: 'Москва',
    country: 'Россия',
    lat: 55.7558,
    lng: 37.6173,
    arrivalDate: '2025-06-01',
    days: 0,
    weather: 'sunny',
    events: [],
    transport: ['✈️'],
    priceRange: '—'
  },
  {
    id: '3',
    city: 'Дубай',
    country: 'ОАЭ',
    lat: 25.2048,
    lng: 55.2708,
    arrivalDate: '2025-06-04',
    days: 4,
    weather: 'sunny',
    events: [],
    transport: ['✈️'],
    priceRange: '20 000 – 35 000 ₽'
  },
  {
    id: '4',
    city: 'Москва',
    country: 'Россия',
    lat: 55.7558,
    lng: 37.6173,
    arrivalDate: '2025-06-08',
    days: 0,
    weather: 'sunny',
    events: [],
    transport: ['✈️'],
    priceRange: '18 000 – 28 000 ₽'
  }
];

export default function App() {
  const [route, setRoute] = useState<CitySegment[]>(initialRoute);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<CitySegment | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [mapLayer, setMapLayer] = useState<'routes' | 'weather' | 'events'>('routes');

  const handleAddCity = (index: number) => {
    setInsertIndex(index);
    setEditingCity(null);
    setModalOpen(true);
  };

  const handleEditCity = (city: CitySegment) => {
    setEditingCity(city);
    setInsertIndex(null);
    setModalOpen(true);
  };

  const handleSaveCity = (city: CitySegment) => {
    if (editingCity) {
      // Редактирование существующего города
      setRoute(route.map(c => c.id === city.id ? city : c));
    } else if (insertIndex !== null) {
      // Добавление нового города
      const newRoute = [...route];
      newRoute.splice(insertIndex, 0, city);
      setRoute(newRoute);
    }
    setModalOpen(false);
    setEditingCity(null);
    setInsertIndex(null);
  };

  const handleDeleteCity = (id: string) => {
    setRoute(route.filter(c => c.id !== id));
  };

  const handleReorderCities = (newRoute: CitySegment[]) => {
    setRoute(newRoute);
  };

  const handleSearchFlights = () => {
    setShowOverview(true);
  };

  const handleBackToConstructor = () => {
    setShowOverview(false);
  };

  if (showOverview) {
    return (
      <>
        <RouteOverview
          route={route}
          onBack={handleBackToConstructor}
          onSearch={() => alert('Переход к поиску билетов...')}
        />
        <Toaster />
      </>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        {/* Шапка */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <h1 className="text-blue-600 text-2xl">Aviasales</h1>
                <nav className="flex gap-6">
                  <button className="text-gray-600 hover:text-gray-900">Авиабилеты</button>
                  <button className="text-blue-600 border-b-2 border-blue-600 pb-1">Сложный маршрут</button>
                  <button className="text-gray-600 hover:text-gray-900">Отели</button>
                </nav>
              </div>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="mb-6">
            <h2 className="text-3xl mb-2">Конструктор сложного маршрута</h2>
            <p className="text-gray-600">
              Создайте идеальное путешествие, посетив несколько городов за одну поездку
            </p>
          </div>

          {/* Карта - скрыта */}
          {/* <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex gap-2">
                <button
                  className={`px-4 py-2 rounded-lg ${mapLayer === 'routes' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setMapLayer('routes')}
                >
                  Маршрут
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${mapLayer === 'weather' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setMapLayer('weather')}
                >
                  Погода
                </button>
                <button
                  className={`px-4 py-2 rounded-lg ${mapLayer === 'events' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                  onClick={() => setMapLayer('events')}
                >
                  События
                </button>
              </div>
            </div>
            <MapView route={route} layer={mapLayer} />
          </div> */}

          {/* Таймлайн маршрута */}
          <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
            <h3 className="text-xl mb-4">Ваш маршрут</h3>
            <RouteTimeline
              route={route}
              onAddCity={handleAddCity}
              onEditCity={handleEditCity}
              onDeleteCity={handleDeleteCity}
              onReorder={handleReorderCities}
            />
          </div>

          {/* Кнопка поиска */}
          <div className="flex justify-center">
            <button
              className="bg-blue-600 text-white px-12 py-4 rounded-lg hover:bg-blue-700 transition-colors text-lg"
              onClick={handleSearchFlights}
            >
              Найти билеты
            </button>
          </div>
        </main>

        {/* Модальное окно */}
        {modalOpen && (
          <CityModal
            city={editingCity}
            onSave={handleSaveCity}
            onClose={() => {
              setModalOpen(false);
              setEditingCity(null);
              setInsertIndex(null);
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}