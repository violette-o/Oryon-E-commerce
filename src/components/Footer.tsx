import { Truck, CreditCard, Headphones } from 'lucide-react'

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#3dbdb0',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      gap: '80px',
      padding: '28px',
      fontSize: '14px',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Truck size={22} />
        <span>Fast shipping</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <CreditCard size={22} />
        <span>Secure payments</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Headphones size={22} />
        <span>Customer support</span>
      </div>
    </footer>
  )
}

export default Footer