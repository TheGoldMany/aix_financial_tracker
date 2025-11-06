import Link from 'next/link';
import { ArrowRight, BarChart3, Receipt, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Pénzügyi Követő</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-gray-900 font-medium"
            >
              Bejelentkezés
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Regisztráció
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Pénzügyeid egyszerűen, magyarul
          </h1>
          <p className="text-xl text-gray-600 mb-10">
            Kövesd nyomon bevételeidet, kiadásaidat és kezeld vállalkozásod
            könyvelését egy helyen. Magyar jogszabályoknak megfelelő számlagenerálás.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition text-lg font-semibold inline-flex items-center"
            >
              Ingyenes kezdés
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition text-lg font-semibold"
            >
              Tudj meg többet
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Gyors használat
            </h3>
            <p className="text-gray-600">
              Intuítív felület, amivel percek alatt rögzítheted bevételeidet és kiadásaidat
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Okos elemzések
            </h3>
            <p className="text-gray-600">
              Átlátható grafikonok és statisztikák a pénzügyeid jobb megértéséhez
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Receipt className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Számlagenerálás
            </h3>
            <p className="text-gray-600">
              Jogszerű magyar számlák készítése néhány kattintással (Pro verzió)
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Biztonságos
            </h3>
            <p className="text-gray-600">
              Bank-szintű titkosítás és GDPR-kompatibilis adatkezelés
            </p>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Árak
          </h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Válassz a személyes és vállalkozói csomagok közül
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ingyenes</h3>
              <p className="text-gray-600 mb-6">Személyes pénzügyek követése</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">0 Ft</span>
                <span className="text-gray-600">/hónap</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Bevétel és kiadás követés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Kategória alapú költségvetés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Megtakarítás kezelés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">Alapvető riportok</span>
                </li>
              </ul>
              <Link
                href="/register"
                className="block w-full bg-gray-200 text-gray-900 text-center px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Regisztráció
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-blue-600 p-8 rounded-xl shadow-lg border-2 border-blue-700 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-semibold">
                Népszerű
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-blue-100 mb-6">Vállalkozói könyvelés és számlázás</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">4 990 Ft</span>
                <span className="text-blue-100">/hónap</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span className="text-white">Minden ingyenes funkció</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span className="text-white">Kettős könyvvitel</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span className="text-white">Magyar szabályos számlakészítés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span className="text-white">Pénzügyi kimutatások</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-400 mr-2">✓</span>
                  <span className="text-white">Többfelhasználós hozzáférés</span>
                </li>
              </ul>
              <Link
                href="/register?plan=pro"
                className="block w-full bg-white text-blue-600 text-center px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold"
              >
                Pro indítás
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-32 py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Pénzügyi Követő. Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}
