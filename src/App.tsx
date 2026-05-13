import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider }  from './context/AuthContext'
import { CartProvider }  from './context/CartContext'
import Home          from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Login         from './pages/Login'
import Profile       from './pages/Profile'
import Wishlist      from './pages/Wishlist'
import Cart          from './pages/Cart'
import Checkout      from './pages/Checkout'
import Categories    from './pages/Categories'
import CategoryPage  from './pages/Categorypage'
import Offers        from './pages/Offers'
import NewArrivals   from './pages/Newarrivals'
import MyOrders      from './pages/Myorders'
import HelpSupport   from './pages/Helpsupport'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/product"  element={<ProductDetail />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/profile"  element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart"     element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/categories"   element={<Categories />} />
            <Route path="/categories/:category" element={<CategoryPage />} />
            <Route path="/offers"   element={<Offers />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/orders"   element={<MyOrders />} />
            <Route path="/help"     element={<HelpSupport />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App