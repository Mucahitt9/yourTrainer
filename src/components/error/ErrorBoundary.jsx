import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // State'i güncelle böylece bir sonraki render'da fallback UI gösterilir
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Hata detaylarını state'e kaydet
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Hata raporlama servisi burada çağrılabilir
    console.error('ErrorBoundary yakaladı:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/clients/new';
  };

  handleToggleDetails = () => {
    this.setState(prev => ({ 
      showDetails: !prev.showDetails 
    }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            {/* Ana Error Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-8 text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Ups! Bir Sorun Oluştu</h1>
                <p className="text-red-100">
                  Beklenmeyen bir hata meydana geldi. Endişelenmeyin, verileriniz güvende.
                </p>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* Kullanıcı Dostu Açıklama */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Ne Yapabilirsiniz?</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Sayfayı yenilemeyi deneyin</li>
                      <li>• Anasayfaya geri dönün</li>
                      <li>• Eğer sorun devam ederse, lütfen bizimle iletişime geçin</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={this.handleReload}
                      className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Sayfayı Yenile</span>
                    </button>
                    
                    <button
                      onClick={this.handleGoHome}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
                    >
                      <Home className="h-4 w-4" />
                      <span>Anasayfa</span>
                    </button>
                  </div>

                  {/* Teknik Detaylar (Geliştirme modunda) */}
                  {(process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') && (
                    <div className="border-t border-gray-200 pt-4">
                      <button
                        onClick={this.handleToggleDetails}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1"
                      >
                        <Bug className="h-4 w-4" />
                        <span>
                          {this.state.showDetails ? 'Teknik Detayları Gizle' : 'Teknik Detayları Göster'}
                        </span>
                      </button>
                      
                      {this.state.showDetails && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border text-xs font-mono">
                          <div className="mb-2">
                            <strong>Hata:</strong>
                            <div className="text-red-600">{this.state.error && this.state.error.toString()}</div>
                          </div>
                          <div>
                            <strong>Stack Trace:</strong>
                            <pre className="mt-1 text-gray-600 overflow-x-auto whitespace-pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 text-center">
                <p className="text-xs text-gray-500">
                  YourTrainer v1.2 • Bu hata otomatik olarak raporlandı
                </p>
              </div>
            </div>

            {/* Alt bilgi */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Sorun devam ederse{' '}
                <a 
                  href="mailto:support@yourtrainer.com" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  destek@yourtrainer.com
                </a>
                {' '}adresine yazabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Hata yoksa normal içeriği render et
    return this.props.children;
  }
}

export default ErrorBoundary;
