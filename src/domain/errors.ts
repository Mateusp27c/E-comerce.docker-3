export class ValidationError extends Error {}

export class PaymentError extends Error {}


export class OrderNotFoundError extends Error {
  constructor(id: number) {
    super(`Pedido ${id} não encontrado`);
  }
}
