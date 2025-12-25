// Cart storage using a simple in-memory store (similar to userStorage)
// In production, you might want to use AsyncStorage

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image: string | null;
}

let cart: CartItem[] = [];

export const getCart = (): CartItem[] => {
    return cart;
};

export const saveCart = (newCart: CartItem[]): void => {
    cart = newCart;
};

export const clearCart = (): void => {
    cart = [];
};

export const addToCart = (item: CartItem): void => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
};

export const removeFromCart = (itemId: number): void => {
    cart = cart.filter((item) => item.id !== itemId);
};

export const updateQuantity = (itemId: number, quantity: number): void => {
    const item = cart.find((cartItem) => cartItem.id === itemId);
    if (item) {
        item.quantity = quantity;
    }
};

export const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getCartItemCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
};
