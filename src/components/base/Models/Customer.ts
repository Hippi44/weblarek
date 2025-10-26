import { IBuyer } from "../../../types/index.ts";

export interface ValidationErrors {
    [key: string]: string;
}

export class Customer {
    payment: IBuyer['payment'] = "";
    address: string = "";
    phone: string = "";
    email: string = "";
    
    constructor(data: Partial<IBuyer> = {}) {
        this.payment = data.payment || "";
        this.address = data.address || "";
        this.phone = data.phone || "";
        this.email = data.email || "";
    }
    
    setData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.email !== undefined) this.email = data.email;
    }
    
    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email
        };
    }
    
    clear(): void {
        this.payment = "";
        this.address = "";
        this.phone = "";
        this.email = "";
    }
    
    validateData(): ValidationErrors {
        const errors: ValidationErrors = {};
        
        if (!this.payment) {
            errors.payment = 'Не выбран вид оплаты';
        }
        
        if (!this.address) {
            errors.address = 'Укажите адрес';
        }
        
        if (!this.phone) {
            errors.phone = 'Укажите телефон';
        }
        
        if (!this.email) {
            errors.email = 'Укажите email';
        }
        
        return errors;
    }
}
