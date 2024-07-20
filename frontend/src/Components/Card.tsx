import React from "react";
import Button from "./Button";

interface Product {
    _id: string;
    productImage: string;
    productName: string;
    productPrice: string;
    addToCart: () => void;
}

const Card: React.FC<Product> = ({
    productImage,
    productName,
    productPrice,
    addToCart
}) => {
    return (
        <div className="flex flex-col items-center justify-center max-w-sm rounded overflow-hidden shadow-lg bg-white m-4 ">
            <img className="h-[150px] w-[100px]  object-cover transition duration-500 group-hover:scale-105 sm:h-[200px] sm:w-[250px]" src={productImage} alt={productName} />
            <div className="px-6 py-2">
                <div className="font-bold text-lg mb-2 uppercase">{productName}</div>
            </div>
            <div className="px-6  pb-2">
                <span className="block text-gray-600 text-sm mb-2">Price: ₹ {productPrice}</span>
            </div>
            <Button onClick={addToCart} type="button" className="mb-2">
                Add to Cart
            </Button>
        </div>
    );
};

export default Card;
