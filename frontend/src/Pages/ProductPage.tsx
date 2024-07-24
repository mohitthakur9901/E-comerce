import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Card from "../Components/Card";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cart/cartslice";

import toast from "react-hot-toast";

interface Product {
  _id: string;
  productImage: string
  productName: string
  productPrice: string
  productDescription: string
  productCategory: string
  productQuantity: number
}

const ProductPage = () => {
  const access_token = Cookies.get('access_token');


  const [products, setProducts] = useState<Product[]>(
    [{
      _id: "",
      productImage: "",
      productName: "",
      productPrice: "",
      productDescription: "",
      productCategory: "",
      productQuantity: 0,
    }]
  );

  const dispatch = useDispatch();

  const handleProducts = async () => {
    try {
      const response = await fetch("/api/v1/getAllProduct", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${access_token}`
        }
      });
      const data = await response.json();
      console.log(data);

      setProducts(data.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    try {
      dispatch(addToCart({
        productId: product._id,
        productImage: product.productImage,
        productName: product.productName,
        productPrice: product.productPrice,
        productQuantity: 1,
        productDescription: ""
      }));
      toast.success("Added to cart");
    } catch (error) {
      toast.error("Error adding to cart");
    }
  };

  return (
    <div className="flex flex-wrap justify-center">
      {products.map((product) => (
        <Card
          key={product._id}
          product={product}
          addToCart={() => handleAddToCart(product)}
        />
      ))}
    </div>
  );
};

export default ProductPage;
