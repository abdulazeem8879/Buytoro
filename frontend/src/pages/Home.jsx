import { useContext, useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import { CartContext } from "../context/CartContext";

const Home = () => {
  // product list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500">Latest Watches</h1>
      {products.length === 0 ? (
        <p>No Products Found</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product._id}>
              <h3>{product.name}</h3>
              <p>Brand : {product.brand}</p>
              <p>Price : $ {product.price}</p>
              <img src={product.image} alt={product.name} />

              {/* Add to Cart Button */}
              <button onClick={() => addToCart(product, 1)}>Add to Cart</button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
