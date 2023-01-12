export default class OrderService {
    placeOrder(order: any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                resolve(Date.now().toString())
            }, 3000)
        })
    }
}