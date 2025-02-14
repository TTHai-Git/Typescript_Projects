import {useEffect } from "react";
import { Dog, DogsCart } from "../Interface/Dogs";
import '../Assets/CSS/DogsPage.css'
import { useCart } from "../Context/Cart";

interface Prop {
  dogs: Dog[]
}

const DogsPage:React.FC<Prop> = (pros) => {
  const dogs = pros.dogs
  const {addToCart} = useCart()
  
  const handleAddToCart = (dog: DogsCart) => {
    addToCart(dog)
  };
  return (
    <>
    <section className="dogs-container">
      <h1 className="header">Our Dogs</h1>
      <div className="dog-list">
        {dogs.map((dog) => (
          <div key={dog._id} className="dog-card">
            <img src={dog.imageUrl} alt={dog.name} />
            <h3>{dog.name}</h3>
            <p>{dog.breed}</p>
            <p>${dog.price}</p>
            <button 
              className="add-to-cart-btn"
              onClick={() => handleAddToCart(dog)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
    </>
  )
}

export default DogsPage;
