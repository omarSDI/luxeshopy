import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import TrustSignals from './components/TrustSignals';
import AdminSeedButton from './components/AdminSeedButton';
import { getProducts } from './actions/products';

export default async function Home() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-end">
        <AdminSeedButton />
      </div>
      <ProductGrid products={products} />
      <TrustSignals />
      <CartSidebar />
    </div>
  );
}
