import React, { useState } from 'react';
import { Bug, AlertTriangle } from 'lucide-react';

const ErrorTestComponent = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    // Bu intentional olarak hata fırlatır
    throw new Error('Bu test amaçlı bir hatadır! Error Boundary çalışıyor.');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bug className="h-8 w-8 text-orange-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Boundary Test</h2>
          <p className="text-gray-600 mb-6">
            Bu buton Error Boundary sistemini test etmek için kullanılır.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-yellow-800">Dikkat!</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Bu butona tıklamak intentional olarak bir hata fırlatır ve Error Boundary sayfasını gösterir.
                  Sadece test amaçlıdır.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShouldThrow(true)}
            className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Error Boundary'yi Test Et
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Hata sayfasından "Sayfayı Yenile" butonu ile buraya geri dönebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorTestComponent;
