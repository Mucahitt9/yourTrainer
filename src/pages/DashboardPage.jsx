import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { db } from '../utils/supabase';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Clock,
  Activity,
  Star,
  AlertCircle,
  CheckCircle,
  Target,
  Award
} from 'lucide-react';

const DashboardPage = () => {
  const { currentPT } = useAuth();
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    completedClients: 0,
    totalRevenue: 0,
    thisMonthRevenue: 0,
    averageSessionPrice: 0,
    upcomingEnds: []
  });
  const [loading, setLoading] = useState(true);

  // Supabase'den müşteri verilerini çek
  const loadClientData = useCallback(async () => {
    if (!currentPT?.id) return;

    try {
      setLoading(true);
      
      // Müşteri verilerini çek
      const { data: clients, error } = await db.clients.getAll(currentPT.id);
      
      if (error) {
        console.error('Error loading clients:', error);
        return;
      }

      if (clients) {
        calculateStats(clients);
      }
    } catch (error) {
      console.error('Error in loadClientData:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPT?.id]);

  // İstatistikleri hesapla
  const calculateStats = (clients) => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Temel istatistikler
    const totalClients = clients.length;
    const activeClients = clients.filter(client => {
      if (!client.tahmini_bitis_tarihi) return true;
      return new Date(client.tahmini_bitis_tarihi) > now;
    }).length;
    const completedClients = totalClients - activeClients;
    
    // Gelir hesaplamaları
    const totalRevenue = clients.reduce((sum, client) => sum + (client.toplam_ucret || 0), 0);
    const thisMonthClients = clients.filter(client => 
      new Date(client.created_at) >= thisMonth
    );
    const thisMonthRevenue = thisMonthClients.reduce((sum, client) => sum + (client.toplam_ucret || 0), 0);
    
    // Ortalama ders fiyatı
    const averageSessionPrice = totalClients > 0 
      ? clients.reduce((sum, client) => sum + (client.ders_basina_ucret || 0), 0) / totalClients 
      : 0;
    
    // Yaklaşan bitiş tarihleri (30 gün içinde)
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(now.getDate() + 30);
    
    const upcomingEnds = clients
      .filter(client => {
        if (!client.tahmini_bitis_tarihi) return false;
        const endDate = new Date(client.tahmini_bitis_tarihi);
        return endDate > now && endDate <= thirtyDaysLater;
      })
      .sort((a, b) => new Date(a.tahmini_bitis_tarihi) - new Date(b.tahmini_bitis_tarihi))
      .slice(0, 5);

    setStats({
      totalClients,
      activeClients,
      completedClients,
      totalRevenue,
      thisMonthRevenue,
      averageSessionPrice,
      upcomingEnds
    });
  };

  // Component mount olduğunda veri yükle
  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  const quickActions = [
    {
      title: 'Yeni Müşteri Ekle',
      description: 'Hızla yeni müşteri kaydı oluştur',
      href: '/clients/new',
      icon: UserPlus,
      color: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Müşteri Listesi',
      description: 'Tüm müşterilerini görüntüle',
      href: '/clients/list',
      icon: Users,
      color: 'bg-green-600 hover:bg-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Profil Ayarları',
      description: 'Profil bilgilerini güncelle',
      href: '/profile',
      icon: Award,
      color: 'bg-purple-600 hover:bg-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }, []);

  const formatDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  }, []);

  const getDaysUntil = useCallback((dateString) => {
    const targetDate = new Date(dateString);
    const today = new Date();
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gray-200 animate-pulse rounded-2xl h-48"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Hoş geldin, {currentPT?.ad} {currentPT?.soyad}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              {stats.totalClients > 0 
                ? `${stats.totalClients} müşterinle harika gidiyorsun! İşte PT istatistiklerin.`
                : 'İlk müşterini eklemeye hazır mısın? Hemen başlayalım!'
              }
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Activity className="h-16 w-16 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift animate-slide-up animate-stagger-1">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center hover-scale">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift animate-slide-up animate-stagger-2">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center hover-scale">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Müşteri</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift animate-slide-up animate-stagger-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center hover-scale">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover-lift animate-slide-up animate-stagger-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center hover-scale">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bu Ay Gelir</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.thisMonthRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-animate">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hızlı İşlemler</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.href}
                    className="group p-6 border border-gray-200 rounded-xl hover:border-gray-300 hover-lift transition-all duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 ${action.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-6 w-6 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                          {action.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-animate">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detaylı İstatistikler</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center hover-scale">
                    <Target className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ortalama Ders Fiyatı</p>
                    <p className="text-xs text-gray-500">Tüm müşteriler</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-indigo-600">
                  {formatCurrency(stats.averageSessionPrice)}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover-lift">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center hover-scale">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tamamlanan Müşteri</p>
                    <p className="text-xs text-gray-500">Dersleri biten</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-red-600">
                  {stats.completedClients}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Ends & Recent Activity */}
        <div className="space-y-6">
          {/* Yaklaşan Bitiş Tarihleri */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-orange-500 mr-2" />
              Yaklaşan Bitiş Tarihleri
            </h3>
            {stats.upcomingEnds.length > 0 ? (
              <div className="space-y-3">
                {stats.upcomingEnds.map((client, index) => {
                  const daysLeft = getDaysUntil(client.tahmini_bitis_tarihi);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {client.ad} {client.soyad}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(client.tahmini_bitis_tarihi)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          daysLeft <= 7 
                            ? 'bg-red-100 text-red-800' 
                            : daysLeft <= 14 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {daysLeft} gün
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                {stats.totalClients === 0 ? 
                  'Henüz müşteri yok. İlk müşterini ekle! 🚀' : 
                  'Yaklaşan bitiş tarihi yok 🎉'
                }
              </p>
            )}
          </div>

          {/* Motivasyon kartı */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center space-x-3 mb-3">
              <Star className="h-6 w-6 text-green-200" />
              <h3 className="text-lg font-semibold">
                {stats.totalClients > 0 ? 'Harika Gidiyorsun! 💪' : 'Hadi Başlayalım! 🚀'}
              </h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              {stats.totalClients > 0 ? (
                <>
                  {stats.activeClients} aktif müşterin var ve {formatCurrency(stats.totalRevenue)} toplam gelir elde etmişsin. 
                  Devam et! 🚀
                </>
              ) : (
                'İlk müşterini ekleyerek YourTrainer yolculuğuna başla. Başarı seni bekliyor! 🌟'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;