import mongoose, { Document, Schema } from 'mongoose';

interface CartItem {
    productId: mongoose.Schema.Types.ObjectId;
    quantity: number;
}

interface Cart extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    cartItems: CartItem[];
}

const CartItemSchema = new Schema<CartItem>({
    productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const CartSchema = new Schema<Cart>({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    cartItems: {
        type: [CartItemSchema],
        required: true,
        default: []
    }
}, { timestamps: true });

export const Cart = mongoose.model<Cart>('Cart', CartSchema);
