import iphoneHero from '../assets/Iphone Hero.png'

const Hero = () => {
  return (
    <section style={{
      backgroundColor: '#2b2b2b',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '60px 60px 0px 60px',
      minHeight: '500px',
      fontFamily: 'Poppins, sans-serif',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{ maxWidth: '320px', paddingBottom: '60px', zIndex: 1 }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '600',
          lineHeight: '1.3',
          marginBottom: '16px',
          textAlign: 'left'
        }}>
          Upgrade the way you experience tech
        </h1>
        <p style={{
          fontSize: '13px',
          color: '#ccc',
          marginBottom: '32px',
          lineHeight: '1.6',
          textAlign: 'left'
        }}>
          From powerful audio to smart devices, find everything you need in one place.
        </p>
        <button style={{
          padding: '10px 28px',
          backgroundColor: 'transparent',
          border: '1px solid #5bbfb5',
          color: '#5bbfb5',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'Poppins, sans-serif'
        }}>
          Shop now
        </button>
      </div>

      <img
      src={iphoneHero}
      alt="iPhone Hero"
      style={{
    height: '1000px',
    objectFit: 'contain',
    display: 'block',
    marginBottom: '-300px',
    marginRight: '-120px',
    width: '1000px'
  }}
/>
    </section>
  )
}

export default Hero