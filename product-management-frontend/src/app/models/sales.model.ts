
export interface SaleItemRequest {
    productId: number;
    quantity: number;
}

export interface SaleRequest {
    paymentMethod: string;
    items: SaleItemRequest[];
}

export interface SaleResponse {
    id: number;
    totalAmount: number;
    saleDate: string; // ISO string from Java LocalDateTime
    message: string;
}