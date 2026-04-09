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
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App