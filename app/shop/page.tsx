import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import ShopClient from './ShopClient';
import TrustSignals from '../components/TrustSignals';
import { getProducts, seedExampleProducts } from '@/app/actions/products';

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  const products = await getProducts();

  // Automatic seeding disabled in favor of manual SQL scripts
  /*
  if (products.length === 0) {
    await seedExampleProducts();
    products = await getProducts();
  }
  */

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#d4af37]/5">
      <Navbar />
      <ShopClient products={products} />
      <TrustSignals />
      <CartSidebar />
    </div>
  );
}
