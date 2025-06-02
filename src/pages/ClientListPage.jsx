import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Plus, UserPlus, Filter, TrendingUp, BarChart3 } from 'lucide-react';
import { getFromLocalStorage } from '../utils/helpers';
import { useToast } from '../utils/ToastContext';
import { useDebounce, usePerformanceMonitor } from '../hooks/usePerformance';
import ClientCard from '../components/client/ClientCard';
import { ClientListSkeleton } from '../components/client/ClientSkeletons';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

// Memoized Search Input Component
const SearchInput = memo(({ value, onChange, placeholder, disabled }) => (
  <div className="relative">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="input-field pl-10 transition-all duration-200"
    />
  </div>
));

SearchInput.displayName = 'SearchInput';

// Memoized Filter Select Component
const FilterSelect = memo(({ value, onChange, options, disabled }) => (
  <div className="relative">
    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="input-field pl-10 appearance-none transition-all duration-200"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
));

FilterSelect.displayName = 'FilterSelect';

// Memoized Stats Component
const ClientStats = memo(({ 
  totalClients, 
  activeClients, 
  completedClients,
  filteredCount,
  isFiltered 
}) => (
  <div className="space-y-3">
    {/* Desktop: Tek satır */}
    <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-blue-100 rounded-full border border-blue-300"></div>
        <span>Toplam: <span className="font-medium text-gray-900">{totalClients}</span></span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-100 rounded-full border border-green-300"></div>
        <span>Aktif: <span className="font-medium text-green-700">{activeClients}</span></span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-100 rounded-full border border-red-300"></div>
        <span>Tamamlanan: <span className="font-medium text-red-700">{completedClients}</span></span>
      </div>
      {isFiltered && (
        <div className="flex items-center space-x-2 text-primary-600">
          <TrendingUp className="h-4 w-4" />
          <span>Görüntülenen: <span className="font-medium">{filteredCount}</span></span>
        </div>
      )}
    </div>

    {/* Mobile: İki satır */}
    <div className="md:hidden space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-2.5 h-2.5 bg-blue-100 rounded-full border border-blue-300"></div>
            <span className="text-gray-600">Toplam: <span className="font-medium text-gray-900">{totalClients}</span></span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2.5 h-2.5 bg-green-100 rounded-full border border-green-300"></div>
            <span className="text-gray-600">Aktif: <span className="font-medium text-green-700">{activeClients}</span></span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-red-100 rounded-full border border-red-300"></div>
          <span className="text-gray-600">Tamamlanan: <span className="font-medium text-red-700">{completedClients}</span></span>
        </div>
        {isFiltered && (
          <div className="flex items-center space-x-1 text-primary-600">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs">Gösterilen: <span className="font-medium">{filteredCount}</span></span>
          </div>
        )}
      </div>
    </div>
  </div>
));

ClientStats.displayName = 'ClientStats';

