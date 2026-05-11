import './Hero.css'
import iphoneHero from '../assets/Iphone Hero.png'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1 className="hero-title">Upgrade the way you experience tech</h1>
        <p className="hero-subtitle">
          From powerful audio to smart devices, find everything you need in one place.
        </p>
        <button className="hero-btn">Shop now</button>
      </div>
      <img src={iphoneHero} alt="iPhone Hero" className="hero-img" />
    </section>
  )
}

export default Hero