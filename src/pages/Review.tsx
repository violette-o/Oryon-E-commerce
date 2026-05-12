import Navbar from '../components/Navbar'
import SharedFooter from '../components/SharedFooter'
import './Review.css'

export default function Review() {
  return (
    <div className="review-page">
      <Navbar />

      <div className="review-container">
        <h1>Order Review</h1>

        <div className="review-card">
          <h2>✓ Your order has been placed successfully!</h2>

          <p>
            Thank you for shopping with us.
          </p>

          <p>
            Your payment was processed correctly and your order is now being prepared.
          </p>
        </div>
      </div>

      <SharedFooter />
    </div>
  )
}