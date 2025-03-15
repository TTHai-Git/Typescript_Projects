import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Dog, DogsCart } from "../Interface/Dogs";
import '../Assets/CSS/DogsPage.css';
import { useCart } from "../Context/Cart";
import axios from "axios";

const DogsPage: React.FC = () => {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { page } = useParams<{ page?: string }>(); // Get page number from URL
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [current, setCurrent] = useState<number>(Number(page) || 1);
  const [pages, setPages] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    async function fetchDogs() {
      setLoading(true)
      try {
        const response = await axios.get(`/v1/dogs/${current}`);
        setDogs(response.data.dogs);
        setPages(response.data.pages);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      } finally {
        setLoading(false)
      }
    }
    fetchDogs();
  }, [current]); // Fetch new dogs when `current` page changes

  const handleAddToCart = (dog: DogsCart) => {
    addToCart(dog);
  };

  const changePage = (newPage: number) => {
    if (newPage > 0 && newPage <= pages) {
      setCurrent(newPage); // Update state to trigger `useEffect()`
      navigate(`/dogs/${newPage}`);
    }
  };

  return (
    <section className="dogs-container">
      <h1 className="header">Our Dogs</h1>
      <p className="total-count">Total Dogs: {total}</p>
      {loading ? (<p className="loading">🔄 Loading order details...</p>) : (<div className="dog-list">
        {dogs.map((dog) => (
          <div key={dog._id} className="dog-card">
            <img src={dog.imageUrl} alt={dog.name} />
            <h3>{dog.name}</h3>
            <p>{dog.breed}</p>
            <p>${dog.price}</p>
            <button className="add-to-cart-btn" onClick={() => handleAddToCart(dog)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>)}
      

      {/* Pagination Controls */}
      <div className="pagination">
        <button className="page-btn" onClick={() => changePage(1)} disabled={current === 1}>
          First
        </button>
        <button className="page-btn" onClick={() => changePage(current - 1)} disabled={current === 1}>
          Previous
        </button>
        <span className="current-page">
          Page {current} of {pages}
        </span>
        <button className="page-btn" onClick={() => changePage(current + 1)} disabled={current === pages}>
          Next
        </button>
        <button className="page-btn" onClick={() => changePage(pages)} disabled={current === pages}>
          Last
        </button>
      </div>
      
    </section>
  );
};

export default DogsPage;