// Memoized Empty State Component
const EmptyState = memo(({ 
  hasClients, 
  isFiltered, 
  searchTerm, 
  statusFilter 
}) => {
  if (!hasClients) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz müşteri eklenmemiş</h3>
        <p className="text-gray-500 mb-6">İlk müşterinizi ekleyerek başlayın.</p>
        <Link
          to="/clients/new"
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          İlk Müşteriyi Ekle
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç bulunamadı</h3>
      <p className="text-gray-500 mb-4">
        {searchTerm ? `"${searchTerm}" araması` : 'Seçilen filtreler'} için müşteri bulunmuyor.
      </p>
      <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
        <span>Arama: "{searchTerm || 'Yok'}"</span>
        <span>•</span>
        <span>Durum: {statusFilter === 'all' ? 'Tümü' : statusFilter === 'active' ? 'Aktif' : 'Tamamlanan'}</span>
      </div>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

// Main Component
const ClientListPage = () => {
  const { toast } = useToast();
  
  // Performance monitoring
  const renderCount = usePerformanceMonitor('ClientListPage');
  
  // State
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  // Debounced search for performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Load clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        setLoading(true);
        // Simulate API delay in development
        if (process.env.NODE_ENV === 'development') {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const savedClients = getFromLocalStorage('musteriler', []);
        setClients(savedClients);
      } catch (error) {
        console.error('Error loading clients:', error);
        toast.error('Müşteri verileri yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [toast]);

  // Memoized client statistics
  const clientStats = useMemo(() => {
    const now = new Date();
    const active = clients.filter(client => {
      if (!client.tahmini_bitis_tarihi) return true;
      return new Date(client.tahmini_bitis_tarihi) > now;
    });
    const completed = clients.filter(client => {
      if (!client.tahmini_bitis_tarihi) return false;
      return new Date(client.tahmini_bitis_tarihi) <= now;
    });

    return {
      total: clients.length,
      active: active.length,
      completed: completed.length
    };
  }, [clients]);

  // Memoized filtered clients with performance optimization
  const filteredClients = useMemo(() => {
    if (!clients.length) return [];

    let filtered = clients;

    // Search filter
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(client => {
        const fullName = `${client.ad} ${client.soyad}`.toLowerCase();
        const firstName = client.ad.toLowerCase();
        const lastName = client.soyad.toLowerCase();
        
        return fullName.includes(searchLower) ||
               firstName.includes(searchLower) ||
               lastName.includes(searchLower);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(client => {
        if (!client.tahmini_bitis_tarihi) return statusFilter === 'active';
        const endDate = new Date(client.tahmini_bitis_tarihi);
        
        return statusFilter === 'active' ? endDate > now : endDate <= now;
      });
    }

    return filtered;
  }, [clients, debouncedSearchTerm, statusFilter]);

  // Optimized handlers
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e) => {
    setStatusFilter(e.target.value);
  }, []);

  const handleDeleteClick = useCallback((client) => {
    setSelectedClient(client);
    setShowDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedClient) return;
    
    setDeleteLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newClientList = clients.filter(c => c.id !== selectedClient.id);
      setClients(newClientList);
      localStorage.setItem('musteriler', JSON.stringify(newClientList));
      
      toast.success(`${selectedClient.ad} ${selectedClient.soyad} adlı müşteri başarıyla silindi.`, {
        title: 'Müşteri Silindi!',
        duration: 4000
      });
      
      setShowDeleteModal(false);
      setSelectedClient(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Müşteri silinirken beklenmeyen bir hata oluştu.', {
        title: 'Silme Hatası!',
        duration: 5000
      });
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedClient, clients, toast]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
    setSelectedClient(null);
  }, []);

  // Filter options
  const filterOptions = useMemo(() => [
    { value: 'all', label: 'Tüm Müşteriler' },
    { value: 'active', label: 'Aktif Müşteriler' },
    { value: 'completed', label: 'Tamamlanan Müşteriler' }
  ], []);

  const isFiltered = debouncedSearchTerm.trim() !== '' || statusFilter !== 'all';

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="animate-pulse">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Client List Skeleton */}
        <ClientListSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Müşteri Listesi</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Toplam {clientStats.total} müşteri • {filteredClients.length} görüntüleniyor
            </p>
          </div>
        </div>
        
        <Link
          to="/clients/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 flex-shrink-0 btn-mobile"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span className="whitespace-nowrap">Yeni Müşteri Ekle</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 card-animate">
        <div className="space-y-6">
          {/* Search and Filter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <SearchInput
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Müşteri ara..."
              disabled={loading}
            />

            {/* Status Filter */}
            <FilterSelect
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={filterOptions}
              disabled={loading}
            />
          </div>

          {/* Statistics Row */}
          <div className="border-t border-gray-200 pt-4">
            <ClientStats
              totalClients={clientStats.total}
              activeClients={clientStats.active}
              completedClients={clientStats.completed}
              filteredCount={filteredClients.length}
              isFiltered={isFiltered}
            />
          </div>
        </div>

        {/* Performance Info (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-4 text-sm text-blue-700">
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-4 w-4" />
                <span>Render #{renderCount}</span>
              </div>
              <span>•</span>
              <span>Search debounce: {debouncedSearchTerm !== searchTerm ? 'Active' : 'Idle'}</span>
              <span>•</span>
              <span>Filtered: {filteredClients.length}/{clients.length}</span>
            </div>
          </div>
        )}
      </div>

      {/* Client List */}
      {filteredClients.length === 0 ? (
        <EmptyState
          hasClients={clients.length > 0}
          isFiltered={isFiltered}
          searchTerm={debouncedSearchTerm}
          statusFilter={statusFilter}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClients.map((client, index) => (
            <ClientCard
              key={client.id}
              client={client}
              onDeleteClick={handleDeleteClick}
              className={`animate-slide-up animate-stagger-${Math.min(index % 4 + 1, 4)}`}
            />
          ))}
        </div>
      )}

      {/* Performance tip for large lists */}
      {filteredClients.length > 50 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-amber-800">Performance Tip</h4>
              <p className="text-sm text-amber-700 mt-1">
                {filteredClients.length} müşteri görüntüleniyor. Daha iyi performans için arama veya filtreleri kullanın.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        customerName={selectedClient ? `${selectedClient.ad} ${selectedClient.soyad}` : ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default memo(ClientListPage);
