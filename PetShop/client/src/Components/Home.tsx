
import { useNavigate } from 'react-router';
import '../Assets/CSS/Home.css'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to the Dog Shop</h1>
        <p>Find your perfect furry companion</p>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <img src="/images/DogsShop.jpg" alt="Quality Dogs" />
          <h2>Premium Quality</h2>
          <p>All our dogs come from certified breeders and receive the best care</p>
        </div>
        <div className="feature-card">
          <img src="/images/DogsShop_2.jpg" alt="Dog Care" />
          <h2>Expert Care</h2>
          <p>Regular veterinary checkups and proper vaccination for all our dogs</p>
        </div>
        <div className="feature-card">
          <img src="/images/DogsShop_3.jpg" alt="Support" />
          <h2>24/7 Support</h2>
          <p>Professional guidance and support even after adoption</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Meet Your New Best Friend?</h2>
        <p>Browse our selection of lovely dogs waiting for their forever homes</p>
        <button className="cta-button" onClick={() => navigate('/dogs')}>
          View Our Dogs
        </button>
      </div>
    </div>
  )
}

export default Home;