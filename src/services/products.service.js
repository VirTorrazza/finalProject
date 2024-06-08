import Repository from "./repository.js";

export default class ProductsService extends Repository {
    constructor(dao) {
        super(dao);
    }

    async getAll(filters, paginateOptions) {
        try {
            return await this.dao.getAll(filters, paginateOptions);
        } catch (error) {
            console.error("Error getting all products:", error);
            throw new Error(`Error getting all products: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            return await this.dao.getById(id);
        } catch (error) {
            console.error("Error getting product by ID:", error);
            throw new Error(`Error getting product by ID: ${error.message}`);
        }
    }

    async getByCode(code) {
        try {
            const product = await this.dao.getByCode(code);
            return product;
        } catch (error) {
            throw new Error(`Error finding product by code: ${error.message}`);
        }
    }

    async save(data) {
        try {
            return await this.dao.save(data);
        } catch (error) {
            console.error("Error saving product:", error);
            throw new Error(`Error saving product: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            return await this.dao.update(id, data);
        } catch (error) {
            console.error("Error updating product:", error);
            throw new Error(`Error updating product: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            return await this.dao.delete(id);
        } catch (error) {
            console.error("Error deleting product:", error);
            throw new Error(`Error deleting product: ${error.message}`);
        }
    }
}
