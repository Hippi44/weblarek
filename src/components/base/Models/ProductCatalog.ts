import { IProduct } from "../../../types/index.ts";

export class ProductCatalog {
    private items: IProduct[];
    private selectedCard?: IProduct | null;
    
    constructor(items: IProduct[] = []) {
        this.items = items;
        this.selectedCard = null;
    }

    setItems(items: IProduct[]): void {
        this.items = items;
    }
    
    getItems(): IProduct[] {
        return this.items;
    }
    
    getItem(id: string): IProduct | null {
        const item = this.items.find(product => product.id === id);
        return item || null;
    }
  
    setSelectedCard(card: IProduct): void {
        this.selectedCard = card;
    }
    
    getSelectedCard(): IProduct | null {
        return this.selectedCard || null;
    }
}